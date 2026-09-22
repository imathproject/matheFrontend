import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftAutocomplete from "components/AutoComplete";
import { useApi } from "api";
import { TextField } from "@mui/material";
import colors from "components/olympiads/colors";

function EditChallenge({ onSave, id }) {
  const validationMessageRef = useRef();
  const [allOlympics, setAllOlympics] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [allPhases, setAllPhases] = useState([]);
  const [selectedOlympic, setSelectedOlympic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [title, setTitle] = useState("");
  const [localization, setLocalization] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [challengeDate, setChallengeDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challengeCode, setChallengeCode] = useState("");
  const [challengeStatus, setChallengeStatus] = useState("");
  const api = useApi();

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    olympic: false,
    numberOfQuestions: false,
    maxDuration: false,
    date: false,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch olympics list
      const olympicsData = await api.get("olympic/getAll");
      const olympics = olympicsData.data.elements;
      setAllOlympics(olympics);

      // Fetch the challenge details
      const challengeData = await api.get("olympiadsChallenge/getById/" + id);
      const challenge = challengeData.data.element;
      setChallengeCode(challenge.code);
      setChallengeStatus(challenge.status);
      setTitle(challenge.title || "");
      setLocalization(challenge.localization || "");
      setMaxDuration(String(challenge.maxDuration || ""));
      setNumberOfQuestions(String(challenge.numberOfQuestions));

      // Find and set the selected olympic
      const olympic = olympics.find((o) => o.id === challenge.id_olympic);
      if (olympic) {
        setSelectedOlympic(olympic);

        // Fetch levels, years, phases for the selected olympic
        const [levelsData, yearsData, phasesData] = await Promise.all([
          api.get("olympic/level/getAll/" + olympic.id),
          api.get("olympic/year/getAll/" + olympic.id),
          api.get("olympic/phase/getAll/" + olympic.id),
        ]);

        const levels = levelsData.data.elements;
        const years = yearsData.data.elements;
        const phases = phasesData.data.elements;

        setAllLevels(levels);
        setAllYears(years);
        setAllPhases(phases);

        // Set selected level, year, phase
        if (challenge.id_olympic_level) {
          const level = levels.find((l) => l.id === challenge.id_olympic_level);
          if (level) setSelectedLevel(level);
        }
        if (challenge.id_olympic_year) {
          const year = years.find((y) => y.id === challenge.id_olympic_year);
          if (year) setSelectedYear(year);
        }
        if (challenge.id_olympic_phase) {
          const phase = phases.find((p) => p.id === challenge.id_olympic_phase);
          if (phase) setSelectedPhase(phase);
        }
      }

      // Format date for input (YYYY-MM-DD)
      if (challenge.date) {
        const date = new Date(challenge.date);
        const formattedDate = date.toISOString().split("T")[0];
        setChallengeDate(formattedDate);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching challenge data:", error);
      setErrorMessage("Failed to load challenge data.");
      setLoading(false);
    }
  }

  async function fetchLevels(olympicId) {
    try {
      const data = await api.get("olympic/level/getAll/" + olympicId);
      setAllLevels(data.data.elements);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  }

  async function fetchYears(olympicId) {
    try {
      const data = await api.get("olympic/year/getAll/" + olympicId);
      setAllYears(data.data.elements);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  }

  async function fetchPhases(olympicId) {
    try {
      const data = await api.get("olympic/phase/getAll/" + olympicId);
      setAllPhases(data.data.elements);
    } catch (error) {
      console.error("Error fetching phases:", error);
    }
  }

  const handleChangeOlympic = (olympic) => {
    setSelectedOlympic(olympic);
    setSelectedLevel(null);
    setSelectedYear(null);
    setSelectedPhase(null);
    setAllLevels([]);
    setAllYears([]);
    setAllPhases([]);
    setValidationErrors({ ...validationErrors, olympic: false });
    if (olympic) {
      fetchLevels(olympic.id);
      fetchYears(olympic.id);
      fetchPhases(olympic.id);
    }
  };

  const handleChangeLevel = (level) => {
    setSelectedLevel(level);
  };

  const handleChangeYear = (year) => {
    setSelectedYear(year);
  };

  const handleChangePhase = (phase) => {
    setSelectedPhase(phase);
  };

  const validateForm = () => {
    const errors = {
      title: !title.trim(),
      olympic: !selectedOlympic,
      numberOfQuestions: !numberOfQuestions || parseInt(numberOfQuestions) < 1,
      maxDuration: !maxDuration || parseInt(maxDuration) < 1,
      date: !challengeDate,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const updateChallenge = async () => {
    if (validateForm()) {
      const postData = {
        id: id,
        title: title.trim(),
        localization: localization.trim() || null,
        id_olympic: selectedOlympic.id,
        id_olympic_level: selectedLevel ? selectedLevel.id : null,
        id_olympic_year: selectedYear ? selectedYear.id : null,
        id_olympic_phase: selectedPhase ? selectedPhase.id : null,
        numberOfQuestions: parseInt(numberOfQuestions),
        maxDuration: parseInt(maxDuration),
        date: challengeDate,
      };

      try {
        await api.put("olympiadsChallenge/update", postData);
        onSave();
      } catch (error) {
        console.error("Failed to update olympiads challenge:", error);
        const backendMessage = error.response?.data?.elements || error.response?.data?.message;
        if (typeof backendMessage === "string" && backendMessage) {
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage("There was an error updating the challenge.");
        }
        validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <SoftBox display="flex" justifyContent="center" p={4}>
        <SoftTypography variant="h6" sx={{ color: colors.brown }}>
          Loading...
        </SoftTypography>
      </SoftBox>
    );
  }

  const isFinished = challengeStatus === "finished";

  return (
    <div ref={validationMessageRef}>
      <SoftBox width="98%">
        {errorMessage && (
          <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <SoftTypography variant="h6" color="error" fontWeight="light">
              {errorMessage}
            </SoftTypography>
          </SoftBox>
        )}

        <SoftBox
          mb={3}
          p={2}
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #ced4da",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <SoftTypography sx={{ color: colors.brown }} fontWeight="bold">
            Challenge Access Code
          </SoftTypography>
          <SoftTypography variant="h5" color="dark" fontWeight="bold">
            {challengeCode}
          </SoftTypography>
        </SoftBox>

        {isFinished && (
          <SoftBox mb={3} p={2} sx={{ backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">
              This challenge is finished and cannot be edited.
            </SoftTypography>
          </SoftBox>
        )}

        <SoftTypography sx={{ color: validationErrors.title ? "error.main" : colors.brown }} fontWeight="bold">
          Title*
        </SoftTypography>
        <SoftInput
          type="text"
          placeholder="Enter the challenge title..."
          value={title}
          disabled={isFinished}
          sx={{
            border: validationErrors.title ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationErrors({ ...validationErrors, title: false });
          }}
        />

        <SoftTypography sx={{ color: colors.brown }} fontWeight="bold">
          Localization
        </SoftTypography>
        <SoftInput
          type="text"
          placeholder="Enter the location (e.g., Room 301, Building A)..."
          value={localization}
          disabled={isFinished}
          sx={{
            border: "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => setLocalization(e.target.value)}
        />

        <SoftTypography sx={{ color: validationErrors.olympic ? "error.main" : colors.brown }} fontWeight="bold">
          Olympiad*
        </SoftTypography>
        <SoftBox mb={3}>
          <SoftAutocomplete
            onNewValueSelected={handleChangeOlympic}
            options={allOlympics}
            selected={selectedOlympic}
            disabled={isFinished}
          />
        </SoftBox>

        {allLevels.length > 0 && (
          <>
            <SoftTypography sx={{ color: colors.brown }} fontWeight="bold">
              Level
            </SoftTypography>
            <SoftBox mb={3}>
              <SoftAutocomplete
                onNewValueSelected={handleChangeLevel}
                options={allLevels}
                selected={selectedLevel}
                disabled={isFinished}
              />
            </SoftBox>
          </>
        )}

        {allYears.length > 0 && (
          <>
            <SoftTypography sx={{ color: colors.brown }} fontWeight="bold">
              Year
            </SoftTypography>
            <SoftBox mb={3}>
              <SoftAutocomplete
                onNewValueSelected={handleChangeYear}
                options={allYears}
                selected={selectedYear}
                disabled={isFinished}
              />
            </SoftBox>
          </>
        )}

        {allPhases.length > 0 && (
          <>
            <SoftTypography sx={{ color: colors.brown }} fontWeight="bold">
              Phase
            </SoftTypography>
            <SoftBox mb={3}>
              <SoftAutocomplete
                onNewValueSelected={handleChangePhase}
                options={allPhases}
                selected={selectedPhase}
                disabled={isFinished}
              />
            </SoftBox>
          </>
        )}

        <SoftTypography
          sx={{ color: validationErrors.numberOfQuestions ? "error.main" : colors.brown }}
          fontWeight="bold"
        >
          Number of Questions*
        </SoftTypography>
        <SoftInput
          type="number"
          placeholder="Enter the number of questions..."
          value={numberOfQuestions}
          disabled={isFinished}
          inputProps={{ min: 1 }}
          sx={{
            border: validationErrors.numberOfQuestions ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setNumberOfQuestions(e.target.value);
            setValidationErrors({ ...validationErrors, numberOfQuestions: false });
          }}
        />

        <SoftTypography
          sx={{ color: validationErrors.maxDuration ? "error.main" : colors.brown }}
          fontWeight="bold"
        >
          Max Duration (minutes)*
        </SoftTypography>
        <SoftInput
          type="number"
          placeholder="Enter the maximum duration in minutes..."
          value={maxDuration}
          disabled={isFinished}
          inputProps={{ min: 1 }}
          sx={{
            border: validationErrors.maxDuration ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setMaxDuration(e.target.value);
            setValidationErrors({ ...validationErrors, maxDuration: false });
          }}
        />

        <SoftTypography color={validationErrors.date ? "error" : "info"} fontWeight="bold" sx={{ color: validationErrors.date ? "error.main" : colors.brown }}>
          Challenge Date*
        </SoftTypography>
        <TextField
          type="date"
          fullWidth
          value={challengeDate}
          disabled={isFinished}
          onChange={(e) => {
            setChallengeDate(e.target.value);
            setValidationErrors({ ...validationErrors, date: false });
          }}
          sx={{
            marginBottom: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              border: validationErrors.date ? "1px solid red" : "none",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />

        {!isFinished && (
          <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
            <SoftButton
              variant="contained"
              sx={{
                color: "#FFFFFF !important",
                backgroundColor: `${colors.lightBrown} !important`,
                "&:hover": { backgroundColor: `${colors.brown} !important` },
                width: "120px",
              }}
              onClick={updateChallenge}
            >
              Save
            </SoftButton>
          </SoftBox>
        )}
      </SoftBox>
    </div>
  );
}

export default EditChallenge;

EditChallenge.propTypes = {
  onSave: PropTypes.func.isRequired,
  id: PropTypes.number,
};
