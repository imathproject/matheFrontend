import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Slider from "@mui/material/Slider";
import SoftInput from "components/SoftInput";
import TopicKeywordsSelector from "components/TopicKeywordsSelector";
import { useApi } from "api";
import levelMarks from "./data/level";
import SoftButton from "components/SoftButton";
import Accordion from "react-bootstrap/Accordion";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { MuiFileInput } from "mui-file-input";

function AddQuestion({ onSave }) {
  const validationMessageRef = useRef();
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [a4, setA4] = useState("");
  const [file, setFile] = useState();
  const [showImage, setShowImage] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
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

  const validateTemporaryForm = () => {
    const errors = {
      topic: topic === null,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  async function fetchQuestion(postData, extension) {
    try {
      const data = await api.post("question/add", postData);
      const id = data.data.elements;
      if (file != null) {
        const renamedFile = new File([file], id + "." + extension, { type: file.type });
        const newFile = await uploadFile(renamedFile);
      }
      onSave(topic);
    } catch (error) {
      // Handle error
    }
  }

  const saveQuestion = (v) => {
    if (validateForm()) {
      var fileName;
      var fileExtension;
      if (file) {
        const splitFile = file.name.split(".");
        fileName = splitFile[0] + "." + splitFile[1];
        fileExtension = splitFile[1];
      }
      const postData = {
        topic: topic,
        subtopic: subtopic,
        question: question,
        a1: a1,
        a2: a2,
        a3: a3,
        a4: a4,
        level: level,
        keywords: keywords,
        validate: v,
        file_name: fileName,
        file_ext: fileExtension,
      };
      fetchQuestion(postData, fileExtension);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const saveTemporaryQuestion = () => {
    if (validateTemporaryForm()) {
      var fileName;
      var fileExtension;
      if (file) {
        const splitFile = file.name.split(".");
        fileName = splitFile[0] + "." + splitFile[1];
        fileExtension = splitFile[1];
      }
      const postData = {
        topic: topic,
        subtopic: subtopic,
        question: question,
        a1: a1,
        a2: a2,
        a3: a3,
        a4: a4,
        level: level,
        keywords: keywords,
        validate: 3,
        file_name: fileName,
        file_ext: fileExtension,
      };
      fetchQuestion(postData, fileExtension);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // TODO: call the keyword recommendation API with the question content
  // (question, answers, file, topic, subtopic) and return the ids of the
  // suggested keywords, chosen among availableKeywords.
  const suggestKeywords = async (availableKeywords) => {
    return [];
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
      keywords: validationErrors.keywords && !isKeywordsValid,
    });
  };

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
        <TopicKeywordsSelector
          contentName="question"
          onFilter={handleFilter}
          onSuggestKeywords={suggestKeywords}
          topicError={validationErrors.topic}
          keywordsError={validationErrors.keywords}
        >
        <SoftTypography color={validationErrors.question ? "error" : "info"} fontWeight="bold">
          Question*
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{ border: validationErrors.question ? "1px solid red" : "1px solid #ced4da" }}
          rows={12}
          onChange={(e) => {
            setQuestion(e.target.value);
            setValidationErrors({ ...validationErrors, question: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, question: true });
          }}
        />
        <Accordion style={{ marginBottom: "50px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" ml={2}>
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

        <SoftTypography color="info" fontWeight="bold">
          Question resources
        </SoftTypography>
        <SoftBox width="100%" mr={1}>
          <MuiFileInput
            value={file}
            fullWidth
            hideSizeText
            sx={{ mb: 2, borderRadius: 2 }}
            onChange={(e) => {
              handleChangeFile(e);
            }}
          />
        </SoftBox>
        <SoftBox
          mx={1}
          mb={1}
          sx={{ width: "100%", display: "flex", justifyContent: "center", alignContents: "center" }}
        >
          {file && <img src={showImage} width="50%" style={{ borderRadius: "10px" }} />}
        </SoftBox>

        <SoftTypography color="info" fontWeight="bold" sx={{ mb: 3 }}>
          Question Level*
        </SoftTypography>
        <SoftBox>
          <SoftBox sx={{ display: "flex", justifyContent: "space-between" }}>
            <SoftTypography variant="body2" fontWeight="bold">
              Easier
            </SoftTypography>
            <SoftTypography variant="body2" fontWeight="bold">
              Most difficult
            </SoftTypography>
          </SoftBox>
          <Slider
            sx={{ mx: 1, mb: 3 }}
            defaultValue={level}
            step={1}
            onChange={(e) => setLevel(e.target.value)}
            marks={marks}
            min={1}
            max={5}
          />
        </SoftBox>
        <SoftTypography
          sx={{ color: validationErrors.a1 ? "#cc0900" : "#56a36b" }}
          fontWeight="bold"
        >
          True answer*:
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{ border: validationErrors.a1 ? "1px solid red" : "1px solid #ced4da" }}
          rows={4}
          onChange={(e) => {
            setA1(e.target.value);
            setValidationErrors({ ...validationErrors, a1: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, a1: true });
          }}
        />
        <Accordion style={{ marginBottom: "50px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" ml={2}>
                Answer preview
              </SoftTypography>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                <SoftTypography variant="h6" fontWeight="regular">
                  <Latex displayMode>{a1}</Latex>
                </SoftTypography>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <SoftTypography sx={{ color: "#cc0900" }} fontWeight="bold">
          False answer*:
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{ border: validationErrors.a2 ? "1px solid red" : "1px solid #ced4da" }}
          rows={4}
          onChange={(e) => {
            setA2(e.target.value);
            setValidationErrors({ ...validationErrors, a2: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, a2: true });
          }}
        />
        <Accordion style={{ marginBottom: "50px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" ml={2}>
                Answer preview
              </SoftTypography>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                <SoftTypography variant="h6" fontWeight="regular">
                  <Latex displayMode>{a2}</Latex>
                </SoftTypography>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <SoftTypography sx={{ color: "#cc0900" }} fontWeight="bold">
          False answer*:
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{ border: validationErrors.a3 ? "1px solid red" : "1px solid #ced4da" }}
          rows={4}
          onChange={(e) => {
            setA3(e.target.value);
            setValidationErrors({ ...validationErrors, a3: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, a3: true });
          }}
        />
        <Accordion style={{ marginBottom: "50px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" ml={2}>
                Answer preview
              </SoftTypography>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                <SoftTypography variant="h6" fontWeight="regular">
                  <Latex displayMode>{a3}</Latex>
                </SoftTypography>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <SoftTypography sx={{ color: "#cc0900" }} fontWeight="bold">
          False answer*:
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{ border: validationErrors.a4 ? "1px solid red" : "1px solid #ced4da" }}
          rows={4}
          onChange={(e) => {
            setA4(e.target.value);
            setValidationErrors({ ...validationErrors, a4: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, a4: true });
          }}
        />
        <Accordion style={{ marginBottom: "50px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <SoftTypography color="dark" ml={2}>
                Answer preview
              </SoftTypography>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                <SoftTypography variant="h6" fontWeight="regular">
                  <Latex displayMode>{a4}</Latex>
                </SoftTypography>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </TopicKeywordsSelector>

        <SoftBox display="flex" flexDirection="row" justifyContent="flex-end" gap={2} mb={2}>
          <SoftButton
            variant="outlined"
            color="info"
            sx={{ minWidth: 120 }}
            onClick={saveTemporaryQuestion}
          >
            Save
          </SoftButton>
          <SoftButton
            variant="gradient"
            color="info"
            sx={{ minWidth: 120 }}
            onClick={() => saveQuestion(4)}
          >
            Submit
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
}

export default AddQuestion;

AddQuestion.propTypes = {
  onSave: PropTypes.func.isRequired,
};
