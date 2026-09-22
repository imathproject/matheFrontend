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
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

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
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function Edit() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState();
  const [country, setCountry] = useState();
  const [gender, setGender] = useState("Women");
  const [birthday, setBirthday] = useState("");
  const [work, setWork] = useState("");
  const [learning, setLearning] = useState();
  const [hobby, setHobby] = useState();
  const [profile, setProfile] = useState("");
  const [level, setLevel] = useState();
  const [percentage, setPercentage] = useState();
  const [course, setCourse] = useState();
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
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    profile: false,
    birthday: false,
    gender: false,
    university: false,
    degree: false,
    country: false,
    work: false,
    learning: false,
    hobby: false,
    level: false,
    percentage: false,
    course: false,
  });

  const validateForm = () => {
    const errors = {
      name: name.trim() === "",
      surname: surname.trim() === "",
      profile: profile.trim() === "",
      birthday: birthday === "",
      gender: gender === "",
      university: university === "",
      degree: degree === "",
      country: country === "",
      work: work === "",
      learning: learning === "",
      hobby: hobby === "",
      level: level === null,
      percentage: percentage === "",
      course: course === "",
    };

    setValidationErrors(errors);
    setSomeErros(Object.values(errors).some((error) => error));
    return !Object.values(errors).some((error) => error);
  };

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
      universities.unshift({ label: "Other", id: 64 });
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
      setEmail(user[0].email);
      setProfile(user[0].profile);
      setSurname(user[0].surname);
      setDegree(user[0].platform__degree);
      setUniversity(user[0].platform__university.name);
      setCountry(user[0].platform__university.country);
      setGender(user[0].user_gender);
      setBirthday(user[0].birth_year);
      setUniversity(user[0].platform__university);
      setHobby(user[0].hobby);
      setLearning(user[0].learning_style);
      setLevel(user[0].enjoy_math);
      setCountry(user[0].country);
      setWork(user[0].work_preference);
      setCourse(user[0].platform__course);
      setPercentage(user[0].platform__percentage_degree);
    } catch (error) {
      // Handle error
    }
  }

  async function updateData(postData) {
    try {
      const data = await api.post("user/update", postData);
      window.location.href = "/profile";
    } catch (error) {
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
      updateData(postData);
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  if (loading) {
    return <div>{t("profile_page.loading")}</div>;
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
            {t("profile_page.missing_fields")}
          </SoftTypography>
        </SoftBox>
      ) : null}
      <SoftBox p={2}>
        <SoftTypography variant="h6" fontWeight="bold" color="info" textTransform="capitalize">
          {t("profile_page.personal_data")} &nbsp;
        </SoftTypography>
        <Divider />
        <SoftBox>
          <Input label={t("profile_page.email")} defaultValue={email} type="text" disabled={true} />
          <Input
            label={t("profile_page.name_label")}
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
            label={t("profile_page.surname_label")}
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
            label={t("profile_page.birth_year_label")}
            defaultValue={birthday}
            onInputChange={(value) => setBirthday(value)}
          />
          <InputBox
            label={t("profile_page.profile_label")}
            defaultValue={profile}
            error={validationErrors.profile}
            onInputChange={(value) => {
              setProfile(value);
              setValidationErrors({ ...validationErrors, profile: false });
              if (value == "") setValidationErrors({ ...validationErrors, profile: true });
            }}
          />
          <Select
            label={t("profile_page.gender_label")}
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
            label={t("profile_page.university_label")}
            options={uniOptions}
            defaultValue={university}
            error={validationErrors.university}
            onChange={(value) => {
              setUniversity(value);
              setValidationErrors({ ...validationErrors, university: false });
              if (value == null) setValidationErrors({ ...validationErrors, university: true });
            }}
          />
          <Select
            label={t("profile_page.degree_label")}
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
            label={t("profile_page.percentage_label")}
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
            label={t("profile_page.course_label")}
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
            label={t("profile_page.country_label")}
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
            {t("profile_page.additional_info")} &nbsp;
          </SoftTypography>
          <Divider />
          <Select
            label={t("profile_page.work_label")}
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
            label={t("profile_page.learning_label")}
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
            label={t("profile_page.hobbies_label")}
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
              {
                t("profile_page.math_scale")
              }
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
                {t("profile_page.save")}
              </SoftButton>
            </Grid>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default Edit;
