import { useMemo, useRef, useState } from "react";
import Table from "examples/Tables/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "api";
import { useTranslation } from "react-i18next";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { COLORS } from "components/olympiads/colors";
import OlympicPageCard from "components/olympiads/OlympicPageCard";
import OlympicPagination from "components/olympiads/OlympicPagination";
import OlympicEmptyState from "components/olympiads/OlympicEmptyState";
import OlympicButton from "components/olympiads/OlympicButton";
import Loader from "components/olympiads/Loader";
import usersTableData from "./data/usersTableData";
import keywordsTableData from "./data/keywordsTableData";
import assessmentTableData from "./data/assessmentTableData";
import questionTableData from "./data/questionTableData";
import validationTableData from "./data/validationTableData";
import olympiadsTableData from "./data/olympiadsTableData";
import challengesTableData from "./data/challengesTableData";
import reportOptions from "./data/reportOptions";
import SearchBar from "./components/SearchBar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const I18N = "olympic_project_information_page";
const dataPerPage = 10;

// Booleans render as nothing inside a table cell, so flags go through here.
const text = (value) => (value === null || value === undefined ? "" : String(value));

const bold = (value) => (
  <SoftTypography style={{ fontWeight: "bold", fontSize: 15 }}>{text(value)}</SoftTypography>
);

// The table sizes its cells to their content; long texts need a width to wrap in.
const wrapped = (children, width = 220) => (
  <SoftBox sx={{ width, whiteSpace: "normal", textAlign: "left" }}>{children}</SoftBox>
);

const questionCell = (question) => wrapped(<Latex>{question || ""}</Latex>, 320);

// One entry per report: where the data comes from, how it is shown and the
// name of the exported file. `toRow` is keyed by the column names.
const REPORTS = {
  1: {
    endpoint: "olympicQuestion/keywordsInformation",
    columns: keywordsTableData.keywordColumns,
    fileName: "Olympic_Keywords_Information",
    toRow: (key) => ({
      ID: key.id,
      Keyword: bold(key.keyword),
      Name_PT: key.name_pt,
      Name_EN: key.name_en,
      Num_Questions: key.Associated_Questions,
      Num_Validated: key.Validated_Questions,
    }),
  },
  2: {
    endpoint: "olympicQuestion/questionsInformation",
    columns: questionTableData.questionColumns,
    fileName: "Olympic_Questions_Information",
    toRow: (key) => ({
      ID: key.id,
      Olympiad: key.Olympiad,
      Level: key.Level,
      Phase: key.Phase,
      Year: key.Year,
      Difficulty: key.Difficulty,
      Validated: text(key.validate),
      Active: text(key.active),
      Date: key.date,
      Author: key.Author,
      Validator: key.Validator,
      Keywords: wrapped(key.Keywords),
      Num_Alternatives: key.countAlternatives,
      Num_Answers: key.countAnswers,
      Question: questionCell(key.question),
    }),
  },
  3: {
    endpoint: "olympicQuestion/validationInformation",
    columns: validationTableData.validationColumns,
    fileName: "Olympic_Validation_Information",
    toRow: (key) => ({
      ID: key.id,
      Olympiad: key.Olympiad,
      Level: key.Level,
      Phase: key.Phase,
      Year: key.Year,
      Author: key.Author,
      Validator: key.Validator,
      Validated: text(key.validate),
      Validation_Date: key.validate_date,
      Question: questionCell(key.question),
    }),
  },
  4: {
    endpoint: "olympicAssessment/assessmentsInformation",
    columns: assessmentTableData.assessmentColumns,
    fileName: "Olympic_Assessment_Information",
    toRow: (key) => ({
      Source: key.Source,
      Challenge: key.Challenge,
      User: bold(key.student_id),
      Typology: key.Typology,
      Question_ID: key.question_id,
      Olympiad: key.Olympiad,
      Level: key.Level,
      Phase: key.Phase,
      Year: key.Year,
      Selected: text(key.option_selected),
      Answer: text(key.answer),
      Date: key.date,
      Duration: key.duration,
    }),
  },
  5: {
    endpoint: "olympic/usersInformation",
    columns: usersTableData.userColumns,
    fileName: "Olympic_User_Information",
    toRow: (key) => ({
      ID: key.id,
      Name: [key.name, key.surname].filter(Boolean).join(" "),
      Email: key.email,
      Role: key.role,
      Course: key.course,
      Degree: key.degree,
      Experience: key.teacher_experience,
      Position: key.teacher_position,
      Teaching: key.teaching_style,
      Percentage: key.percentage_degree,
      Gender: key.user_gender,
      Country: key.country,
      University: key.university,
      Hobbies: key.hobby,
      Learning: key.learning_style,
      Work: key.work_preference,
      Num_Answers: key.countAnswers,
      Num_Questions_Created: key.countQuestionsCreated,
      Num_Questions_Validated: key.countQuestionsValidated,
      Num_Challenges_Created: key.countChallengesCreated,
    }),
  },
  6: {
    endpoint: "olympic/olympicsInformation",
    columns: olympiadsTableData.olympiadColumns,
    fileName: "Olympiads_Information",
    toRow: (key) => ({
      ID: key.id,
      Name: bold(key.name),
      Language: key.language,
      Active: text(key.active),
      Num_Levels: key.countLevels,
      Num_Phases: key.countPhases,
      Num_Years: key.countYears,
      Num_Questions: key.countQuestions,
      Num_Validated: key.countValidated,
      Num_Reviewers: key.countReviewers,
    }),
  },
  7: {
    endpoint: "olympiadsChallenge/challengesInformation",
    columns: challengesTableData.challengeColumns,
    fileName: "Olympic_Challenges_Information",
    toRow: (key) => ({
      ID: key.id,
      Code: bold(key.code),
      Title: wrapped(key.title),
      Localization: key.localization,
      Creator: key.Creator,
      Olympiad: key.Olympiad,
      Level: key.Level,
      Phase: key.Phase,
      Year: key.Year,
      Num_Questions: key.numberOfQuestions,
      Max_Duration: key.maxDuration,
      Status: text(key.status),
      Date: key.date,
      Num_Participants: key.countParticipants,
      Num_Answers: key.countAnswers,
    }),
  },
};

