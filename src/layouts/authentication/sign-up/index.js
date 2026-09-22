import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import SoftButton from "components/SoftButton";
import Button from "@mui/material/Button";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import { useApi } from "api";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Separator from "layouts/authentication/components/Separator";
import "./password/styles.css";
// Images
import backgroud from "assets/images/tessera4.jpg";

//API
import { insertUser } from "services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(1);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const api = useApi();

  async function handleDownload() {
    try {
      const response = await api.get("info/downloadEurope", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `europe.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error
    }
  }

  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
  const [validate, setValidate] = useState({
    hasCap: false,
    hasNumber: false,
    has8digit: false,
    hasSpecialChar: false,
  });

  const strength = Object.values(validate).reduce((a, item) => a + item, 0);

  const handleChangePassword = (e) => {
    validatePassword(e.target.value);
    if (strength < 4) setValidationErrors({ ...validationErrors, password: true });
    else setValidationErrors({ ...validationErrors, password: false });
    setPassword(e.target.value);
  };

  const validatePassword = (password) => {
    setValidate({
      has8digit: password.length > 7,
      hasNumber: /\d/.test(password),
      hasCap: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
    checked: false,
  });

  const validateForm = () => {
    const errors = {
      name: name.trim() === "",
      surname: surname.trim() === "",
      email: !isValidEmail(email),
      confirmEmail: email !== confirmEmail || !isValidEmail(email) || !isValidEmail(confirmEmail),
      password: strength < 4,
      confirmPassword: password !== confirmPassword,
      checked: !checked,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const signUp = async () => {
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    if (!executeRecaptcha) {
      setError("Captcha not ready yet. Please try again.");
      return;
    }

    const token = await executeRecaptcha("signup");
    const postData = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      typology: user,
      token: token,
    };

    fetchSignUp(postData);
  };

  async function fetchSignUp(postData) {
    try {
      const data = await insertUser(postData);
      setSuccess(true);
      //navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      setError(t('sign_up_page.invalid_signup', 'Invalid Sign Up'));
    }
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <BasicLayout title={t('sign_up_page.welcome_to_mathe', 'Welcome to MathE!')} description="" image={backgroud}>
      {success ? (
        <Card>
          <SoftBox pt={2} pb={3} px={3}>
            <SoftBox
              mt={2}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <SoftTypography variant="title" color="dark" fontWeight="bold">
                {t('sign_up_page.thanks_confirm_email', 'Thanks for signing up, please confirm your email.')}
              </SoftTypography>
              <SoftTypography color="dark" variant="h6" fontWeight="medium" mb={2}>
                {t('sign_up_page.emailed_confirmation_link', "We've emailed you a confirmation link.")}
              </SoftTypography>
              <SoftTypography color="dark" variant="h6">
                {t('sign_up_page.confirm_email_profile_instructions', 'Once you confirm your email you can continue setting up your profile, after that, you can use the MathE platform.')}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Card>
      ) : (
        <Card>
          <SoftBox p={3} mb={1} textAlign="center">
            {error && (
              <SoftTypography color="error" fontWeight="bold">
                {error}
              </SoftTypography>
            )}
            <SoftTypography variant="h5" fontWeight="medium">
              {t('sign_up_page.register', 'Register')}
            </SoftTypography>
          </SoftBox>
          <SoftBox pt={2} pb={3} px={3}>
            <SoftBox component="form" role="form">
              <SoftBox mb={2}>
                <SoftInput
                  placeholder={t('sign_up_page.name', 'Name')}
                  error={validationErrors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setValidationErrors({ ...validationErrors, name: e.target.value === "" });
                  }}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  placeholder={t('sign_up_page.surname', 'Surname')}
                  error={validationErrors.surname}
                  onChange={(e) => {
                    setSurname(e.target.value);
                    setValidationErrors({ ...validationErrors, surname: e.target.value === "" });
                  }}
                />
              </SoftBox>

              <Separator phrase="" />
              <SoftBox mb={2}>
                {validationErrors.email || validationErrors.confirmEmail ? (
                  <SoftTypography color="error" variant="caption">
                    {t('sign_up_page.invalid_email', 'Invalid Email')}
                  </SoftTypography>
                ) : null}
                <SoftInput
                  type="email"
                  placeholder={t('sign_up_page.email', 'Email')}
                  error={validationErrors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationErrors({
                      ...validationErrors,
                      email: !isValidEmail(e.target.value),
                    });
                  }}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="email"
                  placeholder={t('sign_up_page.confirm_email', 'Confirm Email')}
                  error={email !== confirmEmail}
                  onChange={(e) => {
                    setConfirmEmail(e.target.value);
                    setValidationErrors({
                      ...validationErrors,
                      confirmEmail: email !== e.target.value,
                    });
                  }}
                />
              </SoftBox>

              <Separator phrase="" />
              <SoftBox
                mb={1}
                sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}
              >
                <SoftTypography
                  variant="caption"
                  sx={{ color: validationErrors.password ? "red" : "black" }}
                >
                  {t('sign_up_page.password_must_contain', 'Password must contain at least:')}
                </SoftTypography>

                <SoftTypography
                  variant="caption"
                  sx={{ color: validate.has8digit ? "green" : "#EBEBE4" }}
                >
                  {t('sign_up_page.eight_characters', '8 characters')}
                </SoftTypography>
                <SoftTypography
                  variant="caption"
                  sx={{ color: validate.hasSpecialChar ? "green" : "#EBEBE4" }}
                >
                  {t('sign_up_page.special_character', '1 special character')}
                </SoftTypography>
                <SoftTypography
                  variant="caption"
                  sx={{ color: validate.hasNumber ? "green" : "#EBEBE4" }}
                >
                  {t('sign_up_page.one_number', '1 number')}
                </SoftTypography>
                <SoftTypography
                  variant="caption"
                  sx={{ color: validate.hasCap ? "green" : "#EBEBE4" }}
                >
                  {t('sign_up_page.one_capital_letter', '1 capital letter')}
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={2} sx={{ position: "relative" }}>
                <SoftInput
                  type={showPassword ? "text" : "password"}
                  placeholder={t('sign_up_page.password', 'Password')}
                  onChange={handleChangePassword}
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
              <SoftBox mb={2} sx={{ position: "relative" }}>
                <SoftInput
                  type={showPassword ? "text" : "password"}
                  placeholder={t('sign_up_page.confirm_password', 'Confirm Password')}
                  error={password !== confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

              <Separator phrase={t('sign_up_page.user_type', 'User type')} />
              <SoftBox alignItems="center">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value);
                    }}
                  >
                    <SoftBox display="flex" flexDirection="row">
                      <FormControlLabel
                        value="1"
                        sx={{ mr: 5 }}
                        control={<Radio />}
                        label={t('sign_up_page.student', 'Student')}
                      />
                      <FormControlLabel value="2" control={<Radio />} label={t('sign_up_page.lecturer', 'Lecturer')} />
                    </SoftBox>
                  </RadioGroup>
                </FormControl>
              </SoftBox>

              <SoftBox mt={5}>
                <FormControlLabel
                  control={<Checkbox checked={checked} onChange={handleChange} color="primary" />}
                  label={
                    <span>
                      {t('sign_up_page.privacy_declare_read', 'I declare that I have read and accepted the ')}
                      <Button color="secondary" onClick={handleDownload}>
                        {t('sign_up_page.informative_note', 'informative note')}
                      </Button>
                      {t('sign_up_page.privacy_note_suffix', ' on privacy and the handling of all data submitted.')}
                    </span>
                  }
                />
              </SoftBox>
              <SoftBox mt={4} mb={3}>
                <SoftButton variant="gradient" color="dark" fullWidth onClick={signUp}>
                  {t('sign_up_page.sign_up_button', 'Sign Up')}
                </SoftButton>
              </SoftBox>
              <SoftBox mt={3} textAlign="center">
                <SoftTypography variant="button" color="text" fontWeight="regular">
                  {t('sign_up_page.already_have_account', 'Already have an account? ')}&nbsp;
                  <SoftTypography
                    component={Link}
                    to="/sign-in"
                    variant="button"
                    color="dark"
                    fontWeight="bold"
                    textGradient
                  >
                    {t('sign_up_page.sign_in_link', 'Sign In')}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      )}
    </BasicLayout>
  );
}

export default SignUp;
