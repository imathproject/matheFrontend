import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from 'api';
import COLORS from "components/olympiads/colors";

// `olympicOptions` comes from the page, which asks the server for the olympiads
// the caller may review, so a reviewer is never offered one outside their scope.
function SearchBar({ onFilter, olympicOptions, olympicsError, levelError, initialOlympics, initialLevel, initialYear, initialPhase, direction = "row" }) {
  const [olympics, setOlympics] = useState(null);
  const [level, setLevel] = useState(null);
  const [year, setYear] = useState(null);
  const [phase, setPhase] = useState(null);
  const [allLevels, setAllLevels] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [allPhases, setAllPhases] = useState([]);
  const api = useApi();

  useEffect(() => {
    if (initialOlympics && !olympics) {
      setOlympics(initialOlympics);
    }
    if (initialLevel && !level) {
      setLevel(initialLevel);
    }
    if (initialYear && !year) {
      setYear(initialYear);
    }
    if (initialPhase && !phase) {
      setPhase(initialPhase);
    }
  }, [initialOlympics, initialLevel, initialYear, initialPhase]);

  useEffect(() => {
    if (olympics) {
      fetchLevels();
      fetchYears();
      fetchPhases();
    }
  }, [olympics]);

  async function fetchLevels() {
    try {
      const data = await api.get("olympic/level/getall/" + olympics.id);
      console.log("return: \n" + data)
      setAllLevels(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchYears() {
    try {
      const data = await api.get("olympic/year/getall/" + olympics.id)
      setAllYears(data.data.elements);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function fetchPhases() {
    try {
      const data = await api.get("olympic/phase/getall/" + olympics.id)
      setAllPhases(data.data.elements);
    } catch (error) {
      throw new Error(error);
    }
  }

  const handleChangeOlympics = (olympics) => {
    setOlympics(olympics);
    handleOnFilter(olympics, null, null, null);
    setLevel(null);
    setYear(null);
    setPhase(null);
  };

  const handleChangeLevel = (level) => {
    setLevel(level);
    handleOnFilter(olympics, level, year, phase);
  };

  const handleChangeYear = (year) => {
    setYear(year);
    handleOnFilter(olympics, level, year, phase);
  };

  const handleChangePhase = (phase) => {
    setPhase(phase);
    handleOnFilter(olympics, level, year, phase);
  };

  const handleOnFilter = (olympics, level, year, phase) => {
    onFilter(
      olympics ? { id: olympics.id, label: olympics.label } : null,
      level ? { id: level.id, label: level.label } : null,
      year ? { id: year.id, label: year.label } : null,
      phase ? { id: phase.id, label: phase.label } : null
    );
  };

  return (
    <SoftBox
      display="flex"
      mb={2}
      mr={1}
      flexDirection="column"
      alignItems="flex-start"
    >
      <SoftBox width="100%" display="flex" flexDirection={direction} mb={3} sx={{
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
      }}>
        <SoftBox
          width={direction === "column" ? "100%" : "25%"}
          display="flex"
          flexDirection="column"
          mb={direction === "column" ? 2 : 0}
          sx={{
            '@media (max-width: 600px)': {
              width: "100%",
              mb: 2
            },
          }}>
          <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold" marginTop={2}> Olympiad </SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeOlympics} options={olympicOptions} selected={olympics} />
        </SoftBox>
        <SoftBox
          width={direction === "column" ? "100%" : "25%"}
          ml={direction === "column" ? 0 : 1}
          mb={direction === "column" ? 2 : 0}
          display="flex"
          flexDirection="column"
          sx={{
            '@media (max-width: 600px)': {
              width: "100%",
              ml: 0,
              mb: 2
            },
          }}>
          <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold" marginTop={2}> Level</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeLevel} options={allLevels} selected={level} />
        </SoftBox>
        <SoftBox
          width={direction === "column" ? "100%" : "25%"}
          ml={direction === "column" ? 0 : 1}
          mb={direction === "column" ? 2 : 0}
          display="flex"
          flexDirection="column"
          sx={{
            '@media (max-width: 600px)': {
              width: "100%",
              ml: 0,
              mb: 2
            },
          }}>
          <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold" marginTop={2}> Phase</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangePhase} options={allPhases} selected={phase} />
        </SoftBox>
        <SoftBox
          width={direction === "column" ? "100%" : "25%"}
          ml={direction === "column" ? 0 : 1}
          mb={direction === "column" ? 2 : 0}
          display="flex"
          flexDirection="column"
          sx={{
            '@media (max-width: 600px)': {
              width: "100%",
              ml: 0,
              mb: 2
            },
          }}>
          <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold" marginTop={2}> Year</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeYear} options={allYears} selected={year} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
  olympicOptions: PropTypes.array.isRequired,
  olympicsError: PropTypes.bool,
  levelError: PropTypes.bool,
  yearError: PropTypes.bool,
  phaseError: PropTypes.bool,
  initialOlympics: PropTypes.object,
  initialLevel: PropTypes.object,
  initialYear: PropTypes.object,
  initialPhase: PropTypes.object,
  direction: PropTypes.oneOf(["row", "column"]),
};

export default SearchBar;
