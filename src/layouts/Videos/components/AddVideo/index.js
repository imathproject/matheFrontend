import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import TopicKeywordsSelector from "components/TopicKeywordsSelector";
import { useApi } from 'api';

function AddVideo({onSave}) {
  const validationMessageRef = useRef();
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    subtopic: false,
    link: false,
    description: false,
    author: false,
    title: false,
    keywords: false
  });

  const validateForm = () => {
    const errors = {
      topic: topic === null,
      link: link.trim() === "",
      description: description.trim() === "",
      author: author.trim() === "",
      title: title.trim() === "",
      keywords: keywords.length <2 || keywords.length > 5
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


  async function newVideo(postData) {
    try {
      const data = await api.post("material/add", postData); 
      onSave();
    } catch (error) {
      
    }
  }

  const saveVideo = (v) =>{
    if (validateForm()) {
    const postData = {
      title: title,
      author: author,
      type: 1,
      description: description,
      link: link,
      topic: topic,
      subtopic: subtopic,
      file_name: null,
      file_ext: null,
      validate: v,
      keywords: keywords
    };
    newVideo(postData);
  } else {
    setErrorMessage("Please complete all required fields.");
    validationMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  }

  const saveTemporaryVideo = () =>{
    if(validateTemporaryForm()){
    const postData = {
      title: title,
      author: author,
      type: 1,
      description: description,
      link: link,
      topic: topic,
      subtopic: subtopic,
      file_name: null,
      file_ext: null,
      validate: 3,
      keywords: keywords
    };
    newVideo(postData);
  }else{
    setErrorMessage("Please complete all required fields.");
    validationMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  }

  // TODO: call the keyword recommendation API with the video content
  // (title, description, link, topic, subtopic) and return the ids of the
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
        {errorMessage && 
        <SoftBox sx={{display:"flex", flexDirection: "row", justifyContent:"center"}}>
          <SoftTypography variant="h6" color="error" fontWeight="light" >{errorMessage}</SoftTypography>
        </SoftBox>}
        <TopicKeywordsSelector contentName="video" onFilter={handleFilter} onSuggestKeywords={suggestKeywords} topicError={validationErrors.topic} keywordsError={validationErrors.keywords}>
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
            <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold" >Title of the Video*</SoftTypography>
            <SoftInput placeholder="Type here..." sx={{mb:2, border: validationErrors.title ? '1px solid red' : '1px solid #ced4da'}}
            onChange={(e) => {
              setTitle(e.target.value)
              setValidationErrors({ ...validationErrors, title: false });
              if(e.target.value == "") setValidationErrors({ ...validationErrors, title: true });
            }}/>
          </SoftBox>
          <SoftBox  width="50%"
          sx={{
            '@media (max-width: 600px)': {
              width:"100%",
              mb: 2 
            },
          }}>
            <SoftTypography color={validationErrors.author ? "error" : "info"} fontWeight="bold" >Author of the Video*</SoftTypography>
            <SoftInput placeholder="Type here..." sx={{mb:2, border: validationErrors.author ? '1px solid red' : '1px solid #ced4da'}}
            onChange={(e) => {
              setAuthor(e.target.value);
              setValidationErrors({ ...validationErrors, author: false });
              if(e.target.value == "") setValidationErrors({ ...validationErrors, author: true });
            }}/>
          </SoftBox>
          
        </SoftBox>
      
      
      <SoftTypography color={validationErrors.description ? "error" : "info"} fontWeight="bold" >Description*</SoftTypography>
      <SoftInput placeholder="Type here..." multiline sx={{mb:2, border: validationErrors.description ? '1px solid red' : '1px solid #ced4da'}} rows={5}
      onChange={(e) => {
        setDescription(e.target.value);
        setValidationErrors({ ...validationErrors, description: false });
        if(e.target.value == "") setValidationErrors({ ...validationErrors, description: true });
        }}/>

      <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">Link of the Video*</SoftTypography>
      <SoftInput placeholder="Type here..." sx={{mb:2, border: validationErrors.link ? '1px solid red' : '1px solid #ced4da'}}
      onChange={(e) => {
        setLink(e.target.value);
        setValidationErrors({ ...validationErrors, link: false });
        if(e.target.value == "") setValidationErrors({ ...validationErrors, link: true });
        }}/>
        </TopicKeywordsSelector>

      <SoftBox display="flex" flexDirection="row" justifyContent="flex-end" gap={2} mb={2}>
         <SoftButton variant="outlined" color="info" sx={{ minWidth: 120 }} onClick={saveTemporaryVideo}>
                  Save
         </SoftButton>
         <SoftButton variant="gradient" color="info" sx={{ minWidth: 120 }} onClick={() => saveVideo(4)}>
                  Submit
         </SoftButton>
      </SoftBox>
      </SoftBox>
      </div>
  );
}

export default AddVideo;

AddVideo.propTypes = {
  onSave: PropTypes.func.isRequired, 
};

