import React, { useState, useEffect, useRef } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SearchBar from "./SearchBar";
import { MuiFileInput } from "mui-file-input";

import PropTypes from "prop-types";
import { useApi } from "api";
import { isPdfFile } from "services/isPdfFile";

function AddMaterial({ onSave, materialID }) {
  const validationMessageRef = useRef();
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const [newFile, setNewFile] = useState(null);
  const [oldFileName, setOldFileName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    description: false,
    author: false,
    title: false,
    file: false,
    keywords: false,
  });

  const validateForm = () => {
    const errors = {
      topic: topic === null,
      description: description.trim() === "",
      author: author.trim() === "",
      title: title.trim() === "",
      file: file == null,
      keywords: keywords.length < 2 || keywords.length > 5,
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
    fetchMaterial();
  }, [materialID]);

  async function fetchMaterial() {
    try {
      const data = await api.get("material/getById/" + materialID);
      const material = data.data.elements;
      fetchFile(materialID, material.file_ext, material.file_name);
      setOldFileName(material.id + "." + material.file_ext);
      setTopic({ label: material.platform__topic.name, id: material.platform__topic.id });
      material.platform__subtopic != null
        ? setSubtopic({
            label: material.platform__subtopic.name,
            id: material.platform__subtopic.id,
          })
        : null;
      setLink(material.link);
      setTitle(material.title);
      setAuthor(material.author);
      setDescription(material.description);
      setLoading(false);
      setKeywords(material.keywordIds);
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

  async function editMaterial(postData) {
    try {
      const data = await api.post("material/validateMaterial", postData);
      const renamedFile = new File([file], postData.id + "." + postData.file_ext, {
        type: file.type,
      });
      if (newFile != null) await uploadFile(renamedFile);
      else onSave();
    } catch (error) {
      //Handle Error
    }
  }

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

  const handleSave = (v) => {
    if (validateForm()) {
      const extension = file.name.split(".");
      var s = null;
      const isSameFile = newFile == null ? true : false;

      if (subtopic) s = subtopic.id;

      const postData = {
        id: materialID,
        title: title,
        author: author,
        description: description,
        link: link,
        topic: topic.id,
        subtopic: s,
        file_name: extension[0] + "." + extension[1],
        file_ext: extension[1],
        keywords: keywords,
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
      var s = null;
      const isSameFile = newFile == null ? true : false;

      if (subtopic) s = subtopic.id;

      const postData = {
        id: materialID,
        title: title,
        author: author,
        description: description,
        link: link,
        topic: topic.id,
        subtopic: s,
        file_name: extension[0] + "." + extension[1],
        file_ext: extension[1],
        keywords: keywords,
        validate: 4,
        oldFile: oldFileName,
        isSameFile: isSameFile,
      };
      editMaterial(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SoftBox width="98%" ref={validationMessageRef}>
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
      <SoftBox
        display="flex"
        flexDirection="row"
        sx={{
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        }}
      >
        <SoftBox
          width="50%"
          mr={2}
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              mb: 2,
            },
          }}
        >
          <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold">
            Title*
          </SoftTypography>
          <SoftInput
            defaultValue={title}
            placeholder="Type here..."
            sx={{ mb: 2, border: validationErrors.title ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setTitle(e.target.value);
              setValidationErrors({ ...validationErrors, title: false });
              if (e.target.value == "") setValidationErrors({ ...validationErrors, title: true });
            }}
          />
        </SoftBox>
        <SoftBox
          width="50%"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              mb: 2,
            },
          }}
        >
          <SoftTypography color={validationErrors.author ? "error" : "info"} fontWeight="bold">
            Author*
          </SoftTypography>
          <SoftInput
            defaultValue={author}
            placeholder="Type here..."
            sx={{ mb: 2, border: validationErrors.author ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setAuthor(e.target.value);
              setValidationErrors({ ...validationErrors, author: false });
              if (e.target.value == "") setValidationErrors({ ...validationErrors, author: true });
            }}
          />
        </SoftBox>
      </SoftBox>

      <SoftTypography color={validationErrors.description ? "error" : "info"} fontWeight="bold">
        Description*
      </SoftTypography>
      <SoftInput
        defaultValue={description}
        placeholder="Type here..."
        multiline
        sx={{ mb: 2, border: validationErrors.description ? "1px solid red" : "1px solid #ced4da" }}
        rows={5}
        onChange={(e) => {
          setDescription(e.target.value);
          setValidationErrors({ ...validationErrors, description: false });
          if (e.target.value == "") setValidationErrors({ ...validationErrors, description: true });
        }}
      />

      <SoftTypography color={validationErrors.file ? "error" : "info"} fontWeight="bold">
        Upload*
      </SoftTypography>
      <MuiFileInput
        value={file}
        inputProps={{ accept: "application/pdf,.pdf" }}
        sx={{
          mb: 2,
          width: "100%",
          border: validationErrors.file ? "1px solid red" : "1px solid #ced4da",
          borderRadius: 2,
        }}
        onChange={handleChangeFile}
      />

      <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">
        Link
      </SoftTypography>
      <SoftInput
        defaultValue={link}
        placeholder="Type here..."
        sx={{ mb: 2, border: validationErrors.link ? "1px solid red" : "1px solid #ced4da" }}
        onChange={(e) => setLink(e.target.value)}
      />

      <SoftBox display="flex" flexDirection="row" justifyContent="space-between">
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
            onClick={saveTemporaryMaterial}
          >
            Save
          </SoftButton>
          <SoftButton
            variant="gradient"
            color="error"
            sx={{ width: "10%" }}
            onClick={() => handleSave(2)}
          >
            Refuse
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

export default AddMaterial;

AddMaterial.propTypes = {
  onSave: PropTypes.func.isRequired,
  materialID: PropTypes.number.isRequired,
};
