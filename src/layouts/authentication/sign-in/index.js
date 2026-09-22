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
import { useTranslation } from "react-i18next";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import background from "assets/images/tessera4.jpg";
import { signIn } from "services/auth";
import PropTypes from "prop-types";
import { useAuth } from "authContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function SignIn({ onLoginSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
  });

  const validateForm = () => {
    const errors = {
      email: !isValidEmail(username),
      password: pass.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const singIn = async () => {
    setError(null);

    if (!validateForm()) return;

    if (!executeRecaptcha) {
      setError("Captcha not ready yet. Please try again.");
      return;
    }

    const token = await executeRecaptcha("login");
    const postData = {
      email: username,
      password: pass,
      token: token,
    };
    fetchLogin(postData);
  };

  async function fetchLogin(postData) {
    try {
      const data = await signIn(postData);
      const completeP = data.completeProfile;

      login(
        data.name,
        data.surname,
        data.email,
        data.completeProfile,
        data.token
      );
      onLoginSuccess(completeP, data.type);
    } catch (error) {
      console.log(error);
      setError(t('sign_up.invalid_login_credentials', 'Invalid login credentials. Try again'));
    }
  }

  return (
    <CoverLayout
      title={t('sign_up.welcome_to_mathe', 'Welcome to MathE')}
      description={t('sign_up.enter_email_password_signin', 'Enter your email and password to sign in')}
      image={background}
    >
      <SoftBox component="form" role="form">
        {error && (
          <SoftTypography color="error" fontWeight="bold">
            {error}
          </SoftTypography>
        )}
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              {t('sign_up.email', 'Email')}
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder={t('sign_up.email', 'Email')}
            onChange={(e) => {
              setUsername(e.target.value);
              if (isValidEmail(e.target.value))
                setValidationErrors({ ...validationErrors, email: false });
              else setValidationErrors({ ...validationErrors, email: true });
            }}
            error={validationErrors.email}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              {t('sign_up.password', 'Password')}
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={2} sx={{ position: "relative" }}>
            <SoftInput
              type={showPassword ? "text" : "password"}
              placeholder={t('sign_up.password', 'Password')}
              onChange={(e) => {
                setPass(e.target.value);
                if (e.target.value == "")
                  setValidationErrors({ ...validationErrors, password: true });
                else setValidationErrors({ ...validationErrors, password: false });
              }}
              error={validationErrors.password}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "16px",
              }}
            />
          </SoftBox>
        </SoftBox>
        <Button
          color="secondary"
          onClick={() => {
            navigate("/recoverPassword");
          }}
        >
          {t('sign_up.forgot_password', 'Forgot your password?')}
        </Button>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="dark" fullWidth onClick={singIn}>
            {t('sign_up.sign_in_button', 'Sign In')}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

SignIn.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default SignIn;
