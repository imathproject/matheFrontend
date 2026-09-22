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

import { useState, useEffect } from "react";

// react-router-dom components
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "./components/BasicLayout";
import backgroud from "assets/images/tessera4.jpg";
import SoftInput from "components/SoftInput";
import {
  faCircleCheck,
  faTriangleExclamation,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./components/styles.css";
//API
import { recoverPassword } from "services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function NewPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const checkcode = queryParameters.get("checkcode");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    password: false,
    repeatPassword: false,
  });

  const validateForm = () => {
    const errors = {
      password: strength < 4,
      repeatPassword: password !== repeatPassword || repeatPassword.trim() == "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    if (!checkcode) navigate("/", { replace: true });
  }, [checkcode]);

  async function updatePassword() {
    if (validateForm()) {
      const postData = {
        checkcode: checkcode,
        newPassword: password,
      };

      try {
        const data = await recoverPassword(postData);
        setSuccess(true);
        //window.location.reload();
      } catch (error) {
        setPasswordError(true);
        setError(error.message);
      }
    }
  }

  const handleChangePassword = (e) => {
    validatePassword(e.target.value);
    if (strength < 4) setValidationErrors({ ...validationErrors, password: true });
    else setValidationErrors({ ...validationErrors, password: false });
  };

  const [validate, setValidate] = useState({
    hasCap: false,
    hasNumber: false,
    has8digit: false,
    hasSpecialChar: false,
  });

  const strength = Object.values(validate).reduce((a, item) => a + item, 0);

  const validatePassword = (password) => {
    if (password.length > 7) {
      setValidate((o) => ({ ...o, has8digit: true }));
    } else {
      setValidate((o) => ({ ...o, has8digit: false }));
    }

    if (password.match(/\d+/g)) {
      setValidate((o) => ({ ...o, hasNumber: true }));
    } else {
      setValidate((o) => ({ ...o, hasNumber: false }));
    }

    if (password.match(/[A-Z]+/g)) {
      setValidate((o) => ({ ...o, hasCap: true }));
    } else {
      setValidate((o) => ({ ...o, hasCap: false }));
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setValidate((o) => ({ ...o, hasSpecialChar: true }));
    } else {
      setValidate((o) => ({ ...o, hasSpecialChar: false }));
    }
  };

  return (
    <BasicLayout title={t('new_password.title', 'Recover your password')} description="" image={backgroud}>
      {success ? (
        <Card>
          <SoftBox pt={2} pb={3} px={3}>
            <SoftBox mt={2} display="flex" alignItems="center">
              <FontAwesomeIcon icon={faCircleCheck} color="green" size="3x" />
              <SoftTypography color="dark" variant="h5" fontWeight="bold" ml={2}>
                {t('new_password.password_changed_success', 'Password changed successfully! Go to login page')}
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton
                variant="gradient"
                color="dark"
                fullWidth
                onClick={() => {
                  navigate("/sign-in", { replace: true });
                }}
              >
                {t('new_password.login_page_button', 'Login Page')}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </Card>
      ) : (
        <Card>
          <SoftBox pt={2} pb={3} px={3}>
            {error && (
              <SoftBox mb={3} display="flex" alignItems="center" justifyContent="sapce-between">
                <SoftTypography color="error" ml={2} variant="caption" fontWeight="bold">
                  {error}
                </SoftTypography>
              </SoftBox>
            )}
            <SoftTypography variant="h5" fontWeight="medium" mb={2}>
              {t('new_password.enter_new_password_please', 'Enter the new password, please')}
            </SoftTypography>
            <SoftBox component="form" role="form">
              <SoftBox mb={2}>
                <SoftBox
                  mb={1}
                  sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}
                >
                  <SoftTypography
                    variant="caption"
                    sx={{ color: validationErrors.password ? "red" : "black" }}
                  >
                    {t('new_password.password_must_contain', 'Password must contain at least:')}
                  </SoftTypography>

                  <SoftTypography
                    variant="caption"
                    sx={{ color: validate.has8digit ? "green" : "#EBEBE4" }}
                  >
                    {t('new_password.eight_characters', '8 characters')}
                  </SoftTypography>
                  <SoftTypography
                    variant="caption"
                    sx={{ color: validate.hasSpecialChar ? "green" : "#EBEBE4" }}
                  >
                    {t('new_password.one_special_character', '1 special character')}
                  </SoftTypography>
                  <SoftTypography
                    variant="caption"
                    sx={{ color: validate.hasNumber ? "green" : "#EBEBE4" }}
                  >
                    {t('new_password.one_number', '1 number')}
                  </SoftTypography>
                  <SoftTypography
                    variant="caption"
                    sx={{ color: validate.hasCap ? "green" : "#EBEBE4" }}
                  >
                    {t('new_password.one_capital_letter', '1 capital letter')}
                  </SoftTypography>

                  {/* <div className={`feedback strength-${strength}`} hidden={password.length === 0}>
                  {feedback}
                </div> */}
                </SoftBox>
                <SoftBox mb={2} sx={{ position: "relative" }}>
                  <SoftInput
                    type={showPassword ? "text" : "password"}
                    placeholder={t('new_password.password', 'Password')}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleChangePassword(e);
                    }}
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
              <SoftBox mb={2} sx={{ position: "relative" }}>
                <SoftInput
                  placeholder={t('new_password.repeat_password', 'Repeat password')}
                  type={showPassword ? "text" : "password"}
                  mb={2}
                  error={validationErrors.repeatPassword}
                  onChange={(e) => {
                    setRepeatPassword(e.target.value);
                    if (e.target.value == "")
                      setValidationErrors({ ...validationErrors, repeatPassword: true });
                    else setValidationErrors({ ...validationErrors, repeatPassword: false });
                  }}
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
              <SoftBox mt={4} mb={3}>
                <SoftButton variant="gradient" color="dark" fullWidth onClick={updatePassword}>
                  {t('new_password.recover', 'Recover')}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      )}
    </BasicLayout>
  );
}

export default NewPassword;
