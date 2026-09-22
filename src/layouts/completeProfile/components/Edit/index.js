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

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { useApi } from "api";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useAuth } from "authContext";
import Input from "../Input";
import InputBox from "../InputBox";
import Select from "../Select";
import Slider from "@mui/material/Slider";
import UseNumberInput from "../InputNumber";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const LEGAL_AGE = 18;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Edit() {
  const { token, login } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [work, setWork] = useState("");
  const [learning, setLearning] = useState("");
  const [hobby, setHobby] = useState("");
  const [profile, setProfile] = useState("");
  const [level, setLevel] = useState(1);
  const [percentage, setPercentage] = useState("");
  const [course, setCourse] = useState("");
  const [uniOptions, setUniOptions] = useState([]);
  const [hobbiesOptions, setHobbiesOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [learningOptions, setLearningOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [percentageOptions, setPercentageOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [someErrors, setSomeErros] = useState(false);
  const [email, setEmail] = useState("");
  const [uniSuggestion, setUniSuggestion] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [dataProtectionAccepted, setDataProtectionAccepted] = useState(false);
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    profile: false,
    birthday: false,
    gender: false,
    university: false,
    uniSuggest: false,
    degree: false,
    country: false,
    work: false,
    learning: false,
    hobby: false,
    level: false,
    percentage: false,
    course: false,
    guardianName: false,
    guardianEmail: false,
    dataProtectionAccepted: false,
  });

  const isMinor =
    birthday !== "" &&
    !isNaN(birthday) &&
    new Date().getFullYear() - Number(birthday) < LEGAL_AGE;

  const validateForm = () => {
    const errors = {
      name: name.trim() === "",
      surname: surname.trim() === "",
      profile: profile.trim() === "",
      birthday: birthday === "",
      gender: gender === "",
      university: university === "",
      uniSuggest: university.id == 64 && uniSuggestion.trim() === "",
      degree: degree === "",
      country: country === "",
      work: work === "",
      learning: learning === "",
      hobby: hobby === "",
      level: level === null,
      percentage: percentage === "",
      course: course === "",
      guardianName: isMinor && guardianName.trim() === "",
      guardianEmail: isMinor && guardianEmail.trim() !== "" && !isValidEmail(guardianEmail),
      dataProtectionAccepted: isMinor && !dataProtectionAccepted,
    };

    setValidationErrors(errors);
    setSomeErros(Object.values(errors).some((error) => error));
    return !Object.values(errors).some((error) => error);
  };

  // Prepended at render time so the label follows the active language.
  const universityOptions = useMemo(
    () => [{ label: t("complete_profile_page.university_other_option"), id: 64 }, ...uniOptions],
    [uniOptions, t]
  );

  const marks = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          getUniversities(),
          getHobbies(),
          getLearning(),
          getGenders(),
          getWorkPreferences(),
          getCountries(),
          getPercentages(),
          getDegrees(),
          getPercentages(),
          getCourses(),
          userData(),
        ]);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  async function getUniversities() {
    try {
      const data = await api.get("university/getAvailableUniversities");
      var universities = data.data.elements;
      universities.unshift({ label: "Other / Suggest a new university", id: 64 });
      setUniOptions(universities);
    } catch (error) {
      // Handle error
    }
  }

  async function getWorkPreferences() {
    try {
      const data = await api.get("work/getAll");
      setWorkOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getGenders() {
    try {
      const data = await api.get("gender/getAll");
      setGenderOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getCountries() {
    try {
      const data = await api.get("country/getAll");
      setCountryOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getHobbies() {
    try {
      const data = await api.get("hobbies/getAll");
      setHobbiesOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getLearning() {
    try {
      const data = await api.get("learning/getAll");
      setLearningOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getDegrees() {
    try {
      const data = await api.get("degree/getAll");

      setDegreeOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getCourses() {
    try {
      const data = await api.get("course/getAll");
      setCourseOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getPercentages() {
    try {
      const data = await api.get("degreePercentage/getAll");
      setPercentageOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function userData() {
    try {
      const data = await api.get("user/getProfile");
      const user = data.data.elements;
      setName(user[0].name);
      setSurname(user[0].surname);
      setEmail(user[0].email);
    } catch (error) {
      // Handle error
    }
  }

  async function updateData(postData) {
    try {
      if (university.id == 64) {
        const uniData = {
          name: uniSuggestion,
          country: null,
          timezone: null,
          vis: null,
          latitude: null,
          longitude: null,
          validated: 0,
        };
        const data = await api.post("university/suggest", uniData);
        postData.university = data.data.elements.id;
      }
      const data = await api.post("user/update", postData);
      login(name, surname, email, 1, token);
      window.location.href = "/choose-platform";
    } catch (error) {
      // Handle error
    }
  }

  async function handleDownloadDataProtectionPolicy() {
    try {
      const response = await api.get("info/downloadDataProtection", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-protection-policy.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error
    }
  }

  const editProfile = () => {
    if (validateForm()) {
      const postData = {
        name: name,
        surname: surname,
        profile: profile,
        birth_year: birthday,
        gender: gender.id,
        university: university.id,
        degree: degree.id,
        study_country: country.id,
        work: work.id,
        learning: learning.id,
        hobbies: hobby.id,
        enjoy_math: level,
        percentage: percentage.id,
        course: course.id,
      };
      if (isMinor) {
        postData.guardian_name = guardianName;
        postData.guardian_email = guardianEmail;
      }
      updateData(postData);
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  if (loading) {
    return <div>{t("complete_profile_page.loading")}</div>;
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
            {t("complete_profile_page.missing_fields")}
          </SoftTypography>
        </SoftBox>
      ) : null}
      <SoftBox p={2}>
        <SoftTypography variant="h6" fontWeight="bold" color="info" textTransform="capitalize">
          {t("complete_profile_page.personal_data")} &nbsp;
        </SoftTypography>
        <Divider />
        <SoftBox>
          <Input
            label={t("complete_profile_page.email_label")}
            defaultValue={email}
            type="text"
            disabled={true}
          />
          <Input
            label={t("complete_profile_page.name_label")}
            defaultValue={name}
            type="text"
            error={validationErrors.name}
            onInputChange={(value) => {
              setName(value);
              setValidationErrors({ ...validationErrors, name: false });
              if (value == "") setValidationErrors({ ...validationErrors, name: true });
            }}
          />
          <Input
            label={t("complete_profile_page.surname_label")}
            defaultValue={surname}
            type="text"
            error={validationErrors.surname}
            onInputChange={(value) => {
              setSurname(value);
              setValidationErrors({ ...validationErrors, surname: false });
              if (value == "") setValidationErrors({ ...validationErrors, surname: true });
            }}
          />
          <UseNumberInput
            label={t("complete_profile_page.birth_year_label")}
            error={validationErrors.birthday}
            defaultValue={birthday}
            onInputChange={(value) => {
              setBirthday(value);
              setValidationErrors({ ...validationErrors, birthday: false });
              if (value == "") setValidationErrors({ ...validationErrors, birthday: true });
            }}
          />
          {isMinor ? (
            <>
              <SoftTypography variant="caption" fontWeight="light" color="dark" ml={2}>
                {t(
                  "complete_profile_page.minor_notice",
                  "As you are under 18, we need a parent or guardian's contact details."
                )}
              </SoftTypography>
              <Input
                label={t("complete_profile_page.guardian_name_label", "Parent/Guardian name")}
                defaultValue={guardianName}
                type="text"
                error={validationErrors.guardianName}
                onInputChange={(value) => {
                  setGuardianName(value);
                  setValidationErrors({ ...validationErrors, guardianName: false });
                  if (value.trim() === "")
                    setValidationErrors({ ...validationErrors, guardianName: true });
                }}
              />
              <Input
                label={t(
                  "complete_profile_page.guardian_email_label",
                  "Parent/Guardian email (optional)"
                )}
                defaultValue={guardianEmail}
                type="text"
                error={validationErrors.guardianEmail}
                onInputChange={(value) => {
                  setGuardianEmail(value);
                  setValidationErrors({
                    ...validationErrors,
                    guardianEmail: value.trim() !== "" && !isValidEmail(value),
                  });
                }}
              />
              <SoftBox py={1} pr={2} pl={2} mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dataProtectionAccepted}
                      onChange={(e) => {
                        setDataProtectionAccepted(e.target.checked);
                        setValidationErrors({
                          ...validationErrors,
                          dataProtectionAccepted: !e.target.checked,
                        });
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <span>
                      {t("complete_profile_page.data_protection_declare", "I declare that I have read and accepted the ")}
                      <Button color="secondary" onClick={handleDownloadDataProtectionPolicy}>
                        {t("complete_profile_page.data_protection_policy_link", "Data Protection Policy")}
                      </Button>
                    </span>
                  }
                />
                {validationErrors.dataProtectionAccepted ? (
                  <SoftTypography variant="caption" color="error" display="block">
                    {t(
                      "complete_profile_page.data_protection_required",
                      "You must accept the Data Protection Policy to continue."
                    )}
                  </SoftTypography>
                ) : null}
              </SoftBox>
            </>
          ) : null}
          <InputBox
            label={t("complete_profile_page.profile_label")}
            defaultValue={profile}
            error={validationErrors.profile}
            onInputChange={(value) => {
              setProfile(value);
              setValidationErrors({ ...validationErrors, profile: false });
              if (value == "") setValidationErrors({ ...validationErrors, profile: true });
            }}
          />
          <Select
            label={t("complete_profile_page.gender_label")}
            options={genderOptions}
            defaultValue={gender}
            error={validationErrors.gender}
            onChange={(value) => {
              setGender(value);
              setValidationErrors({ ...validationErrors, gender: false });
              if (value == null) setValidationErrors({ ...validationErrors, gender: true });
            }}
          />
          <Select
            label={t("complete_profile_page.university_label")}
            options={universityOptions}
            defaultValue={university}
            error={validationErrors.university}
            onChange={(value) => {
              setUniversity(value);
              setValidationErrors({ ...validationErrors, university: false });
              if (value == null) setValidationErrors({ ...validationErrors, university: true });
            }}
          />
          {university.id == 64 ? (
            <Input
              label={t("complete_profile_page.university_suggest_label")}
              defaultValue={uniSuggestion}
              type="text"
              error={validationErrors.uniSuggest}
              onInputChange={(value) => {
                setUniSuggestion(value);
                setValidationErrors({ ...validationErrors, uniSuggest: false });
                if (value == "") setValidationErrors({ ...validationErrors, uniSuggest: true });
              }}
            />
          ) : null}
          <Select
            label={t("complete_profile_page.degree_label")}
            options={degreeOptions}
            defaultValue={degree}
            error={validationErrors.degree}
            onChange={(value) => {
              setDegree(value);
              setValidationErrors({ ...validationErrors, degree: false });
              if (value == null) setValidationErrors({ ...validationErrors, degree: true });
            }}
          />
          <Select
            label={t("complete_profile_page.percentage_label")}
            options={percentageOptions}
            defaultValue={percentage}
            error={validationErrors.percentage}
            onChange={(value) => {
              setPercentage(value);
              setValidationErrors({ ...validationErrors, percentage: false });
              if (value == null) setValidationErrors({ ...validationErrors, percentage: true });
            }}
          />
          <Select
            label={t("complete_profile_page.course_label")}
            options={courseOptions}
            defaultValue={course}
            error={validationErrors.course}
            onChange={(value) => {
              setCourse(value);
              setValidationErrors({ ...validationErrors, course: false });
              if (value == null) setValidationErrors({ ...validationErrors, course: true });
            }}
          />
          <Select
            label={t("complete_profile_page.country_label")}
            options={countryOptions}
            defaultValue={country}
            error={validationErrors.country}
            onChange={(value) => {
              setCountry(value);
              setValidationErrors({ ...validationErrors, country: false });
              if (value == null) setValidationErrors({ ...validationErrors, country: true });
            }}
          />
          <SoftTypography
            mt={4}
            variant="h6"
            fontWeight="bold"
            color="info"
            textTransform="capitalize"
          >
            {t("complete_profile_page.additional_info")} &nbsp;
          </SoftTypography>
          <Divider />
          <Select
            label={t("complete_profile_page.work_label")}
            options={workOptions}
            defaultValue={work}
            error={validationErrors.work}
            onChange={(value) => {
              setWork(value);
              setValidationErrors({ ...validationErrors, work: false });
              if (value == null) setValidationErrors({ ...validationErrors, work: true });
            }}
          />
          <Select
            label={t("complete_profile_page.learning_label")}
            options={learningOptions}
            defaultValue={learning}
            error={validationErrors.learning}
            onChange={(value) => {
              setLearning(value);
              setValidationErrors({ ...validationErrors, learning: false });
              if (value == null) setValidationErrors({ ...validationErrors, learning: true });
            }}
          />
          <Select
            label={t("complete_profile_page.hobbies_label")}
            options={hobbiesOptions}
            defaultValue={hobby}
            error={validationErrors.hobby}
            onChange={(value) => {
              setHobby(value);
              setValidationErrors({ ...validationErrors, hobby: false });
              if (value == null) setValidationErrors({ ...validationErrors, hobby: true });
            }}
          />
          <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
            <SoftTypography variant="button" fontWeight="bold">
              {t("complete_profile_page.math_scale")}
            </SoftTypography>
            <Slider
              defaultValue={level}
              step={1}
              onChange={(e) => setLevel(e.target.value)}
              marks={marks}
              min={1}
              max={5}
            />
          </SoftBox>
          <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
            <Grid item xs={12} lg={2} sx={{ ml: "auto" }}>
              <SoftButton variant="gradient" color="info" fullWidth onClick={editProfile}>
                {t("complete_profile_page.save")}
              </SoftButton>
            </Grid>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default Edit;
