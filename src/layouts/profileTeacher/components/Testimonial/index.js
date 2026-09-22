/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useSyncExternalStore } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";
import { useAuth } from "authContext";
import Input from "../Input";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import SoftInput from "components/SoftInput";
import Carousel from "react-bootstrap/Carousel";
import Information from "./information";
import Footer from "./footer";

function Testimonial() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [hasTestimonial, setHasTestimonial] = useState();
  const [loading, setLoading] = useState(true);
  const [information, setInformation] = useState();
  const [someErrors, setSomeErros] = useState("");
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

    setSomeErros(Object.values(errors).some((error) => error));
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    userTestimonial();
  }, [token]);

  async function userTestimonial() {
    try {
      const data = await api.get("testimonial/getByUser");
      var testimonial = data.data.elements;
      setHasTestimonial(testimonial != null ? true : false);
      setInformation(testimonial);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  async function addTestimonial(postData) {
    setLoading(true);
    try {
      const data = await api.post("testimonial/add/", postData);
      await userTestimonial();
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  const editProfile = () => {
    if (validateForm()) {
      const postData = {
        title: title,
        testimonial: testimonial,
      };
      addTestimonial(postData);
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ mt: 5, height: "100%" }}>
      {someErrors ? (
        <SoftBox
          p={2}
          sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <FontAwesomeIcon icon={faTriangleExclamation} color="red" />
          <SoftTypography color="error" sx={{ marginLeft: "5px" }}>
            There are missing fields, please fill them!
          </SoftTypography>
        </SoftBox>
      ) : null}
      {hasTestimonial ? (
        <SoftBox p={2}>
          <Carousel controls={false}>
            <Carousel.Item>
              <Information
                title={information.title}
                testimonial={information.testimonial}
                validated={information.validated}
              />
              <Carousel.Caption>
                <Footer
                  name={information.user_final.name + " " + information.user_final.surname}
                  country={information.user_final.country.alpha_2}
                  countryName={information.user_final.country.name}
                  role={information.user_final.role.description}
                />
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </SoftBox>
      ) : (
        <SoftBox p={2}>
          <SoftTypography variant="h6" fontWeight="bold" color="info" textTransform="capitalize">
            Give your testimonial &nbsp;
          </SoftTypography>
          <Divider />
          <SoftBox>
            <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.title ? "error" : "dark"}
              >
                Title: &nbsp;
              </SoftTypography>
              <SoftInput
                defaultValue={title}
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
                color={validationErrors.title ? "error" : "dark"}
                mt={1}
              >
                {title.length}/{maxLengthTitle} characters
              </SoftTypography>
            </SoftBox>
            <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
              <SoftTypography
                variant="button"
                fontWeight="bold"
                color={validationErrors.title ? "error" : "dark"}
              >
                Testimonial: &nbsp;
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
            </SoftBox>
          </SoftBox>
          <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
            <Grid item xs={12} lg={2} sx={{ ml: "auto" }}>
              <SoftButton variant="gradient" color="info" fullWidth onClick={editProfile}>
                Submit
              </SoftButton>
            </Grid>
          </SoftBox>
        </SoftBox>
      )}
    </Card>
  );
}

export default Testimonial;
