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

function AddChallenge({ onSave }) {
  const validationMessageRef = useRef();
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
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
    topic: false,
    numberOfQuestions: false,
    maxDuration: false,
    date: false,
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");
      setAllTopics(data.data.elements);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }

  async function fetchSubtopics(topicId) {
    try {
      const data = await api.get("subtopic/getByTopic/" + topicId);
      setAllSubtopics(data.data.elements);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  }

  const handleChangeTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
    setAllSubtopics([]);
    fetchSubtopics(topic.id);
    setValidationErrors({ ...validationErrors, topic: false });
  };

  const handleChangeSubtopic = (subtopic) => {
    setSelectedSubtopic(subtopic);
  };

  const validateForm = () => {
    const errors = {
      title: !title.trim(),
      topic: !selectedTopic,
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
        topic: selectedTopic.id,
        subtopic: selectedSubtopic ? selectedSubtopic.id : null,
        numberOfQuestions: parseInt(numberOfQuestions),
        maxDuration: parseInt(maxDuration),
        date: challengeDate,
      };

      try {
        const response = await api.post("challenge/create", postData);
        setCreatedChallenge(response.data.element);
      } catch (error) {
        console.error("Failed to create challenge:", error);
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
      await api.put("challenge/updateStatus", {
        id: createdChallenge.id,
        status: "started",
      });
      onSave();
    } catch (error) {
      console.error("Failed to start challenge:", error);
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
          Challenge Created!
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
          <SoftTypography variant="h1" color="info" fontWeight="bold" sx={{ letterSpacing: "2px" }}>
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
            <SoftTypography variant="body2" color="text" fontWeight="bold">Topic:</SoftTypography>
            <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedTopic?.label}</SoftTypography>
          </SoftBox>
          {selectedSubtopic && (
            <SoftBox display="flex" justifyContent="space-between" mb={1}>
              <SoftTypography variant="body2" color="text" fontWeight="bold">Subtopic:</SoftTypography>
              <SoftTypography variant="body2" color="dark" fontWeight="medium">{selectedSubtopic?.label}</SoftTypography>
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
            variant="gradient"
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

        <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold">
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

        <SoftTypography color="info" fontWeight="bold">
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

        <SoftTypography color={validationErrors.topic ? "error" : "info"} fontWeight="bold">
          Topic*
        </SoftTypography>
        <SoftBox mb={3}>
          <SoftAutocomplete
            onNewValueSelected={handleChangeTopic}
            options={allTopics}
            selected={selectedTopic}
          />
        </SoftBox>

        {allSubtopics.length > 0 && (
          <>
            <SoftTypography color="info" fontWeight="bold">
              Subtopic
            </SoftTypography>
            <SoftBox mb={3}>
              <SoftAutocomplete
                onNewValueSelected={handleChangeSubtopic}
                options={allSubtopics}
                selected={selectedSubtopic}
              />
            </SoftBox>
          </>
        )}

        <SoftTypography
          color={validationErrors.numberOfQuestions ? "error" : "info"}
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
          color={validationErrors.maxDuration ? "error" : "info"}
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

        <SoftTypography color={validationErrors.date ? "error" : "info"} fontWeight="bold" mb={1}>
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
            variant="gradient"
            color="success"
            sx={{ whiteSpace: "nowrap" }}
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
            variant="gradient"
            color="success"
            sx={{ width: "10%" }}
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
