import React, { useState, useEffect } from "react";
import Table from "examples/Tables/Table";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Card, Grid, Stack, Pagination } from "@mui/material";
import { useApi } from "api";
import SoftBox from "components/SoftBox";
import usersTableData from "./data/usersTableData";
import keywordsTableData from "./data/keywordsTableData";
import materialsTableData from "./data/materialsTableData";
import assessmentTableData from "./data/assessmentTableData";
import videosTableData from "./data/videosTableData";
import questionTableData from "./data/questionTableData";
import validationTableData from "./data/validationTableData";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import Link from "@mui/material/Link";
import styled from "styled-components";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Spinner } from "react-bootstrap";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const CardBody = styled(Card)`
  dispay: flex;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  border-radius: 100%;
  margin: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: scale(1.1);
  }
`;

function Main() {
  const [rows, setRows] = useState([]);
  const [option, setOption] = useState(null);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [roles, setRoles] = useState(null);
  const [typeColumn, setTypeColumn] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [dataKeyword, setDataKeyword] = useState([]);
  const [dataVideos, setDataVideos] = useState([]);
  const [dataMaterials, setDataMaterials] = useState([]);
  const [dataQuestion, setDataQuestion] = useState([]);
  const [validationInfo, setValidationInfo] = useState([]);
  const [dataAssessments, setDataAssessments] = useState([]);
  const [fileName, setFileName] = useState();
  const [hasSelection, setHasSelection] = useState(false);
  const api = useApi();
  const { userColumns } = usersTableData;
  const { keywordColumns } = keywordsTableData;
  const { materialColumns } = materialsTableData;
  const { videoColumns } = videosTableData;
  const { assessmentColumns } = assessmentTableData;
  const { questionColumns } = questionTableData;
  const { validationColumns } = validationTableData;
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const dataPerPage = 10;
  const indexOfLastUser = page * dataPerPage;
  const indexOfFirstUser = indexOfLastUser - dataPerPage;
  const currentUser = rows.slice(indexOfFirstUser, indexOfLastUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRowsUser();
  }, [dataUser]);

  useEffect(() => {
    handleRowsKeywords();
  }, [dataKeyword]);

  useEffect(() => {
    handleRowsVideos();
  }, [dataVideos]);

  useEffect(() => {
    handleRowsMaterials();
  }, [dataMaterials]);

  useEffect(() => {
    handleRowsAssessment();
  }, [dataAssessments]);

  useEffect(() => {
    handleRowsQuestions();
  }, [dataQuestion]);

  useEffect(() => {
    handleRowsValidation();
  }, [validationInfo]);

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "60%",
    justifyContent: "center",
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    p: 4,
    borderRadius: 6,
  };

  async function filterAssessmentInformation(postData) {
    try {
      const data = await api.post("questionAssessment/assessmentsInformation", postData);
      setDataAssessments(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function filterUserInformation(postData) {
    try {
      const data = await api.post("user/userInformation", postData);
      setDataUser(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function filterKeywordsInformation(postData) {
    try {
      const data = await api.post("keyword/keywordsInformation", postData);
      setDataKeyword(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function filterQuestionsInformation(postData) {
    try {
      const data = await api.post("question/questionsInformation", postData);
      setDataQuestion(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function filterValidationInformation(postData) {
    try {
      const data = await api.post("question/validationInformation", postData);
      setValidationInfo(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function filterVideosInformation(postData) {
    try {
      const data = await api.post("material/videosInformation", postData);
      setDataVideos(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function filterMaterialsInformation(postData) {
    try {
      const data = await api.post("material/materialsInformation", postData);
      setDataMaterials(data.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleRowsAssessment = () => {
    const transformedRows = dataAssessments.map((key, index) => ({
      User: (
        <SoftTypography style={{ fontWeight: "bold", fontSize: 15 }}>
          {key.student_id}
        </SoftTypography>
      ),
      Question: key.question_id,
      Topic: key.Topic,
      Typology: key.Typology,
      Subtopic: key.Subtopic,
      Answer: key.answer,
      Date: key.date,
      Duration: key.duration,
      Selected: key.option_selected,
      Algorithm_Level: key.Algorithm_level,
      Lecturer_Level: key.Lecturer_level,
    }));
    setRows(transformedRows);
  };

  const handleRowsUser = () => {
    const transformedRows = dataUser.map((key, index) => ({
      ID: key.id,
      Name: key.name + " " + key.surname,
      Email: key.email,
      Role: key.role,
      Course: key.course,
      Degree: key.degree,
      Experience: key.teacher_experience,
      Position: key.teacher_position,
      Teacher_Work: key.work_preference,
      Teaching: key.teaching_style,
      Percentage: key.percentage_degree,
      Gender: key.user_gender,
      Country: key.country,
      University: key.university,
      Hobbies: key.hobby,
      Learning: key.learning_style,
      Work: key.work_preference,
    }));
    setRows(transformedRows);
  };

  const handleRowsKeywords = () => {
    const transformedRows = dataKeyword.map((key, index) => ({
      ID: key.id,
      Name: (
        <SoftTypography style={{ fontWeight: "bold", fontSize: 15 }}>{key.keyword}</SoftTypography>
      ),
      Topic: key.Topic,
      Subtopic: key.Subtopic,
      Num_Questions: key.Associated_Questions,
      Num_Materials: key.countTeachingMaterials,
      Num_Videos: key.countVideos,
    }));
    setRows(transformedRows);
  };

  const handleRowsVideos = () => {
    const transformedRows = dataVideos.map((key, index) => ({
      ID: key.id,
      Link: (
        <Link href={key.link} target="_blank">
          <SoftTypography style={{ fontWeight: "bold", fontSize: 13 }}>Link</SoftTypography>
        </Link>
      ),
      Topic: key.Topic,
      Subtopic: key.Subtopic,
      Author: key.Author,
      Validator: key.Validator,
      Clicks: key.clicks,
    }));
    setRows(transformedRows);
  };

  const handleRowsMaterials = () => {
    const transformedRows = dataMaterials.map((key, index) => ({
      ID: key.id,
      File: (
        <SoftTypography style={{ fontWeight: "bold", fontSize: 15 }}>
          {key.file_name}
        </SoftTypography>
      ),
      Topic: key.Topic,
      Subtopic: key.Subtopic,
      Author: key.Author,
      Validator: key.Validator,
      Clicks: key.clicks,
    }));
    setRows(transformedRows);
  };

  const handleRowsQuestions = () => {
    const transformedRows = dataQuestion.map((key, index) => ({
      ID: key.id,
      Question: (
        <SoftBox style={{ width: "30%" }}>
          <Latex>{key.question}</Latex>
        </SoftBox>
      ),
      // Correct: key.Correct,
      // Incorrect1: key.Incorrect1,
      // Incorrect2: key.Incorrect2,
      // Incorrect3: key.Incorrect3,
      Topic: key.Topic,
      Subtopic: key.Subtopic,
      Algorithm_Level: key.algorithmLevel,
      Lecturer_Level: key.LecturerLevel,
      Validated: key.validate,
      Author: key.Author,
      Validator: key.Validator,
      Num_Materials: key.countMaterials,
      Num_Videos: key.countVideos,
    }));
    setRows(transformedRows);
  };

  const handleRowsValidation = () => {
    const transformedRows = validationInfo.map((key, index) => ({
      ID: key.id,
      Topic: key.Topic,
      Subtopic: key.Subtopic,
      Author: key.Author,
      Validator: key.Validator,
      Validated: key.validate,
      Question: (
        <SoftBox style={{ width: "30%" }}>
          <Latex>{key.question}</Latex>
        </SoftBox>
      ),
    }));
    setRows(transformedRows);
  };

  const handleFilter = (topic, subtopic, option, roles, year) => {
    setPageInput(null);
    setPage(1);
    setLoading(true);
    setHasSelection(true);
    setOption(option);
    setTopic(topic);
    setSubtopic(subtopic);
    setRoles(roles);

    const postData = {
      topic: topic,
      subtopic: subtopic,
    };

    const postDataUsers = {
      role: roles,
    };

    const postDataAssessment = {
      role: roles,
      topic: topic,
      subtopic: subtopic,
      date: year !== "" ? year : null,
    };

    switch (option) {
      case 1:
        filterKeywordsInformation(postData);
        setTypeColumn(keywordColumns);
        setFileName("Keyword_Information");
        break;
      case 2:
        filterMaterialsInformation(postData);
        setTypeColumn(materialColumns);
        setFileName("Teaching_Material_Information");
        break;
      case 3:
        filterQuestionsInformation(postData);
        setTypeColumn(questionColumns);
        setFileName("Questions_Information");
        break;
      case 4:
        filterAssessmentInformation(postDataAssessment);
        setTypeColumn(assessmentColumns);
        setFileName("Assessment_Information");
        break;
      case 5:
        filterUserInformation(postDataUsers);
        setTypeColumn(userColumns);
        setFileName("User_Information");
        break;
      case 6:
        filterVideosInformation(postData);
        setTypeColumn(videoColumns);
        setFileName("Videos_Information");
        break;
      case 7:
        filterValidationInformation(postData);
        setTypeColumn(validationColumns);
        setFileName("Questions_Information");
        break;
      default:
        break;
    }
  };

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (
      !isNaN(pageNumber) &&
      pageNumber > 0 &&
      pageNumber <= Math.ceil(rows.length / dataPerPage)
    ) {
      setPage(pageNumber);
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } else {
      console.error("Invalid page number");
    }
  };

  const exportToExcel = () => {
    var data;
    if (option == 1) data = dataKeyword;
    else if (option == 2) data = dataMaterials;
    else if (option == 3) data = dataQuestion;
    else if (option == 4) data = dataAssessments;
    else if (option == 5) data = dataUser;
    else if (option == 6) data = dataVideos;
    else data = validationInfo;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Grid alignItems="center" p={5} sx={{ "@media (max-width: 600px)": { p: 2 } }}>
        <SoftTypography variant="h6" fontWeight="light">
          Please select a option
        </SoftTypography>
        <SearchBar onFilter={handleFilter} />
        {loading ? (
          <SoftBox
            sx={{
              display: "flex",
              height: "500px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </SoftBox>
        ) : hasSelection && currentUser.length === 0 ? (
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <SoftTypography color="info" textGradient fontWeight="bold">
              No data recorded
            </SoftTypography>
          </SoftBox>
        ) : (
          currentUser.length > 0 && (
            <>
              <SoftBox
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <CardBody>
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    color="green"
                    size="lg"
                    onClick={() => exportToExcel()}
                  />
                </CardBody>
              </SoftBox>

              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                        `${borderWidth[1]} solid ${borderColor}`,
                    },
                  },
                }}
              >
                <Table columns={typeColumn} rows={currentUser} />
              </SoftBox>

              <Stack mt={2} spacing={3} mb={2} alignItems="center">
                <Pagination
                  color="info"
                  variant="outlined"
                  count={Math.ceil(rows.length / dataPerPage)}
                  page={page}
                  onChange={handlePagination}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <SoftInput
                    placeholder="Go to Page"
                    variant="outlined"
                    value={pageInput}
                    onChange={handlePageInputChange}
                  />
                  <SoftButton color="dark" onClick={handleGoToPage}>
                    Go
                  </SoftButton>
                </Stack>
              </Stack>
            </>
          )
        )}
      </Grid>
    </Card>
  );
}

export default Main;
