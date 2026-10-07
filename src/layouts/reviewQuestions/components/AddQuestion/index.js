import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Slider from "@mui/material/Slider";
import SoftInput from "components/SoftInput";
import SearchBar from "./SearchBar";
import { useApi } from "api";
import levelMarks from "./data/level";
import SoftButton from "components/SoftButton";
import Accordion from "react-bootstrap/Accordion";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { MuiFileInput } from "mui-file-input";

// Two equal columns that stack on small screens
const twoColumns = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: 2,
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
};

function AddQuestion({ onSave, questionID }) {
  const validationMessageRef = useRef();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [a4, setA4] = useState("");
  const [file, setFile] = useState(null);
  const [oldFile, setOldFile] = useState(null);
  const [showImage, setShowImage] = useState();
  const api = useApi();
  const marks = levelMarks;
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    question: false,
    a1: false,
    a2: false,
    a3: false,
    a4: false,
    subtopic: false,
    keywords: false,
  });
  const answers = [
    { key: "a1", label: "Correct answer", value: a1, setValue: setA1, correct: true },
    { key: "a2", label: "Incorrect answer", value: a2, setValue: setA2, correct: false },
    { key: "a3", label: "Incorrect answer", value: a3, setValue: setA3, correct: false },
    { key: "a4", label: "Incorrect answer", value: a4, setValue: setA4, correct: false },
  ];

  useEffect(() => {
    fetchQuestion();
  }, [questionID]);

  async function fetchQuestion() {
    try {
      const data = await api.get("question/getById/" + questionID);
      const question = data.data.elements;
      if (question.file_name) {
        fetchFile(questionID, question.file_ext, question.file_name);
        setOldFile(question.id + "." + question.file_ext);
      }
      setTopic({ label: question.platform__topic.name, id: question.platform__topic.id });
      question.platform__subtopic
        ? setSubtopic({
            label: question.platform__subtopic.name,
            id: question.platform__subtopic.id,
          })
        : null;
      setLevel(question.lecturer_level);
      setQuestion(question.question);
      setA1(question.answer1);
      setA2(question.answer2);
      setA3(question.answer3);
      setA4(question.answer4);
      setLoading(false);
      setKeywords(question.keywordIds);
    } catch (error) {
      // Handle error
    }
  }

  const validateForm = () => {
    const errors = {
      topic: topic === null,
      question: question.trim() === "",
      a1: a1.trim() === "",
      a2: a2.trim() === "",
      a3: a3.trim() === "",
      a4: a4.trim() === "",
      keywords: keywords.length < 2 || keywords.length > 5,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  async function fetchFile(id, file_ext, name) {
    try {
      const response = await api.post(
        "question/downloadImage",
        { id: id, file_ext: file_ext },
        { responseType: "arraybuffer" }
      );
      if (!response.data) {
        throw new Error("No data received from the API");
      }

      const fileType = getMimeType(file_ext);

      const blob = new Blob([response.data], { type: fileType });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], name, { type: fileType });

      if (fileType.startsWith("image/")) {
        const fileUrl = URL.createObjectURL(file);
        setShowImage(fileUrl);
      } else {
        setShowImage(null);
      }

      setFile(file);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  const getMimeType = (file_ext) => {
    switch (file_ext.toLowerCase()) {
      case "png":
        return "image/png";
      case "jpg":
        return "image/jpg";
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "pdf":
        return "application/pdf";
      default:
        return "application/octet-stream";
    }
  };

  const handleFilter = (topic, subtopic, keywords) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setKeywords(keywords);

    const isTopicValid = topic !== null;
    const isKeywordsValid = keywords.length >= 2 && keywords.length <= 5;
    setValidationErrors({
      ...validationErrors,
      topic: !isTopicValid,
      keywords: !isKeywordsValid,
    });
  };

  function handleChangeFile(e) {
    if (e == null) {
      setShowImage(null);
    } else {
      const file = e;
      if (file && file.type.startsWith("image/")) {
        setShowImage(URL.createObjectURL(file));
      } else {
        setShowImage(null);
      }
    }
    setFile(e);
  }

  const handleSave = (v) => {
    if (validateForm()) {
      var s = null;
      var fileName = null;
      var fileExtension = null;
      if (subtopic) s = subtopic.id;

      if (file) {
        const splitFile = file.name.split(".");
        fileName = splitFile[0] + "." + splitFile[1];
        fileExtension = splitFile[1];
      }
      const postData = {
        id: questionID,
        topic: topic.id,
        subtopic: s,
        question: question,
        level: level,
        a1: a1,
        a2: a2,
        a3: a3,
        a4: a4,
        keywords: keywords,
        validate: v,
        file_name: fileName,
        file_ext: fileExtension,
        oldFile: oldFile,
      };
      editQuestion(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTemporarySave = (v) => {
    var s = null;
    var fileName = null;
    var fileExtension = null;
    if (subtopic) s = subtopic.id;

    if (file) {
      const splitFile = file.name.split(".");
      fileName = splitFile[0] + "." + splitFile[1];
      fileExtension = splitFile[1];
    }
    const postData = {
      id: questionID,
      topic: topic.id,
      subtopic: s,
      question: question,
      level: level,
      a1: a1,
      a2: a2,
      a3: a3,
      a4: a4,
      keywords: keywords,
      validate: v,
      file_name: fileName,
      file_ext: fileExtension,
      oldFile: oldFile,
    };
    editQuestion(postData);
  };

  async function editQuestion(postData) {
    try {
      const data = await api.post("question/validate", postData);
      if (file) {
        const renamedFile = new File([file], postData.id + "." + postData.file_ext, {
          type: file.type,
        });
        const newFile = await uploadFile(renamedFile);
      }
      onSave();
    } catch (error) {
      //Handle Error
    }
  }

  const uploadFile = async (renamedFile) => {
    const formData = new FormData();
    formData.append("file", renamedFile);
    try {
      const data = await api.post("question/uploadImage", formData);
      onSave();
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
        <SearchBar
          onFilter={handleFilter}
          topicError={validationErrors.topic}
          keywordsError={validationErrors.keywords}
          topicObject={topic}
          subtopicObject={subtopic}
          keywordIds={keywords}
        />
        <SoftTypography color={validationErrors.question ? "error" : "info"} fontWeight="bold">
          Question
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          defaultValue={question}
          sx={{ border: validationErrors.question ? "1px solid red" : "1px solid #ced4da" }}
          rows={8}
          onChange={(e) => {
            setQuestion(e.target.value);
            setValidationErrors({ ...validationErrors, question: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, question: true });
          }}
        />
        <Accordion style={{ marginBottom: "24px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" variant="button" fontWeight="regular" ml={2}>
                Question preview
              </SoftTypography>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                <SoftTypography variant="h6" fontWeight="regular">
                  <Latex displayMode>{question}</Latex>
                </SoftTypography>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <SoftBox sx={twoColumns}>
          <SoftBox sx={{ minWidth: 0 }}>
            <SoftTypography color="info" fontWeight="bold">
              Question resources
            </SoftTypography>
            <MuiFileInput
              value={file}
              fullWidth
              hideSizeText
              placeholder="Choose a file..."
              sx={{ mb: 2, borderRadius: 2 }}
              onChange={(e) => {
                handleChangeFile(e);
              }}
            />
            {file && showImage && (
              <SoftBox mb={2} sx={{ display: "flex", justifyContent: "center" }}>
                <img src={showImage} style={{ maxWidth: "100%", borderRadius: "10px" }} />
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox sx={{ minWidth: 0 }}>
            <SoftTypography color="info" fontWeight="bold">
              Question level
            </SoftTypography>
            <SoftBox px={1}>
              <SoftBox sx={{ display: "flex", justifyContent: "space-between" }}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Easier
                </SoftTypography>
                <SoftTypography variant="caption" fontWeight="bold">
                  Most difficult
                </SoftTypography>
              </SoftBox>
              <Slider
                sx={{ mb: 3 }}
                defaultValue={level}
                step={1}
                onChange={(e) => setLevel(e.target.value)}
                marks={marks}
                min={1}
                max={5}
              />
            </SoftBox>
          </SoftBox>
        </SoftBox>

        <SoftBox sx={twoColumns}>
          {answers.map((answer) => (
            <SoftBox key={answer.key} sx={{ minWidth: 0 }}>
              <SoftTypography
                sx={{
                  color: answer.correct && !validationErrors[answer.key] ? "#56a36b" : "#cc0900",
                }}
                fontWeight="bold"
              >
                {answer.label}
              </SoftTypography>
              <SoftInput
                placeholder="Type here..."
                multiline
                defaultValue={answer.value}
                sx={{
                  border: validationErrors[answer.key] ? "1px solid red" : "1px solid #ced4da",
                }}
                rows={4}
                onChange={(e) => {
                  answer.setValue(e.target.value);
                  setValidationErrors({ ...validationErrors, [answer.key]: false });
                  if (e.target.value == "")
                    setValidationErrors({ ...validationErrors, [answer.key]: true });
                }}
              />
              <Accordion style={{ marginBottom: "24px" }}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <SoftTypography color="dark" variant="button" fontWeight="regular" ml={2}>
                      Answer preview
                    </SoftTypography>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                      <SoftTypography variant="h6" fontWeight="regular">
                        <Latex displayMode>{answer.value}</Latex>
                      </SoftTypography>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </SoftBox>
          ))}
        </SoftBox>
        <SoftBox
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          style={{ marginBottom: "100px" }}
        >
          <SoftButton
            variant="gradient"
            color="success"
            sx={{ width: "10%" }}
            onClick={() => handleSave(1)}
          >
            Validate
          </SoftButton>
          <SoftBox width="100%" display="flex" flexDirection="row" justifyContent="flex-end">
            <SoftButton
              variant="gradient"
              color="info"
              sx={{ width: "10%", mr: 2 }}
              onClick={() => handleTemporarySave(4)}
            >
              Save
            </SoftButton>
            <SoftButton
              variant="gradient"
              color="error"
              sx={{ width: "10%" }}
              onClick={() => handleTemporarySave(2)}
            >
              Refuse
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </div>
  );
}

export default AddQuestion;

AddQuestion.propTypes = {
  onSave: PropTypes.func.isRequired,
  questionID: PropTypes.number.isRequired,
};
