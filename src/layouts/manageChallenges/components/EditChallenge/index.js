import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftAutocomplete from "components/AutoComplete";
import { useApi } from "api";
import { TextField } from "@mui/material";

function EditChallenge({ onSave, id }) {
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
  const [loading, setLoading] = useState(true);
  const [challengeCode, setChallengeCode] = useState("");
  const [challengeStatus, setChallengeStatus] = useState("");
  const api = useApi();

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    topic: false,
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
      // Fetch topics list
      const topicsData = await api.get("topic/getAll");
      const topics = topicsData.data.elements;
      setAllTopics(topics);

      // Fetch the challenge details
      const challengeData = await api.get("challenge/getById/" + id);
      const challenge = challengeData.data.element;
      setChallengeCode(challenge.code);
      setChallengeStatus(challenge.status);
      setTitle(challenge.title || "");
      setLocalization(challenge.localization || "");
      setMaxDuration(String(challenge.maxDuration || ""));

      // Find and set the selected topic
      const topic = topics.find((t) => t.id === challenge.topic);
      if (topic) {
        setSelectedTopic(topic);
        // Fetch subtopics for the selected topic
        const subtopicsData = await api.get("subtopic/getByTopic/" + topic.id);
        const subtopics = subtopicsData.data.elements;
        setAllSubtopics(subtopics);

        // Find and set the selected subtopic
        if (challenge.subtopic) {
          const subtopic = subtopics.find((s) => s.id === challenge.subtopic);
          if (subtopic) {
            setSelectedSubtopic(subtopic);
          }
        }
      }

      setNumberOfQuestions(String(challenge.numberOfQuestions));

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

  const updateChallenge = async () => {
    if (validateForm()) {
      const postData = {
        id: id,
        title: title.trim(),
        localization: localization.trim() || null,
        topic: selectedTopic.id,
        subtopic: selectedSubtopic ? selectedSubtopic.id : null,
        numberOfQuestions: parseInt(numberOfQuestions),
        maxDuration: parseInt(maxDuration),
        date: challengeDate,
      };

      try {
        await api.put("challenge/update", postData);
        onSave();
      } catch (error) {
        console.error("Failed to update challenge:", error);
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
        <SoftTypography variant="h6" color="info">
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
          <SoftTypography color="info" fontWeight="bold">
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

        <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold">
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

        <SoftTypography color="info" fontWeight="bold">
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

        <SoftTypography color={validationErrors.topic ? "error" : "info"} fontWeight="bold">
          Topic*
        </SoftTypography>
        <SoftBox mb={3}>
          <SoftAutocomplete
            onNewValueSelected={handleChangeTopic}
            options={allTopics}
            selected={selectedTopic}
            disabled={isFinished}
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
                disabled={isFinished}
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
          color={validationErrors.maxDuration ? "error" : "info"}
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

        <SoftTypography color={validationErrors.date ? "error" : "info"} fontWeight="bold">
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
              variant="gradient"
              color="success"
              sx={{ width: "10%" }}
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
