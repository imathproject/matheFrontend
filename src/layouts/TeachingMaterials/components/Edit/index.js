import { useState, useEffect, useRef } from "react";
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
import { useApi } from "api";
import { MuiFileInput } from "mui-file-input";
import { isPdfFile } from "services/isPdfFile";

function EditView({ id, onSave }) {
  const validationMessageRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [checkedKey, setCheckedKey] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isParentChecked, setIsParentChecked] = useState(false);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [description, setDescription] = useState(null);
  const [link, setLink] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [oldFileName, setOldFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [showKeys, setShowKeys] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    author: false,
    description: false,
    link: false,
    file: false,
    subtopic: false,
    keywords: false,
  });

  const validateForm = () => {
    const errors = {
      description: description.trim() === "",
      author: author.trim() === "",
      title: title.trim() === "",
      file: file === null,
      subtopic: !showKeys && subtopic == null,
      keywords: checkedKey.length < 2 || checkedKey.length > 5,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const validateTemporaryForm = () => {
    const errors = {
      topic: topic === null,
      file: file === null,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    getMaterial();
    fetchTopics();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  const handleChangeFile = (newFile) => {
    if (newFile != null && !isPdfFile(newFile)) {
      setErrorMessage("Please upload a PDF file.");
      setValidationErrors({ ...validationErrors, file: true });
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setErrorMessage(null);
    setNewFile(newFile);
    setFile(newFile);
    setValidationErrors({ ...validationErrors, file: newFile == null });
  };

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
      const data = await api.post("material/downloadFile", { id: id, file_ext: file_ext });
      const fileName = name;
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const file = new File([url], fileName, { type: "application/octet-stream" });
      setFile(file);
    } catch (error) {
      // Handle error
    }
  }

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

  async function getMaterial() {
    try {
      const data = await api.get("material/getById/" + id);
      const material = data.data.elements;
      fetchFile(id, material.file_ext, material.file_name);
      setOldFileName(material.id + "." + material.file_ext);
      setDescription(material.description);
      setLink(material.link);
      setAuthor(material.author);
      setTitle(material.title);
      fetchSubtopics(material.platform__topic.id);
      if (material.platform__subtopic != null) {
        setSubtopic({
          label: material.platform__subtopic.name,
          id: material.platform__subtopic.id,
        });
        fetchKeywords(
          { label: material.platform__topic.name, id: material.platform__topic.id },
          material.platform__subtopic.id,
          material.keywordIds
        );
      } else
        fetchKeywords(
          { label: material.platform__topic.name, id: material.platform__topic.id },
          null,
          material.keywordIds
        );
    } catch (error) {
      // Handle error
    }
  }

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
      const extension = file.name.split(".");
      var s = null;
      if (subtopic) s = subtopic.id;
      const isSameFile = newFile == null ? true : false;
      const postData = {
        id: id,
        title: title,
        author: author,
        description: description,
        link: link,
        topic: topic.id,
        subtopic: s,
        file_name: extension[0] + "." + extension[1],
        file_ext: extension[1],
        keywords: checkedKey,
        validate: v,
        oldFile: oldFileName,
        isSameFile: isSameFile,
      };

      editMaterial(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const saveTemporaryMaterial = () => {
    if (validateTemporaryForm()) {
      const extension = file.name.split(".");
      const isSameFile = newFile == null ? true : false;
      var s = null;
      if (subtopic) s = subtopic.id;
      const postData = {
        id: id,
        title: title,
        author: author,
        description: description,
        link: link,
        topic: topic.id,
        subtopic: s,
        file_name: extension[0] + "." + extension[1],
        file_ext: extension[1],
        keywords: checkedKey,
        validate: 3,
        oldFile: oldFileName,
        isSameFile: isSameFile,
      };
      editMaterial(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const uploadFile = async (renamedFile) => {
    const formData = new FormData();
    formData.append("file", renamedFile);
    try {
      const data = await api.post("material/uploadFile", formData);
      onSave();
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

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

  async function editMaterial(postData) {
    try {
      const data = await api.post("material/updateMaterial", postData);
      const renamedFile = new File([file], postData.id + "." + postData.file_ext, {
        type: file.type,
      });
      if (newFile != null) await uploadFile(renamedFile);
      else onSave();
    } catch (error) {
      //Handle Error
    }
  }

  const flexDirection = windowWidth <= 1020 ? "column" : "row";
  const margin = windowWidth <= 1020 ? "0px" : "8px";
  const marginBottom = windowWidth <= 1020 ? "20px" : "0px";

  return (
    <Card
      ref={validationMessageRef}
      border="light"
      bg="light"
      style={{ margin: margin, marginBottom: marginBottom, borderRadius: "4%" }}
    >
      {errorMessage && (
        <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <SoftTypography variant="h6" color="error" fontWeight="light">
            {errorMessage}
          </SoftTypography>
        </SoftBox>
      )}
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
                Material {id}
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
          <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold">
            Title of the material
          </SoftTypography>
          <SoftInput
            value={title}
            sx={{ mb: 2, border: validationErrors.title ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value == "") setValidationErrors({ ...validationErrors, title: true });
              else setValidationErrors({ ...validationErrors, title: false });
            }}
          />

          <SoftTypography color={validationErrors.description ? "error" : "info"} fontWeight="bold">
            Description
          </SoftTypography>
          <SoftInput
            value={description}
            multiline
            sx={{
              mb: 2,
              border: validationErrors.description ? "1px solid red" : "1px solid #ced4da",
            }}
            rows={5}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value == "")
                setValidationErrors({ ...validationErrors, description: true });
              else setValidationErrors({ ...validationErrors, description: false });
            }}
          />

          <SoftTypography color={validationErrors.author ? "error" : "info"} fontWeight="bold">
            Auhtor
          </SoftTypography>
          <SoftInput
            value={author}
            sx={{ mb: 2, border: validationErrors.author ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (e.target.value == "") setValidationErrors({ ...validationErrors, author: true });
              else setValidationErrors({ ...validationErrors, author: false });
            }}
          />

          <SoftTypography color={validationErrors.file ? "error" : "info"} fontWeight="bold">
            Upload
          </SoftTypography>
          <MuiFileInput
            value={file}
            fullWidth
            inputProps={{ accept: "application/pdf,.pdf" }}
            sx={{ mb: 2 }}
            onChange={handleChangeFile}
          />

          <SoftTypography color={validationErrors.author ? "error" : "info"} fontWeight="bold">
            Link of the material
          </SoftTypography>
          <SoftInput
            value={link}
            sx={{ mb: 2, border: validationErrors.link ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setLink(e.target.value);
              if (e.target.value == "") setValidationErrors({ ...validationErrors, link: true });
              else setValidationErrors({ ...validationErrors, link: false });
            }}
          />

          <SoftBox
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            sx={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <SoftButton
              variant="gradient"
              color="success"
              sx={{ width: "10%" }}
              onClick={saveTemporaryMaterial}
            >
              Save
            </SoftButton>
            <SoftButton
              variant="gradient"
              color="info"
              sx={{ width: "10%" }}
              onClick={() => handleSave(4)}
            >
              Submit
            </SoftButton>
          </SoftBox>
          <SoftBox
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              mt: 2,
            }}
          ></SoftBox>
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
