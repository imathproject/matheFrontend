import { useState, useEffect, useRef } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import Card from "react-bootstrap/Card";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import ReactCountryFlag from "react-country-flag";
import styled from "styled-components";

const FlagBox = styled(SoftBox)`
  width: 100%;
  display: flex;
  justify-content: center; /* Center horizontally */
  margin-bottom: 10px;

  @media (max-width: 1020px) {
    width: 30%;
  }
`;

function EditView({ id, onSave }) {
  const validationMessageRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [title, setTitle] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const maxLengthTestimonial = 500;
  const maxLengthTitle = 50;
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    testimonial: false,
  });

  const validateForm = () => {
    const errors = {
      title: title.trim() === "",
      testimonial: testimonial.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    getTestimonial();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  async function getTestimonial() {
    try {
      const data = await api.get("testimonial/getById/" + id);
      const testimonial = data.data.elements;

      setTitle(testimonial.title);
      setTestimonial(testimonial.testimonial);
      setCountry(testimonial.user_final.country.alpha_2);
      setRole(testimonial.user_final.role.description);
      setName(testimonial.user_final.name + " " + testimonial.user_final.surname);
    } catch (error) {
      // Handle error
    }
  }

  const handleSave = (v) => {
    if (validateForm()) {
      const postData = {
        id: id,
        title: title,
        testimonial: testimonial,
        validated: v,
      };
      editTestimonial(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  async function editTestimonial(postData) {
    try {
      const data = await api.post("testimonial/validate", postData);
      onSave();
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
          justifyContent="space-around"
          mb={2}
          sx={{
            "@media (max-width: 1020px)": {
              width: "100%",
              borderRight: 0,
              borderBottom: 1,
              alignItems: "center",
              borderColor: "rgb(52, 71, 103, 0.6)",
            },
          }}
        >
          <SoftTypography color="info" fontWeight="bold" align="center">
            {name} - {role}
          </SoftTypography>
          <FlagBox>
            <ReactCountryFlag
              countryCode={country}
              svg
              style={{
                width: "70%",
                height: "70%",
                borderRadius: "20px",
              }}
            />
          </FlagBox>
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
            Title
          </SoftTypography>
          <SoftInput
            value={title}
            type="text"
            error={validationErrors.title}
            inputProps={{
              maxLength: maxLengthTitle,
            }}
            onChange={(event) => {
              const newValue = event.target.value;
              if (newValue.length <= maxLengthTitle) {
                setTitle(newValue);
              }
              setValidationErrors({ ...validationErrors, title: newValue.trim() === "" });
            }}
          />
          <SoftTypography
            variant="caption"
            mt={1}
            color={validationErrors.title ? "error" : "dark"}
          >
            {title.length}/{maxLengthTitle} characters
          </SoftTypography>

          <SoftTypography color={validationErrors.testimonial ? "error" : "info"} fontWeight="bold">
            Testimonial
          </SoftTypography>
          <SoftInput
            defaultValue={testimonial}
            type="text"
            inputProps={{
              maxLength: maxLengthTestimonial,
            }}
            error={validationErrors.testimonial}
            multiline
            rows={5}
            onChange={(event) => {
              const newValue = event.target.value;
              if (newValue.length <= maxLengthTestimonial) {
                setTestimonial(newValue);
              }
              setValidationErrors({ ...validationErrors, testimonial: newValue.trim() === "" });
            }}
          />
          <SoftTypography
            variant="caption"
            color={validationErrors.testimonial ? "error" : "dark"}
            mt={1}
          >
            {testimonial.length}/{maxLengthTestimonial} characters
          </SoftTypography>

          <SoftBox
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            sx={{
              marginTop: "2%",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SoftButton
              variant="gradient"
              color="info"
              sx={{ width: "10%" }}
              onClick={() => handleSave(0)}
            >
              Save
            </SoftButton>

            <SoftButton
              variant="gradient"
              color="success"
              sx={{ width: "10%" }}
              onClick={() => handleSave(1)}
            >
              Validate
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
