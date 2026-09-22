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
import { useNavigate } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { MuiFileInput } from "mui-file-input";
import { useApi } from "api";
import Input from "../Input";
import InputBox from "../InputBox";
import Select from "../Select";
import UseNumberInput from "../InputNumber";
import OrcidInput from "../OrcidInput";
import ScopusIdInput from "../ScopusIdInput";
import SoftButton from "components/SoftButton";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function Edit() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [scopus, setScopus] = useState("");
  const [orcid, setOrcid] = useState("");
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState();
  const [country, setCountry] = useState();
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [work, setWork] = useState("");
  const [learning, setLearning] = useState();
  const [profile, setProfile] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [teaching, setTeaching] = useState("");
  const [studentWork, setStudentWork] = useState("");
  const [teachingTopics, setTeachingTopics] = useState([]);
  const [revisorTopics, setRevisorTopics] = useState([]);
  const [uniSuggestion, setUniSuggestion] = useState("");
  const [uniOptions, setUniOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [learningOptions, setLearningOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [workOptions, setWorkOptions] = useState([]);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const [positionsOptions, setPositionsOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [someErrors, setSomeErros] = useState(false);
  const api = useApi();
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    degree: false,
    university: false,
    uniSuggest: false,
    country: false,
    gender: false,
    birthday: false,
    work: false,
    learning: false,
    profile: false,
    position: false,
    experience: false,
    teaching: false,
    studentWork: false,
    checkedKey: false,
    proof: false,
    teachingTopics: false,
    revisorTopics: false,
  });

  const validateForm = () => {
    const errors = {
      name: name.trim() === "",
      surname: surname.trim() === "",
      degree: degree === "",
      university: university === "",
      uniSuggest: university.id == 64 && uniSuggestion.trim() === "",
      country: country === "",
      gender: gender === "",
      birthday: birthday === "",
      work: work === "",
      learning: learning === "",
      profile: profile.trim() === "",
      position: position === "",
      experience: experience === "",
      teaching: teaching === "",
      studentWork: studentWork === "",
      proof: !(
        (scopus && /^\d{10,11}$/.test(scopus)) ||
        (orcid && /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/.test(orcid)) ||
        file !== null
      ),
      teachingTopics: teachingTopics.length < 1,
    };
    setValidationErrors(errors);

    setSomeErros(Object.values(errors).some((error) => error));
    return !Object.values(errors).some((error) => error);
  };

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
          // getTopics(),
          getPositions(),
          getExperience(),
          userData(),
          fetchFile(),
        ]);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  async function getPositions() {
    try {
      const data = await api.get("position/getAll");
      setPositionsOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getExperience() {
    try {
      const data = await api.get("experience/getAll");
      setExperienceOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchFile() {
    try {
      const data = await api.get("user/getTeacherAbility");
      const fileName = "teachingAbility.pdf";
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const file = new File([url], fileName, { type: "application/octet-stream" });
      setFile(file);
    } catch (error) {
      setFile(null);
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
      const data = await api.get("degree/getTeacherDegree");
      setDegreeOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getTopics(topicIds) {
    try {
      const data = await api.get("topic/getAll");
      const keys = data.data.elements;
      const newKeys = keys.map((item) => ({
        ...item,
        checked: topicIds.includes(item.id),
      }));
      setTopicOptions(newKeys);
      setTeachingTopics(topicIds);
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
      setSurname(user[0].surname);
      setDegree(user[0].platform__degree);
      setUniversity(user[0].platform__university.name);
      setCountry(user[0].platform__university.country);
      setGender(user[0].user_gender);
      setBirthday(user[0].birth_year);
      setUniversity(user[0].platform__university);
      setLearning(user[0].learning_style);
      setCountry(user[0].country);
      setProfile(user[0].profile);
      setOrcid(user[0].orcid);
      setScopus(user[0].scopus);
      setWork(user[0].work_preference);
      setPosition(user[0].teacher_position);
      setExperience(user[0].teacher_experience);
      setStudentWork(user[0].studentwork_preference);
      setTeaching(user[0].teaching_style);
      getTopics(user[0].topicIds);
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

      if (newFile != null) {
        const newFile = await uploadFile(file);
      }
      const data = await api.post("user/update", postData);
      window.location.href = "/profile";
    } catch (error) {
      // Handle error
    }
  }

  const editProfile = () => {
    if (validateForm()) {
      const isSameFile = newFile == null ? true : false;
      const postData = {
        name: name,
        surname: surname,
        profile: profile,
        birth_year: birthday,
        gender: gender.id,
        university: university.id,
        uni_degree: degree.id,
        study_country: country.id,
        work: work.id,
        student_work: studentWork.id,
        learning: learning.id,
        teaching: teaching.id,
        orcid: orcid,
        scopus: scopus,
        position: position.id,
        years_of_experience: experience.id,
        teachingTopics: teachingTopics,
        revisorTopics: revisorTopics,
        isSameFile: isSameFile,
      };
      updateData(postData);
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  const handleChangeFile = (newFile) => {
    setNewFile(newFile);
    setFile(newFile);
  };

  const uploadFile = async (renamedFile) => {
    const formData = new FormData();
    formData.append("file", renamedFile);
    try {
      const data = await api.post("user/uploadFile", formData);
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  const handleChangeTeachingTopics = (e, id) => {
    const myKeys = [...topicOptions];
    const { checked } = e.target;

    myKeys.map((user) => {
      if (user.id === id) {
        user.checked = checked;
        handleChangeKey(user.id);
      }
      return user;
    });
    setTopicOptions([...myKeys]);
  };

  const handleChangeKey = (key) => {
    if (teachingTopics.includes(key)) {
      const index = teachingTopics.indexOf(key);
      teachingTopics.splice(index, 1);
    } else teachingTopics.push(key);
    if (teachingTopics.length < 1)
      setValidationErrors({ ...validationErrors, teachingTopics: true });
    else setValidationErrors({ ...validationErrors, teachingTopics: false });
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
      <SoftBox p={2}>
        <SoftTypography variant="h6" fontWeight="bold" color="info" textTransform="capitalize">
          Personal Data &nbsp;
        </SoftTypography>
        <Divider />
        <SoftBox>
          <Input label="Email:" defaultValue={email} type="text" disabled={true} />
          <Input
            label="Name:"
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
            label="Surname:"
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
            label="Birth year:"
            defaultValue={birthday}
            error={validationErrors.birthday}
            onInputChange={(value) => {
              setBirthday(value);
              setValidationErrors({ ...validationErrors, birthday: false });
              if (value == null) setValidationErrors({ ...validationErrors, birthday: true });
            }}
          />
          <InputBox
            label="Profile:"
            defaultValue={profile}
            error={validationErrors.profile}
            onInputChange={(value) => {
              setProfile(value);
              setValidationErrors({ ...validationErrors, profile: false });
              if (value == "") setValidationErrors({ ...validationErrors, profile: true });
            }}
          />
          <Select
            label="Gender:"
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
            label="Indicate the country where you are teaching:"
            options={countryOptions}
            defaultValue={country}
            error={validationErrors.country}
            onChange={(value) => {
              setCountry(value);
              setValidationErrors({ ...validationErrors, country: false });
              if (value == null) setValidationErrors({ ...validationErrors, country: true });
            }}
          />

          <SoftTypography mt={4} variant="h6" fontWeight="bold" color="info">
            Teaching information &nbsp;
          </SoftTypography>
          <Divider />
          <Select
            label="University:"
            options={uniOptions}
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
              label="Please, suggest your university:"
              defaultValue={uniSuggestion}
              type="text"
              onInputChange={(value) => setUniSuggestion(value)}
            />
          ) : null}
          <Select
            label="Indicate your highest degree:"
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
            label="Indicate your position at your institution:"
            options={positionsOptions}
            defaultValue={position}
            error={validationErrors.position}
            onChange={(value) => {
              setPosition(value);
              setValidationErrors({ ...validationErrors, position: false });
              if (value == null) setValidationErrors({ ...validationErrors, position: true });
            }}
          />
          <Select
            label="Indicate how many years of experience do you have in your position:"
            options={experienceOptions}
            defaultValue={experience}
            error={validationErrors.experience}
            onChange={(value) => {
              setExperience(value);
              setValidationErrors({ ...validationErrors, experience: false });
              if (value == null) setValidationErrors({ ...validationErrors, experience: true });
            }}
          />

          <SoftBox py={1} pr={2} pl={2} mt={2} sx={{ display: "flex", flexDirection: "column" }}>
            <SoftTypography
              color={validationErrors.teachingTopics ? "error" : "dark"}
              variant="button"
              fontWeight="bold"
            >
              Selected the subject that you teach: &nbsp;
            </SoftTypography>
            <SoftTypography
              variant="button"
              fontWeight="light"
              color={validationErrors.teachingTopics ? "error" : "dark"}
            >
              Please select at least 1 topic: &nbsp;
            </SoftTypography>
            <Container style={{ width: "100%", marginBottom: 5 }}>
              <Row>
                <Col>
                  <Form>
                    {topicOptions.slice(0, Math.ceil(topicOptions.length / 2)).map((user) => (
                      <Row key={user.id}>
                        <Col style={{ width: "50%" }}>
                          <Form.Check
                            type="checkbox"
                            checked={user.checked}
                            value="child"
                            style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                            label={user.label}
                            onChange={(e) => handleChangeTeachingTopics(e, user.id)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </Form>
                </Col>

                <Col style={{ width: "50%" }}>
                  <Form>
                    {topicOptions.slice(Math.ceil(topicOptions.length / 2)).map((user) => (
                      <Row key={user.id}>
                        <Col>
                          <Form.Check
                            type="checkbox"
                            checked={user.checked}
                            style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                            value="child"
                            label={user.label}
                            onChange={(e) => handleChangeTeachingTopics(e, user.id)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </Form>
                </Col>
              </Row>
            </Container>
          </SoftBox>

          <SoftBox
            border={1}
            borderRadius="lg"
            color={validationErrors.proof ? "error" : "info"}
            p={2}
            mt={2}
          >
            <SoftTypography
              variant="button"
              color={validationErrors.proof ? "error" : "info"}
              fontWeight="bold"
              mb={1}
            >
              Provide at least one of the options:
            </SoftTypography>

            <OrcidInput
              defaultValue={orcid}
              onInputChange={(value) => {
                setOrcid(value);
                if (value == "" && file == null && scopus.trim() === "")
                  setValidationErrors({ ...validationErrors, proof: true });
                else setValidationErrors({ ...validationErrors, proof: false });
              }}
            />

            <ScopusIdInput
              defaultValue={scopus}
              onInputChange={(value) => {
                setScopus(value);
                if (value == "" && file == null && orcid.trim() === "")
                  setValidationErrors({ ...validationErrors, proof: true });
                else setValidationErrors({ ...validationErrors, proof: false });
              }}
            />

            <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
              <SoftTypography variant="button" fontWeight="bold">
                Submit a document certifying that you are in the teaching career
              </SoftTypography>
              <MuiFileInput
                value={file}
                sx={{ mb: 2, width: "100%", borderRadius: 2 }}
                onChange={(e) => {
                  handleChangeFile(e);
                  if (e == null && scopus.trim() === "" && orcid.trim() === "")
                    setValidationErrors({ ...validationErrors, proof: true });
                  else setValidationErrors({ ...validationErrors, proof: false });
                }}
              />
            </SoftBox>
          </SoftBox>

          <SoftTypography mt={4} variant="h6" fontWeight="bold" color="info">
            Additional information &nbsp;
          </SoftTypography>
          <Divider />
          <Select
            label="Do you prefer your students work individually or in teamwork?"
            options={workOptions}
            defaultValue={studentWork}
            error={validationErrors.studentWork}
            onChange={(value) => {
              setStudentWork(value);
              setValidationErrors({ ...validationErrors, studentWork: false });
              if (value == null) setValidationErrors({ ...validationErrors, studentWork: true });
            }}
          />
          <Select
            label="Do you prefer to work, as a researcher or teacher, individually or in teamwork?"
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
            label="What is your predominant learning style?"
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
            label="What is your predominant teaching style?"
            options={learningOptions}
            defaultValue={teaching}
            error={validationErrors.teaching}
            onChange={(value) => {
              setTeaching(value);
              setValidationErrors({ ...validationErrors, teaching: false });
              if (value == null) setValidationErrors({ ...validationErrors, teaching: true });
            }}
          />
        </SoftBox>
        <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
          <Grid item xs={12} lg={2} sx={{ ml: "auto" }}>
            <SoftButton variant="gradient" color="info" fullWidth onClick={editProfile}>
              Save
            </SoftButton>
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default Edit;
