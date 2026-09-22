import { useState } from "react";
import { useTranslation } from "react-i18next";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "api";

function FormContact() {
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const api = useApi();

  async function sendEmail(formData) {
    try {
      await api.post("info/getInTouch", {
        name: formData.name,
        email: formData.email,
        userSubject: formData.subject,
        userContent: formData.message,
      });
    } catch (error) { }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = {
        name: form["validationCustom01"].value,
        phone: form["validationCustom02"].value,
        email: form["validationCustom03"].value,
        subject: form["validationCustom04"].value,
        message: form["validationCustom05"].value,
      };
      sendEmail(formData);
      setShowSuccess(true);
      form.reset();
    }
    setValidated(true);
  };

  return (
    <SoftBox
      borderRadius="lg"
      sx={{
        width: "80%",
        background: "#344764",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mx: "2%",
        p: 3,
      }}
    >
      <SoftTypography
        variant="h3"
        fontWeight="bold"
        sx={{ color: "#D6F0FF", textAlign: "center", mb: 3 }}
      >
        {t('get_in_touch', 'Get in Touch')}
      </SoftTypography>

      {showSuccess ? (
        <SoftBox>
          <SoftTypography
            variant="h5"
            sx={{
              color: "#28a745",
              background: "#d4edda",
              padding: "10px 20px",
              borderRadius: "5px",
              textAlign: "center",
              mb: 3,
            }}
          >
            <FontAwesomeIcon icon={faCircleCheck} size="lg" color="#38761d" />
            <SoftTypography variant="h5" sx={{ fontWeight: "bold", color: "#38761d" }}>
              {t('common.thank_you', 'Thank you!')}
            </SoftTypography>
            <SoftTypography variant="body2" sx={{ mt: 2 }}>
              {t('common.form_successfully_submitted', 'Your form has been successfully submitted.')}
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      ) : (
        // Form only shows if submission hasn't occurred yet
        <SoftBox
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Control required type="text" placeholder={t('common.placeholder_name', 'Name*')} />
              </Form.Group>
              <Form.Group as={Col} controlId="validationCustom02">
                <Form.Control required type="text" placeholder={t('common.placeholder_phone', 'Phone number*')} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom03">
                <Form.Control type="email" placeholder={t('common.placeholder_email', 'Email*')} required />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom04">
                <Form.Control type="text" placeholder={t('common.placeholder_subject', 'Subject*')} required />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom05">
                <InputGroup>
                  <InputGroup.Text style={{ background: "#D6F0FF", color: "#344764" }}>
                    {t('common.placeholder_message', 'Say something about us*')}
                  </InputGroup.Text>
                  <Form.Control as="textarea" required />
                </InputGroup>
              </Form.Group>
            </Row>
            <SoftBox sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <SoftButton type="submit" sx={{ background: "#D6F0FF", color: "#344764" }}>
                {t('common.submit_form', 'Submit form')}
              </SoftButton>
            </SoftBox>
          </Form>
        </SoftBox>
      )}
    </SoftBox>
  );
}

export default FormContact;
