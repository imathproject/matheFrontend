import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftAutocomplete from "components/AutoComplete";
import { useApi } from "api";
import { useAuth } from "authContext";
import { TextField } from "@mui/material";
import colors from "components/olympiads/colors";

function AddChallenge({ onSave }) {
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
  const [createdChallenge, setCreatedChallenge] = useState(null);
  const [startingChallenge, setStartingChallenge] = useState(false);
  const api = useApi();

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    olympic: false,
    numberOfQuestions: false,
    maxDuration: false,
    date: false,
  });

  useEffect(() => {
    fetchOlympics();
  }, []);

  async function fetchOlympics() {
    try {
      const data = await api.get("olympic/getAll");
      setAllOlympics(data.data.elements);
    } catch (error) {
      console.error("Error fetching olympics:", error);
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

  const saveChallenge = async () => {
    if (validateForm()) {
      const postData = {
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
        const response = await api.post("olympiadsChallenge/create", postData);
        setCreatedChallenge(response.data.element);
      } catch (error) {
        console.error("Failed to create olympiads challenge:", error);
        const backendMessage = error.response?.data?.elements || error.response?.data?.message;
        if (typeof backendMessage === "string" && backendMessage) {
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage("There was an error creating the challenge.");
        }
        validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStartChallenge = async () => {
    if (!createdChallenge) return;
    setStartingChallenge(true);
    try {
      await api.put("olympiadsChallenge/updateStatus", {
        id: createdChallenge.id,
        status: "started",
      });
      onSave();
    } catch (error) {
      console.error("Failed to start olympiads challenge:", error);
      setErrorMessage("Failed to start the challenge.");
    } finally {
      setStartingChallenge(false);
    }
  };

  if (createdChallenge) {
    return (
      <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} textAlign="center">
        <SoftBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            color: "#ffffff",
            fontSize: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(76,175,80,0.4)"
          }}
        >
          ✓
        </SoftBox>
        <SoftTypography variant="h4" fontWeight="bold" color="success" mb={1}>
          Olympiads Challenge Created!
        </SoftTypography>
        <SoftTypography variant="body2" color="text" mb={4}>
          The challenge has been created successfully. Share the access code below with students so they can join.
        </SoftTypography>

        <SoftBox
          sx={{
            backgroundColor: "#f8f9fa",
            border: "1px dashed #ced4da",
            borderRadius: "8px",
            padding: "24px 48px",
            marginBottom: "32px",
          }}
        >
          <SoftTypography variant="h6" color="text" fontWeight="medium" mb={1} textTransform="uppercase">
            Access Code
          </SoftTypography>
          <SoftTypography variant="h1" fontWeight="bold" sx={{ color: colors.brown, letterSpacing: "2px" }}>
            {createdChallenge.code}
          </SoftTypography>
        </SoftBox>

        <SoftBox
          sx={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "32px",
            textAlign: "left"
          }}
        >
          <SoftBox display="flex" justifyContent="space-between" mb={1}>
            <SoftTypography variant="body2" color="text" fontWeight="bold">Title:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{title}</SoftTypography>
          </SoftBox>
          {localization && (
            <SoftBox display="flex" justifyContent="space-between" mb={1}>
              <SoftTypography variant="body2" color="text" fontWeight="bold">Location:</SoftTypography>
              <SoftTypography variant="body2" color="dark" fontWeight="medium">{localization}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox display="flex" justifyContent="space-between" mb={1}>
            <SoftTypography variant="body2" color="text" fontWeight="bold">Olympiad:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedOlympic?.label}</SoftTypography>
          </SoftBox>
          {selectedLevel && (
            <SoftBox display="flex" justifyContent="space-between" mb={1}>
              <SoftTypography variant="body2" color="text" fontWeight="bold">Level:</SoftTypography>
              <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedLevel?.label}</SoftTypography>
            </SoftBox>
          )}
          {selectedYear && (
            <SoftBox display="flex" justifyContent="space-between" mb={1}>
              <SoftTypography variant="body2" color="text" fontWeight="bold">Year:</SoftTypography>
              <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedYear?.label}</SoftTypography>
            </SoftBox>
          )}
          {selectedPhase && (
            <SoftBox display="flex" justifyContent="space-between" mb={1}>
              <SoftTypography variant="body2" color="text" fontWeight="bold">Phase:</SoftTypography>
              <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedPhase?.label}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox display="flex" justifyContent="space-between" mb={1}>
            <SoftTypography variant="body2" color="text" fontWeight="bold">Questions:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{numberOfQuestions}</SoftTypography>
          </SoftBox>
          <SoftBox display="flex" justifyContent="space-between" mb={1}>
            <SoftTypography variant="body2" color="text" fontWeight="bold">Max Duration:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{maxDuration} min</SoftTypography>
          </SoftBox>
          <SoftBox display="flex" justifyContent="space-between">
            <SoftTypography variant="body2" color="text" fontWeight="bold">Scheduled Date:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{new Date(challengeDate + "T00:00:00").toLocaleDateString()}</SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" gap={2}>
          <SoftButton
            variant="contained"
            color="success"
            size="large"
            sx={{ minWidth: "180px" }}
            onClick={handleStartChallenge}
            disabled={startingChallenge}
          >
            {startingChallenge ? "Starting..." : "Start Challenge"}
          </SoftButton>
          <SoftButton
            variant="outlined"
            color="dark"
            size="large"
            sx={{ minWidth: "150px" }}
            onClick={onSave}
          >
            Done
          </SoftButton>
        </SoftBox>
      </SoftBox>
    );
  }

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

        <SoftTypography sx={{ color: validationErrors.title ? "error.main" : colors.brown }} fontWeight="bold">
          Title*
        </SoftTypography>
        <SoftInput
          type="text"
          placeholder="Enter the challenge title..."
          value={title}
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

        <SoftTypography sx={{ color: validationErrors.date ? "error.main" : colors.brown }} fontWeight="bold" mb={1}>
          Challenge Date*
        </SoftTypography>
        <TextField
          type="date"
          fullWidth
          value={challengeDate}
          onChange={(e) => {
            setChallengeDate(e.target.value);
            setValidationErrors({ ...validationErrors, date: false });
          }}
          sx={{
            marginBottom: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              border: validationErrors.date ? "1px solid red" : "none",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
        <SoftBox display="flex" justifyContent="flex-start" mb="30px">
          <SoftButton
            variant="contained"
            sx={{
              color: "#FFFFFF !important",
              backgroundColor: `${colors.lightBrown} !important`,
              "&:hover": { backgroundColor: `${colors.brown} !important` },
              whiteSpace: "nowrap",
            }}
            onClick={() => {
              const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
              setChallengeDate(todayStr);
              setValidationErrors({ ...validationErrors, date: false });
            }}
          >
            Select Today
          </SoftButton>
        </SoftBox>

        <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
          <SoftButton
            variant="contained"
            sx={{
              color: "#FFFFFF !important",
              backgroundColor: `${colors.lightBrown} !important`,
              "&:hover": { backgroundColor: `${colors.brown} !important` },
              width: "120px",
            }}
            onClick={saveChallenge}
          >
            Save
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
}

export default AddChallenge;

AddChallenge.propTypes = {
  onSave: PropTypes.func.isRequired,
};
