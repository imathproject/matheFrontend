import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import SoftButton from "components/SoftButton";
import { MuiFileInput } from "mui-file-input";
import { Switch, FormControlLabel } from "@mui/material";

function EditPublication({ onSave, id }) {
  const validationMessageRef = useRef();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    content: false,
  });

  useEffect(() => {
    if (id) {
      fetchNewsData();
    }
  }, [id]);

  async function fetchNewsData() {
    try {
      const data = await api.get("news/getById/" + id);
      const news = data.data.element;
      setTitle(news.title || "");
      setSummary(news.summary || "");
      setContent(news.content || "");
      setLink(news.link || "");
      setIsPublished(news.isPublished || false);
      setExistingImageUrl(news.imageUrl || null);

      // Load existing image if available
      if (news.imageUrl) {
        try {
          const parts = news.imageUrl.split(".");
          const fileExt = parts[parts.length - 1];
          const fileId = parts[0]; // e.g. "news5"
          const imageResponse = await api.post(
            "news/downloadImage",
            { id: fileId, file_ext: fileExt },
            { responseType: "blob" }
          );
          const imageBlob = new Blob([imageResponse.data]);
          setShowImage(URL.createObjectURL(imageBlob));
        } catch (imgError) {
          console.error("Failed to load existing image:", imgError);
        }
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setErrorMessage("There was an error loading the news article.");
    }
  }

  function handleChangeFile(e) {
    if (e == null) {
      setShowImage(null);
    } else {
      const selectedFile = e;
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setShowImage(URL.createObjectURL(selectedFile));
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
      await api.post("news/uploadImage", formData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const validateForm = () => {
    const errors = {
      title: title.trim() === "",
      content: content.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const saveNews = async () => {
    if (validateForm()) {
      let imageUrl = existingImageUrl;

      if (file) {
        const splitFile = file.name.split(".");
        const fileExtension = splitFile[splitFile.length - 1];
        const renamedFile = new File([file], "news" + id + "." + fileExtension, {
          type: file.type,
        });
        await uploadFile(renamedFile);
        imageUrl = "news" + id + "." + fileExtension;
      }

      const postData = {
        id: id,
        title: title,
        summary: summary,
        content: content,
        link: link,
        imageUrl: imageUrl,
        isPublished: isPublished,
      };

      try {
        await api.put("news/update", postData);
        onSave();
      } catch (error) {
        console.error("Failed to update news:", error);
        setErrorMessage("There was an error saving the news article.");
      }
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

        <SoftTypography color={validationErrors.title ? "error" : "info"} fontWeight="bold">
          Title*
        </SoftTypography>
        <SoftInput
          value={title}
          placeholder="Type the news title..."
          multiline
          sx={{
            border: validationErrors.title ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          rows={2}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationErrors((prev) => ({ ...prev, title: e.target.value.trim() === "" }));
          }}
        />

        <SoftTypography color="info" fontWeight="bold">
          Summary
        </SoftTypography>
        <SoftInput
          value={summary}
          placeholder="Type a short summary..."
          multiline
          sx={{
            border: "1px solid #ced4da",
            marginBottom: "30px",
          }}
          rows={3}
          onChange={(e) => setSummary(e.target.value)}
        />

        <SoftTypography color={validationErrors.content ? "error" : "info"} fontWeight="bold">
          Content*
        </SoftTypography>
        <SoftInput
          value={content}
          placeholder="Type the full news content..."
          multiline
          sx={{
            border: validationErrors.content ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          rows={8}
          onChange={(e) => {
            setContent(e.target.value);
            setValidationErrors((prev) => ({ ...prev, content: e.target.value.trim() === "" }));
          }}
        />

        <SoftTypography color="info" fontWeight="bold">
          Link
        </SoftTypography>
        <SoftInput
          value={link}
          placeholder="Type the news link (URL)..."
          sx={{
            border: "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => setLink(e.target.value)}
        />

        <SoftTypography color="info" fontWeight="bold">
          Image
        </SoftTypography>
        <SoftBox width="100%" mr={1}>
          <MuiFileInput
            value={file}
            fullWidth
            hideSizeText
            sx={{ mb: 2, borderRadius: 2 }}
            onChange={(e) => handleChangeFile(e)}
          />
        </SoftBox>
        <SoftBox
          mx={1}
          mb={2}
          sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {showImage && <img src={showImage} width="50%" style={{ borderRadius: "10px" }} />}
        </SoftBox>

        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              color="info"
            />
          }
          label={
            <SoftTypography variant="body2" fontWeight="bold">
              Published
            </SoftTypography>
          }
          sx={{ mb: 3 }}
        />

        <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
          <SoftButton
            variant="gradient"
            color="success"
            sx={{ width: "10%" }}
            onClick={saveNews}
          >
            Save
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
}

EditPublication.propTypes = {
  onSave: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default EditPublication;
