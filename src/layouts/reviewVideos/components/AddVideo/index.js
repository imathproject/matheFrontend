import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SearchBar from "./SearchBar";
import { useApi } from "api";

function AddVideo({ onSave, videoID }) {
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
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    subtopic: false,
    link: false,
    description: false,
    author: false,
    title: false,
    keywords: false,
  });

  useEffect(() => {
    fetchVideo();
  }, [videoID]);

  async function fetchVideo() {
    try {
      const data = await api.get("material/getById/" + videoID);
      const video = data.data.elements;
      setTopic({ label: video.platform__topic.name, id: video.platform__topic.id });
      video.platform__subtopic != null
        ? setSubtopic({
            label: video.platform__subtopic.name,
            id: video.platform__subtopic.id,
          })
        : null;
      setLink(video.link);
      setTitle(video.title);
      setAuthor(video.author);
      setDescription(video.description);
      setLoading(false);
      setKeywords(video.keywordIds);
    } catch (error) {
      // Handle error
    }
  }

  const validateForm = () => {
    const errors = {
      topic: topic === null,
      link: link.trim() === "",
      description: description.trim() === "",
      author: author.trim() === "",
      title: title.trim() === "",
      keywords: keywords.length < 2 || keywords.length > 5,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  async function editVideo(postData) {
    try {
      const data = await api.post("material/validateMaterial", postData);
      onSave();
    } catch (error) {
      //Handle Error
    }
  }

  const handleSave = (v) => {
    if (validateForm()) {
      var s = null;
      if (subtopic) s = subtopic.id;

      const postData = {
        id: videoID,
        title: title,
        author: author,
        description: description,
        link: link,
        topic: topic.id,
        subtopic: s,
        file_name: null,
        file_ext: null,
        keywords: keywords,
        validate: v,
      };
      editVideo(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTemporarySave = () => {
    var s = null;
    if (subtopic) s = subtopic.id;

    const postData = {
      id: videoID,
      title: title,
      author: author,
      description: description,
      link: link,
      topic: topic.id,
      subtopic: s,
      file_name: null,
      file_ext: null,
      keywords: keywords,
      validate: 4,
    };
    editVideo(postData);
  };

  const handleFilter = (topic, subtopic, keywords, showKeys) => {
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
    return <div>Loading...</div>; // Render loading state
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
              Title of the Video
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
              Author of the Video
            </SoftTypography>
            <SoftInput
              defaultValue={author}
              placeholder="Type here..."
              sx={{
                mb: 2,
                border: validationErrors.author ? "1px solid red" : "1px solid #ced4da",
              }}
              onChange={(e) => {
                setAuthor(e.target.value);
                setValidationErrors({ ...validationErrors, author: false });
                if (e.target.value == "")
                  setValidationErrors({ ...validationErrors, author: true });
              }}
            />
          </SoftBox>
        </SoftBox>

        <SoftTypography color={validationErrors.description ? "error" : "info"} fontWeight="bold">
          Description
        </SoftTypography>
        <SoftInput
          defaultValue={description}
          placeholder="Type here..."
          multiline
          sx={{
            mb: 2,
            border: validationErrors.description ? "1px solid red" : "1px solid #ced4da",
          }}
          rows={5}
          onChange={(e) => {
            setDescription(e.target.value);
            setValidationErrors({ ...validationErrors, description: false });
            if (e.target.value == "")
              setValidationErrors({ ...validationErrors, description: true });
          }}
        />

        <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">
          Link of the Video
        </SoftTypography>
        <SoftInput
          defaultValue={link}
          placeholder="Type here..."
          sx={{ mb: 2, border: validationErrors.link ? "1px solid red" : "1px solid #ced4da" }}
          onChange={(e) => {
            setLink(e.target.value);
            setValidationErrors({ ...validationErrors, link: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, link: true });
          }}
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
              onClick={handleTemporarySave}
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
    </div>
  );
}

export default AddVideo;

AddVideo.propTypes = {
  onSave: PropTypes.func.isRequired,
  videoID: PropTypes.number.isRequired,
};
