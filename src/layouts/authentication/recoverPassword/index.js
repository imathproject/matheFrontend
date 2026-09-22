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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import Card from "@mui/material/Card";
import SoftButton from "components/SoftButton";


// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import backgroud from "assets/images/tessera4.jpg";

//API
import { requestNewPassword } from "services/user";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function RecoverPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [success, setSuccess] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();


  const [error, setError] = useState(null);

  const [validationErrors, setValidationErrors] = useState({
    email: false
  });

  const validateForm = () => {
    const errors = {
      email: !isValidEmail(email)
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };


  const recoverPassword = async () => {
    if (!validateForm()) return;

    if (!executeRecaptcha) {
      setError("Captcha not ready yet. Please try again.");
      return;
    }

    const token = await executeRecaptcha("recover_password");
    const postData = {
      email: email,
      token: token
    }
    fetchRecoverPassword(postData);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function fetchRecoverPassword(postData) {
    try {
      const data = await requestNewPassword(postData);
      setSuccess(true);
      //   navigate("/assessment", { replace: true });
    } catch (error) {

      console.log(error)
      setError(t('recover_password_page.invalid_signup', 'Invalid Sign Up'));
    }
  }

  return (
    <BasicLayout
      title={t('recover_password_page.recover_password_title', 'Recover your password')}
      description=""
      image={backgroud}
    >
      {success ?
        <Card>
          <SoftBox pt={2} pb={3} px={3} >
            <SoftBox mt={2} display="flex" alignItems="center" justifyContent="center">
              <FontAwesomeIcon icon={faCircleCheck} color="green" size="1x" />
              <SoftTypography color="dark" variant="h6" fontWeight="medium" ml={2}>
                {t('recover_password_page.check_your_email', 'Check your email')}
              </SoftTypography>
            </SoftBox>
          </SoftBox>

        </Card>
        :
        <Card>
          <SoftBox pt={2} pb={3} px={3} >
            <SoftTypography variant="h5" fontWeight="medium" mb={2}>
              {t('recover_password_page.enter_email_account_please', 'Enter your email account, please.')}
            </SoftTypography>
            <SoftBox component="form" role="form">
              <SoftBox mb={2}>
                <SoftInput placeholder={t('recover_password_page.email', 'Email')} error={validationErrors.email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (isValidEmail(e.target.value)) setValidationErrors({ ...validationErrors, email: false });
                    else setValidationErrors({ ...validationErrors, email: true });
                  }} />
              </SoftBox>
              <SoftBox mt={4} mb={3}>
                <SoftButton variant="gradient" color="dark" fullWidth onClick={recoverPassword} >
                  {t('recover_password_page.recover', 'Recover')}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>}
    </BasicLayout>
  );
}

export default RecoverPassword;
