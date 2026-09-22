import { useEffect, useState } from "react";
import { useApi } from "api";

const DEPENDENT = ["level", "phase", "year"];

const COMBINATION_KEY = {
  level: "id_olympic_level",
  phase: "id_olympic_phase",
  year: "id_olympic_year",
};

const EMPTY = { olympic: null, level: null, phase: null, year: null };

const pick = (option) => (option ? { id: option.id, label: option.label } : null);

/**
 * Selection state and option lists for the olympiad / level / phase / year
 * filters, with no opinion about how they are laid out.
 *
 * `restrictToAvailable` pulls the level/phase/year triples that actually hold a
 * question (getTestOptions) and uses them two ways: options that lead nowhere
 * are hidden, and a change that no longer fits any triple clears its siblings.
 * Left off, every lookup list is offered whole — which is what a management
 * screen listing existing questions wants.
 *
 * `enriched` picks the richer olympiad payload the admin listing needs.
 */
export default function useOlympicFilters({
  enriched = false,
  restrictToAvailable = false,
  initialValue,
  onChange,
}) {
  const [value, setValue] = useState(EMPTY);
  const [olympicOptions, setOlympicOptions] = useState([]);
  const [lists, setLists] = useState({ level: [], phase: [], year: [] });
  const [combinations, setCombinations] = useState([]);
  const [availability, setAvailability] = useState("idle");
  const api = useApi();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get(enriched ? "olympic/getAllEnriched" : "olympic/getAll");
        if (!cancelled) setOlympicOptions(data.data.elements || []);
      } catch (error) {
        if (!cancelled) setOlympicOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enriched]);
  const seed = initialValue || EMPTY;
  useEffect(() => {
    setValue((current) => ({
      olympic: current.olympic || seed.olympic || null,
      level: current.level || seed.level || null,
      phase: current.phase || seed.phase || null,
      year: current.year || seed.year || null,
    }));
  }, [seed.olympic, seed.level, seed.phase, seed.year]);

  const olympicId = value.olympic?.id;

  useEffect(() => {
    setLists({ level: [], phase: [], year: [] });
    setCombinations([]);
    setAvailability("idle");

    if (!olympicId) return undefined;

    let cancelled = false;

    const load = async (path) => {
      try {
        const data = await api.get(`olympic/${path}/getAll/${olympicId}`);
        return data.data.elements || [];
      } catch (error) {
        return [];
      }
    };

    (async () => {
      const [level, phase, year] = await Promise.all([
        load("level"),
        load("phase"),
        load("year"),
      ]);
      if (!cancelled) setLists({ level, phase, year });
    })();

    if (restrictToAvailable) {
      setAvailability("loading");
      (async () => {
        try {
          const data = await api.get(`olympicQuestion/getTestOptions?id_olympic=${olympicId}`);
          if (cancelled) return;
          setCombinations(data.data.elements || []);
          setAvailability("ready");
        } catch (error) {
          if (cancelled) return;
          setCombinations([]);
          setAvailability("failed");
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [olympicId, restrictToAvailable]);

  const fits = (combination, selection) =>
    DEPENDENT.every(
      (field) => !selection[field] || combination[COMBINATION_KEY[field]] === selection[field].id
    );

  const narrow = (field) => {
    if (availability !== "ready") return lists[field];
    const selection = { ...value, [field]: null };
    const allowed = new Set(
      combinations.filter((c) => fits(c, selection)).map((c) => c[COMBINATION_KEY[field]])
    );
    return lists[field].filter((option) => allowed.has(option.id));
  };

  const notify = (next) => {
    if (!onChange) return;
    onChange({
      olympic: pick(next.olympic),
      level: pick(next.level),
      phase: pick(next.phase),
      year: pick(next.year),
    });
  };

  const select = (field, option) => {
    if (field === "olympic") {
      const next = { ...EMPTY, olympic: option };
      setValue(next);
      notify(next);
      return;
    }

    const candidate = { ...value, [field]: option };

    if (combinations.length > 0 && !combinations.some((c) => fits(c, candidate))) {
      DEPENDENT.filter((f) => f !== field).forEach((f) => {
        candidate[f] = null;
      });
    }

    setValue(candidate);
    notify(candidate);
  };

  return {
    value,
    options: {
      olympic: olympicOptions,
      level: narrow("level"),
      phase: narrow("phase"),
      year: narrow("year"),
    },
    select,
    availability,
    hasNoQuestions: availability === "ready" && combinations.length === 0,
  };
}
