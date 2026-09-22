import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";

import SoftButton from "components/SoftButton";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import SoftInput from "components/SoftInput";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import levelMarks from "../data/level.json";
import Accordion from "react-bootstrap/Accordion";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { MuiFileInput } from "mui-file-input";

import { useApi } from "api";

function EditView({ id, onSave }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState(null);
  const [level, setLevel] = useState(null);
  const [question, setQuestion] = useState("");
  const [checkedKey, setCheckedKey] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isParentChecked, setIsParentChecked] = useState(false);
  const [file, setFile] = useState(null);
  const [oldFile, setOldFile] = useState(null);
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [a4, setA4] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [showImage, setShowImage] = useState();
  const api = useApi();

  const [validationErrors, setValidationErrors] = useState({
    question: false,
    a1: false,
    a2: false,
    a3: false,
    a4: false,
    subtopic: false,
    keywords: false,
  });

  const validateForm = () => {
    const errors = {
      question: question.trim() === "",
      a1: a1.trim() === "",
      a2: a2.trim() === "",
      a3: a3.trim() === "",
      a4: a4.trim() === "",
      subtopic: !showKeys && subtopic == null,
      keywords: checkedKey.length < 2 || checkedKey.length > 5,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    getQuestion();
    fetchTopics();
    setTopic(null);
    setSubtopic(null);
    setOldFile(null);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  async function getQuestion() {
    try {
      const data = await api.get("question/getById/" + id);
      const question = data.data.elements;
      if (question.file_name) {
        fetchFile(id, question.file_ext, question.file_name);
        setOldFile(question.id + "." + question.file_ext);
      }
      setQuestion(question.question);
      fetchSubtopics(question.topic);
      if (question.subtopic) {
        setSubtopic({ label: question.platform__subtopic.name, id: question.subtopic });
        fetchKeywords(
          { label: question.platform__topic.name, id: question.topic },
          question.subtopic,
          question.keywordIds
        );
      } else
        fetchKeywords(
          { label: question.platform__topic.name, id: question.topic },
          null,
          question.keywordIds
        );
      setLevel({ label: question.lecturer_level, id: question.lecturer_level });
      setA1(question.answer1);
      setA2(question.answer2);
      setA3(question.answer3);
      setA4(question.answer4);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");
      setAllTopics(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

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

  async function fetchSubtopics(topic) {
    try {
      setShowKeys(false);
      const data = await api.get("subtopic/getByTopic/" + topic);
      const subtopics = data.data.elements;
      if (subtopics.length > 0) setAllSubtopics(data.data.elements);
      else setShowKeys(true);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics(null);
    setSubtopic(null);
    fetchSubtopics(id);
    fetchKeywords(topic, null, []);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    setValidationErrors({ ...validationErrors, subtopic: false });
    fetchKeywords(topic, id, []);
  };

  const changeCheckboxStatus = (e, id) => {
    const myKeys = [...keywords];
    const { checked } = e.target;

    myKeys.map((user) => {
      if (user.id === id) {
        user.isChecked = checked;
        handleChangeKey(user.id);
      }
      const isAllChildsChecked = myKeys.every((user) => user.isChecked === true);
      if (isAllChildsChecked) {
        setIsParentChecked(checked);
      } else {
        setIsParentChecked(false);
      }
      return user;
    });
    setKeywords([...myKeys]);
  };

  async function fetchKeywords(topic, subtopic, keywordIds) {
    let url = "keyword/getKeysByTopic/" + topic.id;
    if (subtopic != null) url = "keyword/getKeysBySubtopic/" + subtopic;
    try {
      const data = await api.get(url);
      const keys = data.data.elements;
      const newKeys = keys.map((item) => ({
        ...item,
        isChecked: keywordIds.includes(item.id),
      }));

      setKeywords(newKeys);
      setIsParentChecked(false);
      setTopic(topic);
      setCheckedKey(keywordIds);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeKey = (key) => {
    if (checkedKey.includes(key)) {
      const index = checkedKey.indexOf(key);
      checkedKey.splice(index, 1);
    } else checkedKey.push(key);
    if (checkedKey.length >= 2 && checkedKey.length <= 5)
      setValidationErrors({ ...validationErrors, keywords: false });
    else setValidationErrors({ ...validationErrors, keywords: true });
  };

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
        id: id,
        topic: topic.id,
        subtopic: s,
        question: question,
        level: level.id,
        a1: a1,
        a2: a2,
        a3: a3,
        a4: a4,
        keywords: checkedKey,
        validate: v,
        file_name: fileName,
        file_ext: fileExtension,
        oldFile: oldFile,
      };
      editQuestion(postData);
    }
  };

  async function editQuestion(postData) {
    try {
      const data = await api.post("question/update", postData);

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

  const flexDirection = windowWidth <= 1020 ? "column" : "row";
  const margin = windowWidth <= 1020 ? "0px" : "8px";
  const marginBottom = windowWidth <= 1020 ? "20px" : "0px";

  return (
    <Card
      border="light"
      bg="light"
      style={{ margin: margin, marginBottom: marginBottom, borderRadius: "4%" }}
    >
      <Card.Body style={{ display: "flex", flexDirection: flexDirection }}>
        <SoftBox
          width="25%"
          display="flex"
          borderRight={1}
          borderColor="rgb(52, 71, 103, 0.6)"
          flexDirection="column"
          justifyContent="space-between"
          mb={2}
          sx={{
            "@media (max-width: 1020px)": {
              width: "100%",
              borderRight: 0,
              borderBottom: 1,
              borderColor: "rgb(52, 71, 103, 0.6)",
            },
          }}
        >
          <SoftBox m={2}>
            <SoftBox mb={1} lineHeight={0}>
              <SoftTypography variant="h4" fontWeight="bold" color="info">
                Q {id}
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={1} lineHeight={0}>
              <SoftTypography variant="caption" color="info" fontWeight="medium">
                Topic:&nbsp;&nbsp;&nbsp;
                <SoftAutocomplete
                  onNewValueSelected={handleChangeTopic}
                  options={allTopics}
                  selected={topic}
                />
              </SoftTypography>
            </SoftBox>
            {allSubtopics && (
              <>
                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography
                    variant="caption"
                    color={validationErrors.subtopic ? "error" : "info"}
                    fontWeight="medium"
                  >
                    Subtopic:&nbsp;&nbsp;&nbsp;
                    <SoftAutocomplete
                      onNewValueSelected={handleChangeSubtopic}
                      options={allSubtopics}
                      selected={subtopic}
                    />
                  </SoftTypography>
                </SoftBox>
              </>
            )}
            <SoftBox mb={1} lineHeight={0}>
              <SoftTypography variant="caption" color="info" fontWeight="medium">
                Level:&nbsp;&nbsp;&nbsp;
              </SoftTypography>
              <SoftAutocomplete
                onNewValueSelected={(e) => {
                  setLevel(e);
                }}
                options={levelMarks}
                selected={level}
              />
            </SoftBox>
            {(showKeys || subtopic) && (
              <>
                <SoftBox sx={{ display: "flex", flexDirection: "column" }}>
                  <SoftTypography
                    color={validationErrors.keywords ? "error" : "info"}
                    variant="caption"
                    fontWeight="medium"
                    marginTop={2}
                  >
                    {" "}
                    Keywords{" "}
                  </SoftTypography>
                  <SoftTypography
                    color={validationErrors.keywords ? "error" : "dark"}
                    variant="caption"
                    fontWeight="light"
                  >
                    {" "}
                    Please select from 2 to 5 keywords{" "}
                  </SoftTypography>
                </SoftBox>
                <Container style={{ width: "100%", marginBottom: 5 }}>
                  <Row>
                    <Col>
                      <Form>
                        {keywords.map((key) => (
                          <Row key={key.id}>
                            <Col style={{ width: "100%" }}>
                              <Form.Check
                                type="checkbox"
                                checked={key.isChecked}
                                value="child"
                                label={key.label}
                                style={{ fontSize: "0.9rem" }}
                                onChange={(e) => changeCheckboxStatus(e, key.id)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </Form>
                    </Col>
                  </Row>
                </Container>
              </>
            )}
          </SoftBox>
        </SoftBox>
        <SoftBox
          width="75%"
          display="flex"
          justifyContent="space-around"
          alignItems="flex-start"
          flexDirection="column"
          m={2}
          sx={{
            "@media (max-width: 1020px)": {
              width: "100%",
              ml: 0,
              mr: 0,
            },
          }}
        >
          <SoftInput
            value={question}
            multiline
            sx={{ border: validationErrors.question ? "1px solid red" : "1px solid #ced4da" }}
            rows={12}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (e.target.value == "")
                setValidationErrors({ ...validationErrors, question: true });
              else setValidationErrors({ ...validationErrors, question: false });
            }}
          />
          <Accordion style={{ marginBottom: "50px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex>{question}</Latex>
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
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContents: "center",
            }}
          >
            {file && <img src={showImage} width="50%" style={{ borderRadius: "10px" }} />}
          </SoftBox>
          <SoftBox
            mt={1}
            border={1}
            borderRadius={10}
            borderColor={validationErrors.a1 ? "red" : "#a5eea0"}
            width="100%"
          >
            <SoftBox bgColor={validationErrors.a1 ? "red" : "#a5eea0"} borderRadius={6}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.a1 ? "white" : "#344767"}
                m={1}
              >
                Answer: True
              </SoftTypography>
            </SoftBox>
            <div style={{ overflowY: "auto", width: "100%" }}>
              <SoftInput
                value={a1}
                multiline
                rows={4}
                onChange={(e) => {
                  setA1(e.target.value);
                  setValidationErrors({ ...validationErrors, a1: false });
                  if (e.target.value == "") setValidationErrors({ ...validationErrors, a1: true });
                }}
              />
            </div>
          </SoftBox>
          <Accordion style={{ marginBottom: "50px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex>{a1}</Latex>
                  </SoftTypography>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <SoftBox mt={1} border={1} borderRadius={10} borderColor="#fec4c1" width="100%">
            <SoftBox bgColor={validationErrors.a2 ? "red" : "#fec4c1"} borderRadius={6}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.a2 ? "white" : "#344767"}
                m={1}
              >
                Answer: False
              </SoftTypography>
            </SoftBox>
            <div style={{ overflowY: "auto", width: "100%" }}>
              <SoftInput
                value={a2}
                multiline
                rows={4}
                onChange={(e) => {
                  setA2(e.target.value);
                  setValidationErrors({ ...validationErrors, a2: false });
                  if (e.target.value == "") setValidationErrors({ ...validationErrors, a2: true });
                }}
              />
            </div>
          </SoftBox>
          <Accordion style={{ marginBottom: "50px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex>{a2}</Latex>
                  </SoftTypography>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <SoftBox mt={1} border={1} borderRadius={10} borderColor="#fec4c1" width="100%">
            <SoftBox bgColor={validationErrors.a3 ? "red" : "#fec4c1"} borderRadius={6}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.a3 ? "white" : "#344767"}
                m={1}
              >
                Answer: False
              </SoftTypography>
            </SoftBox>
            <div style={{ overflowY: "auto", width: "100%" }}>
              <SoftInput
                value={a3}
                multiline
                rows={4}
                onChange={(e) => {
                  setA3(e.target.value);
                  setValidationErrors({ ...validationErrors, a3: false });
                  if (e.target.value == "") setValidationErrors({ ...validationErrors, a3: true });
                }}
              />
            </div>
          </SoftBox>
          <Accordion style={{ marginBottom: "50px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex>{a3}</Latex>
                  </SoftTypography>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <SoftBox mt={1} border={1} borderRadius={10} borderColor="#fec4c1" width="100%">
            <SoftBox bgColor={validationErrors.a4 ? "red" : "#fec4c1"} borderRadius={6}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.a4 ? "white" : "#344767"}
                m={1}
              >
                Answer: False
              </SoftTypography>
            </SoftBox>
            <div style={{ overflowY: "auto", width: "100%" }}>
              <SoftInput
                value={a4}
                multiline
                rows={4}
                onChange={(e) => {
                  setA4(e.target.value);
                  setValidationErrors({ ...validationErrors, a4: false });
                  if (e.target.value == "") setValidationErrors({ ...validationErrors, a4: true });
                }}
              />
            </div>
          </SoftBox>
          <Accordion style={{ marginBottom: "50px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex>{a4}</Latex>
                  </SoftTypography>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <SoftBox
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            sx={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <SoftButton
              variant="gradient"
              color="info"
              sx={{ width: "10%" }}
              onClick={() => handleSave(1)}
            >
              Save
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Card.Body>
    </Card>
  );
}

// Typechecking props for the Bill
EditView.propTypes = {
  id: PropTypes.number.isRequired,
  onSave: PropTypes.func,
};

export default EditView;
