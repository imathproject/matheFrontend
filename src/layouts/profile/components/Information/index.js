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
import SoftBox from "components/SoftBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { useApi } from 'api';
import { useAuth } from "authContext";
import { useTranslation } from "react-i18next";

function Information() {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("Women");
  const [birthday, setBirthday] = useState("");
  const [work, setWork] = useState("");
  const [learning, setLearning] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [mathLevel, setMathLevel] = useState();
  const [percentage, setPercentage] = useState();
  const api = useApi();


  useEffect(() => {
    userData()
    }, []);

    async function userData() {
      try {
        const data = await api.get("user/getProfile");

        const user = data.data.elements;

      setUser(data.data.elements);
      setName(user[0].name + " " + user[0].surname);
      setEmail(user[0].email);
      setDegree(user[0].platform__degree.label);
      setUniversity(user[0].platform__university.label);
      setCountry(user[0].country.label);
      setGender(user[0].user_gender.label);
      setBirthday(user[0].birth_year);
      setWork(user[0].work_preference.label);
      setLearning(user[0].learning_style.label);
      setHobbies(user[0].hobby.label);
      setMathLevel(user[0].enjoy_math);
      setPercentage(user[0].platform__percentage_degree.label)


    } catch (error) {
      // Handle error
    }
  }

  if (user.length != 0) {
    return (
      <SoftBox mt={5} mb={3}>
        <Grid>
          <Grid item xs={12} md={6} xl={4} mb={4}>
            <ProfileInfoCard
              title={t("profile_page.info_title")}
              description={user[0].profile}
              info={{
                fullName: name,
                birthYear: birthday,
                gender: gender,
                email: email,
                degree: degree,

              }}
              labelsMap={{
                fullName: t("profile_page.info_fullname"),
                birthYear: t("profile_page.info_birthyear"),
                gender: t("profile_page.info_gender"),
                email: t("profile_page.info_email"),
                degree: t("profile_page.info_degree"),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <ProfileInfoCard
              title={t("profile_page.additional_info")}
              info={{
                university: university,
                degreeCompleted: percentage,
                country: country,
                workPreference: work,
                learningStyle: learning,
                hobbies: hobbies,
                enjoyMath: mathLevel
              }}
              labelsMap={{
                university: t("profile_page.info_university"),
                degreeCompleted: t("profile_page.info_degree_completed"),
                country: t("profile_page.info_country"),
                workPreference: t("profile_page.info_work_preference"),
                learningStyle: t("profile_page.info_learning_style"),
                hobbies: t("profile_page.info_hobbies"),
                enjoyMath: t("profile_info_enjoy_math"),
              }}
            />
          </Grid>

        </Grid>
      </SoftBox>
    )
  };
}

export default Information;
