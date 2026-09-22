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
import Grid from "@mui/material/Grid";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import { getRandomQuestion } from "services/pythonService";
import SoftButton from "components/SoftButton";
import Question from "../Question";
import TestReview from "../TestReview";
import { useAuth } from "authContext";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import ProgressBar from "../ProgressBar";
import SpinnerLoader from "../Loader";
import Dot from "../Confetti";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function Header({ topic, subtopic, onRefresh }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [id, setId] = useState();
  const [topicName, setTopicName] = useState("");
  const [subtopicName, setSubtopicName] = useState("");
  const [level, setLevel] = useState("");
  const [idDB, setIdDB] = useState();
  const [questionsId, setQuestionId] = useState([]);
  const [a, setA] = useState();
  const [answerId, setAnswerId] = useState();
  const [testFinished, setTestFinished] = useState(false);
  const { name, surname, email } = useAuth();
  const [startTime, setStartTime] = useState();
  // Initialize the array to hold id and answer objects
  const [idAnswerArray, setIdAnswerArray] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [arrayQuestions, setArrayQuestions] = useState([]);
  const [personalInfo, setPersonalInfo] = useState([
    name,
    surname,
    "IPB",
    email,
    "-1",
    "-1",
    "-1",
    "-1",
    "-1",
    "-1",
    "-1",
    "-1",
    "-1",
    "1",
    "-1",
    "-1",
    "-1",
    "-1",
  ]);
  const [isReady, setIsReady] = useState(false);
  const [levelFinished, setLevelFinished] = useState(0);
  const [Qid, setQId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [extension, setExtension] = useState(null);
  const [maxLevel, setMaxLevel] = useState(null);
  const api = useApi();
  const { t } = useTranslation();
  useEffect(() => {
    // const newArray = [name, surname, "IPB", email, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "1", "-1", "-1", "-1", "-1"];
    // setPersonalInfo(newArray);
    questionsArrayRequest();
  }, []);

  async function questionsArrayRequest() {
    const postData = {
      topic: topic,
      subtopic: subtopic,
    };
    var link = "question/getArrayBySubtopic";
    var maxLevelLink = "question/getMaxLevelBySubtopic/" + subtopic;
    if (postData.subtopic == null) {
      link = "question/getArrayByTopic";
      maxLevelLink = "question/getMaxLevelByTopic/" + topic;
    }
    try {
      const data = await api.post(link, postData);
      const maxLevel = await api.get(maxLevelLink);

      const results = data.data.elements;
      setMaxLevel(maxLevel.data.elements.maxAlgorithmLevel);
      setArrayQuestions(data.data.elements);
      pythonRequest(0, results, personalInfo);
    } catch (error) {
      // Handle error
    }
  }

  async function pythonRequest(i, arrayQuestions, personalInfo) {
    var newDataArray = [...personalInfo];
    if (i === 0) {
    } else if (i === 1) {
      var a = 1;
      if (answerId != 0) a = 0;
      if (answerId == 4) a = -1;
      newDataArray[8] = id;
      newDataArray[9] = a;
    } else if (i === 2) {
      var a = 1;
      if (answerId != 0) a = 0;
      if (answerId == 4) a = -1;
      newDataArray[10] = id;
      newDataArray[11] = a;
    } else if (i === 3) {
      var a = 1;
      if (answerId != 0) a = 0;
      if (answerId == 4) a = -1;
      newDataArray[12] = id;
      newDataArray[13] = a;
    } else if (i === 4) {
      var a = 1;
      if (answerId != 0) a = 0;
      if (answerId == 4) a = -1;
      newDataArray[14] = id;
      newDataArray[15] = a;
    }
    setPersonalInfo(newDataArray);

    var finalData = { elements: [newDataArray, arrayQuestions[0], arrayQuestions[1]] };

    try {
      const data = await getRandomQuestion(finalData);
      setId(data.id);
      setIdDB(data.id);
      fetchQuestion(data.id);
      if (data.id == -1) {
        setLevelFinished(1);
      }

      setIsReady(true);
      setStartTime(Date.now());
    } catch (error) {
      // Handle error
    }
  }

  function shuffleArray(array) {
    let shuffledArray = array.slice(); // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      // Swap elements at index i and j
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  async function fetchQuestion(id) {
    try {
      const data = await api.get("question/getById/" + id);
      const question = data.data.elements;
      const answerArray = [question.answer1, question.answer2, question.answer3, question.answer4];

      const q = question.question;
      const processedQuestion = q.replace(/\\\[/g, "$").replace(/\\\]/g, "$");
      setQuestion(processedQuestion);
      setQId(question.id);
      setFileName(question.file_name);
      setExtension(question.file_ext);
      setTopicName(question.platform__topic);
      setSubtopicName(question.platform__subtopic);
      setLevel(question.algorithmLevel);

      const arrayWithIndexes = answerArray.map((value, index) => ({ value, originalIndex: index }));
      // Shuffle the array
      const shuffledArray = shuffleArray(arrayWithIndexes);
      shuffledArray.push({ value: "I don't know", originalIndex: 4 });
      setAnswers(shuffledArray);
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } catch (error) {
      // Handle error
    }
  }

  // async function addAssessment() { 
  //   var a1 = parseInt(idAnswerArray[0].idAnswer) + 1;
  //   var a2 = parseInt(idAnswerArray[1].idAnswer) + 1;
  //   var a3 = parseInt(idAnswerArray[2].idAnswer) + 1;
  //   var a4 = parseInt(idAnswerArray[3].idAnswer) + 1;
  //   var a5 = parseInt(idAnswerArray[4].idAnswer) + 1;

  //   if (idAnswerArray[0].idAnswer == 4) a1 = -1;
  //   if (idAnswerArray[1].idAnswer == 4) a2 = -1;
  //   if (idAnswerArray[2].idAnswer == 4) a3 = -1;
  //   if (idAnswerArray[3].idAnswer == 4) a4 = -1;
  //   if (idAnswerArray[4].idAnswer == 4) a5 = -1;
    
  //   const postData = {
  //     topic: 18,
  //     subtopic: 7,
  //     level: 0,
  //     qst01: idAnswerArray[0].id + "|" + a1,
  //     qst02: idAnswerArray[1].id + "|" + a2,
  //     qst03: idAnswerArray[2].id + "|" + a3,
  //     qst04: idAnswerArray[3].id + "|" + a4,
  //     qst05: idAnswerArray[4].id + "|" + a5,
  //     qst06: " ",
  //     qst07: " ",
  //   };

  //   try {
  //     const data = await api.post("assessment/add", postData);
  //     //const questionAssessment = await newQuestionAssessment(assessmentData);
  //   } catch (error) {
  //     // Handle error
  //   }
  // }

  const handleNextQuestion = () => {
    var endTime = (Date.now() - startTime) / 1000;
    const newQuestionIndex = questionIndex + 1;
    setQuestionIndex(newQuestionIndex);
    pythonRequest(newQuestionIndex, arrayQuestions, personalInfo);
    setIsOptionSelected(false);
    addIdAnswer(endTime);
  };

  const handleAnswer = (id, answer) => {
    setA(answer);
    setAnswerId(id);
    setIsOptionSelected(true);
  };

  const handleFinishTest = () => {
    var endTime = (Date.now() - startTime) / 1000;
    setTestFinished(true);
    addIdAnswer(endTime);
  };

  async function addIdAnswer(endTime) {
    idAnswerArray.push({ id: idDB, idAnswer: answerId, answer: a });
    setIdAnswerArray([...idAnswerArray]);

    questionsId.push(idDB);
    setQuestionId([...questionsId]);

    const foundObject = arrayQuestions[0].find((obj) => obj.id === idDB);
    var answer = 1;
    if (answerId != 0) answer = 0;
    if (answerId == 4) answer = -1;

    const assessmentData = {
      topic: topic,
      subtopic: subtopic,
      question_id: idDB,
      question_level: foundObject.level,
      answer: answer,
      duration: endTime,
      option_selected: answerId,
    };

    try {
      const questionAssessment = await api.post("questionAssessment/add", assessmentData);
    } catch (error) {
      // Handle error
    }
  }

  if (levelFinished) {
    return (
      <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", justifyContent: "center" }}>
        <Grid alignItems="center" p={5}>
          <Dot />
        </Grid>
      </Card>
    );
  }

  if (!isReady) {
    return (
      <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", justifyContent: "center" }}>
        <SpinnerLoader />
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Grid
        alignItems="center"
        p={5}
        sx={{
          "@media (max-width: 600px)": {
            p: 0,
          },
        }}
      >
        <SoftBox width="100%" pt={1} pb={2} px={2}>
          <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {testFinished ? (
              <TestReview ids={questionsId} answers={idAnswerArray} />
            ) : (
              question && (
                <>
                  <SoftTypography fontWeight="bold">
                    {t("he_assessment_page.question_level", "Question level")} &nbsp;&nbsp;&nbsp;
                  </SoftTypography>
                  <ProgressBar progress={level} maxLevel={maxLevel} />
                  <Question
                    questionID={Qid}
                    question={question}
                    options={answers}
                    topic={topicName}
                    subtopic={subtopicName}
                    level={level}
                    onClickAnswer={handleAnswer}
                    image={fileName}
                    extension={extension}
                  />
                  <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
                    {questionIndex < 4 ? (
                      <SoftButton
                        color="primary"
                        disabled={!isOptionSelected}
                        onClick={handleNextQuestion}
                      >
                        {t("he_assessment_page.next_question", "Next question")}
                      </SoftButton>
                    ) : (
                      <SoftButton
                        color="primary"
                        disabled={!isOptionSelected}
                        onClick={handleFinishTest}
                      >
                        {t("he_assessment_page.finish_test", "Finish test")}
                      </SoftButton>
                    )}
                  </SoftBox>
                </>
              )
            )}
          </SoftBox>
        </SoftBox>
      </Grid>
    </Card>
  );
}

Header.propTypes = {
  topic: PropTypes.number.isRequired,
  subtopic: PropTypes.number,
  onRefresh: PropTypes.func,
};
export default Header;
