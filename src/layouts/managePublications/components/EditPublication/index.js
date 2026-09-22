import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import SoftButton from "components/SoftButton";

function EditPublication({ onSave, id }) {
  const validationMessageRef = useRef();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

  useEffect(() => {
    setLoading(true);
    getPublication();
  }, [id]);

  async function getPublication() {
    try {
      const data = await api.get("publication/getById/" + id);
      const publication = data.data.elements;
      setTitle(publication.title);
      setAuthors(publication.authors);
      setLink(publication.link);
      setType(publication.type);
    } catch (error) {
      console.error("Failed to add publication", error);
      setErrorMessage("There was an error saving the publication.");
    }
  }

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    authors: false,
    type: false,
    link: false,
  });

  const validateForm = () => {
    const errors = {
      title: title.trim() === "",
      authors: authors.trim() === "",
      type: type.trim() === "",
      link: link.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  async function editPublication(postData) {
    try {
      const data = await api.post("publication/updatePublication", postData);
      onSave();
    } catch (error) {
      console.error("Failed to add publication", error);
      setErrorMessage("There was an error saving the publication.");
    }
  }

  const savePublication = () => {
    if (validateForm()) {
      const postData = {
        id: id,
        title: title,
        authors: authors,
        type: type,
        link: link,
      };
      editPublication(postData);
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
          multiline
          sx={{
            border: validationErrors.title ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "50px",
          }}
          rows={2}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              title: e.target.value.trim() === "",
            }));
          }}
        />

        <SoftTypography color={validationErrors.authors ? "error" : "info"} fontWeight="bold">
          Authors*
        </SoftTypography>
        <SoftInput
          value={authors}
          multiline
          sx={{
            border: validationErrors.authors ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          rows={2}
          onChange={(e) => {
            setAuthors(e.target.value);
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              authors: e.target.value.trim() === "",
            }));
          }}
        />

        <SoftTypography color={validationErrors.type ? "error" : "info"} fontWeight="bold">
          Type*
        </SoftTypography>
        <SoftInput
          value={type}
          sx={{
            border: validationErrors.type ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            setType(e.target.value);
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              type: e.target.value.trim() === "",
            }));
          }}
        />

        <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">
          Link*
        </SoftTypography>
        <SoftInput
          value={link}
          sx={{
            border: validationErrors.link ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            setLink(e.target.value);
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              link: e.target.value.trim() === "",
            }));
          }}
        />

        <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
          <SoftButton
            variant="gradient"
            color="success"
            sx={{ width: "10%" }}
            onClick={savePublication}
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
