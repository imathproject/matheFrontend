import React, { useState, useRef } from 'react';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import TopicKeywordsSelector from 'components/TopicKeywordsSelector';
import { MuiFileInput } from 'mui-file-input';

import PropTypes from "prop-types";
import { useApi } from 'api';
import { isPdfFile } from 'services/isPdfFile';

function AddMaterial({ onSave }) {
  const validationMessageRef = useRef();
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    description: false,
    author: false,
    title: false,
    file: false,
    keywords: false
  });

  const validateForm = () => {
    const errors = {
      topic: topic === null,
      description: description.trim() === "",
      author: author.trim() === "",
      title: title.trim() === "",
      file: file === null,
      keywords: keywords.length <2 || keywords.length > 5
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

  const handleChangeFile = (newFile) => {
    if (newFile != null && !isPdfFile(newFile)) {
      setFile(null);
      setErrorMessage("Please upload a PDF file.");
      setValidationErrors({ ...validationErrors, file: true });
      validationMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setErrorMessage(null);
    setFile(newFile);
    setValidationErrors({ ...validationErrors, file: newFile == null });
  };

  const newMaterial = async (postData, extension) => {
    try {
      const data = await api.post("material/add", postData); 
      const id = data.data.elements;
      setID(id);
      const renamedFile = new File([file], id+'.'+extension, { type: file.type });
      const newFile = await uploadFile(renamedFile);
      
    } catch (error) {
      const data = await api.get("material/deleteVideo/"+id); 
      console.error('Error adding material:', error);
    }
  };

  const uploadFile = async (renamedFile) => {
    const formData = new FormData();
    formData.append('file', renamedFile);
    try { 
      const data = await api.post("material/uploadFile", formData); 
      onSave()
    } catch (error) {
      console.error('Error adding material:', error);
    }
  }


  const saveMaterial = (v) => {
    if (validateForm()) {
    const extension = file.name.split('.');
    const postData = {
      title: title,
      author: author,
      type: 3,
      description: description,
      link: link,
      topic: topic,
      subtopic: subtopic,
      file_name: extension[0]+"."+extension[1],
      file_ext: extension[1],
      validate: v,
      keywords: keywords,
    };
    newMaterial(postData, extension[1]);
  } else {
    setErrorMessage("Please complete all required fields.");
    validationMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  };

  const saveTemporaryMaterial = () => {
    if (validateTemporaryForm()) {
    const extension = file.name.split('.');
    const postData = {
      title: title,
      author: author,
      type: 3,
      description: description,
      link: link,
      topic: topic,
      subtopic: subtopic,
      file_name: extension[0]+"."+extension[1],
      file_ext: extension[1],
      validate: 3,
      keywords: keywords,
    };
    newMaterial(postData, extension[1]);
  } else {
    setErrorMessage("Please complete all required fields.");
    validationMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  };

  // TODO: call the keyword recommendation API with the material content
  // (title, description, file, topic, subtopic) and return the ids of the
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
    <SoftBox width="98%" >
       {errorMessage && 
        <SoftBox sx={{display:"flex", flexDirection: "row", justifyContent:"center"}}>
          <SoftTypography variant="h6" color="error" fontWeight="light" >{errorMessage}</SoftTypography>
        </SoftBox>}
      <TopicKeywordsSelector contentName="material" onFilter={handleFilter} onSuggestKeywords={suggestKeywords} topicError={validationErrors.topic} keywordsError={validationErrors.keywords}>
      <SoftBox display="flex" flexDirection="row"
        sx={{
          '@media (max-width: 600px)': {
              flexDirection: 'column',
            },
        }}>
          <SoftBox width="50%" mr={2}
          sx={{
            '@media (max-width: 600px)': {
              width:"100%",
              mb: 2 
            },
          }}>
            <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold" >Title*</SoftTypography>
            <SoftInput placeholder="Type here..." sx={{mb:2, border: validationErrors.title ? '1px solid red' : '1px solid #ced4da'}}
            onChange={(e) => {
              setTitle(e.target.value);
              setValidationErrors({ ...validationErrors, title: false });
              if(e.target.value == "") setValidationErrors({ ...validationErrors, title: true });}}/>
          </SoftBox>
          <SoftBox  width="50%"
          sx={{
            '@media (max-width: 600px)': {
              width:"100%",
              mb: 2 
            },
          }}>
            <SoftTypography color={validationErrors.author ? "error" : "info"} fontWeight="bold" >Author*</SoftTypography>
            <SoftInput placeholder="Type here..." sx={{mb:2, border: validationErrors.author ? '1px solid red' : '1px solid #ced4da'}} 
            onChange={(e) => {
              setAuthor(e.target.value);
              setValidationErrors({ ...validationErrors, author: false });
              if(e.target.value == "") setValidationErrors({ ...validationErrors, author: true });
              }}/>
          </SoftBox>
          
        </SoftBox>
      

      <SoftTypography color={validationErrors.description ? "error" : "info"} fontWeight="bold">
        Description*
      </SoftTypography>
      <SoftInput
        placeholder="Type here..."
        multiline
        sx={{ mb: 2, border: validationErrors.description ? '1px solid red' : '1px solid #ced4da'}}
        rows={5}
        onChange={(e) =>{
          setDescription(e.target.value);
          setValidationErrors({ ...validationErrors, description: false });
          if(e.target.value == "") setValidationErrors({ ...validationErrors, description: true });
        }}
      />

      <SoftBox display="flex" flexDirection="row"
        sx={{
          '@media (max-width: 600px)': {
              flexDirection: 'column',
            },
        }}>
          <SoftBox width="50%" mr={2}
          sx={{
            '@media (max-width: 600px)': {
              width:"100%",
              mb: 2
            },
          }}>
            <SoftTypography color={validationErrors.file ? "error" : "info"} fontWeight="bold">
              Upload*
            </SoftTypography>
            <MuiFileInput value={file} placeholder="Choose a PDF file..." inputProps={{ accept: "application/pdf,.pdf" }} sx={{ mb: 2, width:"100%", border: validationErrors.file ? '1px solid red' : '1px solid #ced4da', borderRadius: 2}}
            onChange={handleChangeFile}  />
          </SoftBox>
          <SoftBox width="50%"
          sx={{
            '@media (max-width: 600px)': {
              width:"100%",
              mb: 2
            },
          }}>
            <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">
              Link
            </SoftTypography>
            <SoftInput placeholder="Type here..." sx={{ mb: 2, border: validationErrors.link ? '1px solid red' : '1px solid #ced4da' }} onChange={(e) => setLink(e.target.value)} />
          </SoftBox>
      </SoftBox>
      </TopicKeywordsSelector>

      <SoftBox display="flex" flexDirection="row" justifyContent="flex-end" gap={2} mb={2}>
        <SoftButton variant="outlined" color="info" sx={{ minWidth: 120 }} onClick={saveTemporaryMaterial}>
          Save
        </SoftButton>
        <SoftButton variant="gradient" color="info" sx={{ minWidth: 120 }} onClick={() => saveMaterial(4)}>
          Submit
        </SoftButton>
      </SoftBox>
    </SoftBox>
    </div>
  );
}

export default AddMaterial;



AddMaterial.propTypes = {
  onSave: PropTypes.func.isRequired, 
};

