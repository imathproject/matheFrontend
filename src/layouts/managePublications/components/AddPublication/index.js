import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import SoftButton from "components/SoftButton";

function AddPublication({ onSave }) {
  const validationMessageRef = useRef();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [type, setType] = useState("");
  const [link, setlink] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

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

  async function addPublication(postData) {
    try {
      const data = await api.post("publication/addPublication", postData);
      onSave();
    } catch (error) {
      // Handle error
    }
  }

  const savePublication = () => {
    if (validateForm()) {
      const postData = {
        title: title,
        authors: authors,
        type: type,
        link: link,
      };
      addPublication(postData);
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
          placeholder="Type here..."
          multiline
          sx={{
            border: validationErrors.title ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "50px",
          }}
          rows={2}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationErrors({ ...validationErrors, title: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, title: true });
          }}
        />

        <SoftTypography color={validationErrors.authors ? "error" : "info"} fontWeight="bold">
          Authors*
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          multiline
          sx={{
            border: validationErrors.authors ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          rows={2}
          onChange={(e) => {
            setAuthors(e.target.value);
            setValidationErrors({ ...validationErrors, authors: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, authors: true });
          }}
        />

        <SoftTypography color={validationErrors.type ? "error" : "info"} fontWeight="bold">
          Type*
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          sx={{
            border: validationErrors.type ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            setType(e.target.value);
            setValidationErrors({ ...validationErrors, type: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, type: true });
          }}
        />

        <SoftTypography color={validationErrors.link ? "error" : "info"} fontWeight="bold">
          Link*
        </SoftTypography>
        <SoftInput
          placeholder="Type here..."
          sx={{
            border: validationErrors.link ? "1px solid red" : "1px solid #ced4da",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            setlink(e.target.value);
            setValidationErrors({ ...validationErrors, link: false });
            if (e.target.value == "") setValidationErrors({ ...validationErrors, link: true });
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

export default AddPublication;

AddPublication.propTypes = {
  onSave: PropTypes.func.isRequired,
};
