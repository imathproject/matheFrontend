import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { useApi } from "api";
import COLORS from "components/olympiads/colors";

/**
 * The keywords of an olympic question, picked from the list the server offers.
 *
 * The selection travels as keyword ids (`value` in, `onChange(ids)` out); the
 * labels come already translated from the API, so switching the interface
 * language only swaps what the chips say, never which ones are selected.
 *
 * A failed fetch leaves the field without options and the rest of the form
 * usable. Ids in `value` that match no loaded option are not shown, but they
 * are handed back untouched on every change, so a selection is never dropped
 * just because the options have not arrived (or could not be loaded).
 */
function OlympicKeywordsField({ value, onChange, error }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const api = useApi();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Guards both an unmount and an older language's answer arriving last.
    let cancelled = false;
    (async () => {
      try {
        const response = await api.get("olympicQuestion/keywords", { params: { lang } });
        if (cancelled) return;
        const elements = response.data?.elements || [];
        setOptions(
          elements
            .map((keyword) => ({ id: keyword.id, label: String(keyword.label ?? "") }))
            .sort((a, b) => a.label.localeCompare(b.label, lang))
        );
      } catch (fetchError) {
        if (cancelled) return;
        console.error("Error fetching olympic keywords:", fetchError);
        setOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const ids = Array.isArray(value) ? value : [];

  const optionsById = useMemo(
    () => new Map(options.map((option) => [Number(option.id), option])),
    [options]
  );

  const selected = ids.map((id) => optionsById.get(Number(id))).filter(Boolean);

  const handleChange = (event, newValue) => {
    const unknown = ids.filter((id) => !optionsById.has(Number(id)));
    onChange([...unknown, ...newValue.map((option) => option.id)]);
  };

  return (
    <SoftBox width="100%" mb={3} sx={{ minWidth: 0 }}>
      <SoftTypography sx={{ color: error ? COLORS.error : COLORS.brown }} fontWeight="bold">
        {t("olympic_questions_page.keywords", "Keywords")}
      </SoftTypography>
      <SoftTypography variant="caption" color="text" sx={{ display: "block", mb: 1 }}>
        {t("olympic_questions_page.keywords_hint", "Choose the subjects this question covers.")}
      </SoftTypography>
      <Autocomplete
        multiple
        disableCloseOnSelect
        fullWidth
        options={options}
        value={selected}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, current) => option.id === current.id}
        noOptionsText={t("olympic_questions_page.keywords_empty", "No keywords available")}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.label}
          </li>
        )}
        sx={{
          width: "100%",
          minWidth: 0,
          // Long labels wrap inside the chip instead of pushing it past the card.
          "& .MuiAutocomplete-tag": {
            maxWidth: "100%",
            height: "auto",
            minHeight: "24px",
          },
          "& .MuiAutocomplete-tag .MuiChip-label": {
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            paddingTop: "2px",
            paddingBottom: "2px",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              selected.length === 0
                ? t("olympic_questions_page.keywords_placeholder", "Select keywords")
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: "40px",
                height: "auto",
                flexWrap: "wrap",
                border: error ? "1px solid red" : "1px solid #ced4da",
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />
        )}
      />
    </SoftBox>
  );
}

OlympicKeywordsField.propTypes = {
  /** Ids of the selected keywords. */
  value: PropTypes.arrayOf(PropTypes.number),
  /** Called with the new array of keyword ids. */
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
};

OlympicKeywordsField.defaultProps = {
  value: [],
  error: false,
};

export default OlympicKeywordsField;