function Main() {
  const { t } = useTranslation();
  const [option, setOption] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const lastRequest = useRef(0);
  const api = useApi();
  const report = option ? REPORTS[option] : null;

  // The table reads a row by the column name it prints, so both are translated together.
  const columns = useMemo(
    () =>
      report
        ? report.columns.map((column) => ({
            ...column,
            name: t(`${I18N}.columns.${column.name}`, column.name),
          }))
        : [],
    [report, t]
  );

  const rows = useMemo(
    () =>
      report
        ? data.map((element) => {
            const row = report.toRow(element);
            return report.columns.reduce((translated, column, index) => {
              translated[columns[index].name] = row[column.name];
              return translated;
            }, {});
          })
        : [],
    [report, data, columns]
  );

  const pageCount = Math.ceil(rows.length / dataPerPage);
  const indexOfLastRow = page * dataPerPage;
  const currentRows = rows.slice(indexOfLastRow - dataPerPage, indexOfLastRow);

  const handleFilter = async ({ option, olympic, level, phase, year, roles, date, source }) => {
    const selected = reportOptions.find((item) => item.id === option);
    if (!selected) return;

    const postData = {};
    if (selected.olympicFilters) {
      postData.olympic = olympic;
      postData.level = level;
      postData.phase = phase;
      postData.year = year;
    }
    if (selected.roles) postData.role = roles;
    if (selected.performance) {
      postData.date = date !== "" ? date : null;
      postData.source = source;
    }

    // Every filter change fires a request; only the latest answer is kept.
    lastRequest.current += 1;
    const request = lastRequest.current;
    setOption(option);
    setPage(1);
    setData([]);
    setFailed(false);
    setLoading(true);

    try {
      const response = await api.post(REPORTS[option].endpoint, postData);
      if (request !== lastRequest.current) return;
      setData(response.data.elements || []);
    } catch (error) {
      if (request !== lastRequest.current) return;
      console.error("Error fetching data:", error);
      setFailed(true);
    }
    setLoading(false);
  };

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${report.fileName}.xlsx`);
  };

  return (
    <OlympicPageCard mobilePadding={2}>
      <SoftTypography variant="h6" fontWeight="light">
        {t(`${I18N}.select_option`, "Please select an option")}
      </SoftTypography>
      <SearchBar onFilter={handleFilter} />
      {loading ? (
        <Loader message={t(`${I18N}.loading`, "Loading data...")} />
      ) : failed ? (
        <OlympicEmptyState
          message={t(`${I18N}.error`, "Could not load the data. Please try again.")}
        />
      ) : report && rows.length === 0 ? (
        <OlympicEmptyState message={t(`${I18N}.no_data`, "No data recorded")} />
      ) : (
        rows.length > 0 && (
          <>
            <SoftBox display="flex" justifyContent="flex-end" mb={2}>
              <OlympicButton onClick={exportToExcel}>
                <FontAwesomeIcon icon={faFileExcel} color={COLORS.white} size="lg" />
                &nbsp;&nbsp;{t(`${I18N}.export_excel`, "Export to Excel")}
              </OlympicButton>
            </SoftBox>

            <SoftBox
              sx={{
                width: "100%",
                overflowX: "auto",
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={currentRows} />
            </SoftBox>

            <OlympicPagination
              key={option}
              count={pageCount}
              page={page}
              onChange={handlePagination}
              goTo
              goToLabel={t(`${I18N}.go_to_page`, "Go to Page")}
            />
          </>
        )
      )}
    </OlympicPageCard>
  );
}

export default Main;
