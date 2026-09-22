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
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import Question from "../Question";
import TestReview from "../TestReview";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import SpinnerLoader from "components/olympiads/Loader";
import { useApi } from "api";
import OlympicPageCard from "components/olympiads/OlympicPageCard";
import OlympicEmptyState from "components/olympiads/OlympicEmptyState";
import OlympicButton from "components/olympiads/OlympicButton";
import { useTranslation } from "react-i18next";

function Header({ olympic, level, phase, year, onRefresh }) {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [testFinished, setTestFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [idAnswerArray, setIdAnswerArray] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [questionsId, setQuestionId] = useState([]);
  const api = useApi();
  const { t } = useTranslation();
  useEffect(() => {
    fetchOlympicTest();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [questionIndex, testFinished]);

  function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  async function fetchOlympicTest() {
    try {
      let url = `olympicQuestion/getTest?id_olympic=${olympic?.id}&id_olympic_phase=${phase?.id}&id_olympic_level=${level?.id}`;
      if (year?.id) {
        url += `&id_olympic_year=${year.id}`;
      }
      const data = await api.get(url);
      const qs = data.data.elements || [];
      setQuestions(qs);
      if (qs.length > 0) {
        setCurrentQuestion(qs[0]);
        setOptions(buildOptions(qs[0]));
        setStartTime(Date.now());
      }
      setIsReady(true);
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } catch (error) {
      setLoadFailed(true);
      setIsReady(true);
    }
  }

  function buildOptions(q) {
    const base = q.alternatives ? q.alternatives.map(alt => ({
      value: alt.text,
      id: alt.id
    })) : [];
    const shuffled = shuffleArray(base);
    shuffled.push({ value: "I don't know", id: 0 });
    return shuffled;
  }

  const submitCurrentAnswer = async (durationSeconds) => {
    if (!currentQuestion || !selectedOption) return;
    const answerId = selectedOption.id;

    let isCorrectVal = false;
    let correctText = "";

    try {
      const resp = await api.post("olympicAssessment/answerQuestion", {
        id_olympic_question: currentQuestion.id,
        answer: answerId,
        duration: durationSeconds,
      });
      isCorrectVal = resp.data?.element?.isCorrect || false;
      correctText = resp.data?.element?.correctAnswerText || "";
    } catch (error) {
      // Handle error
    }

    // store for review
    const answerText = selectedOption.value;
    idAnswerArray.push({
      id: currentQuestion.id,
      answer: answerText,
      encodedAnswer: isCorrectVal ? 1 : 0,
      correctText
    });
    setIdAnswerArray([...idAnswerArray]);

    questionsId.push(currentQuestion.id);
    setQuestionId([...questionsId]);
  };

  const handleNextQuestion = async () => {
    const durationSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    await submitCurrentAnswer(durationSeconds);

    const newQuestionIndex = questionIndex + 1;
    setIsOptionSelected(false);
    setSelectedOption(null);
    setQuestionIndex(newQuestionIndex);

    const next = questions[newQuestionIndex];
    setCurrentQuestion(next);
    setOptions(buildOptions(next));
    setStartTime(Date.now());
  };

  const handleAnswer = (originalIndex, answerText, optionObj) => {
    setSelectedOption(optionObj);
    setIsOptionSelected(true);
  };

  const handleFinishTest = async () => {
    const durationSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    await submitCurrentAnswer(durationSeconds);
    setTestFinished(true);
  };

  if (!isReady) {
    return (
      <OlympicPageCard center>
        <SpinnerLoader />
      </OlympicPageCard>
    );
  }

  // Nothing came back: either the request failed or the chosen combination has
  // no validated question. Say so and offer the way back to the filters,
  // instead of leaving an empty card on screen.
  if (loadFailed || questions.length === 0) {
    return (
      <OlympicPageCard>
        <OlympicEmptyState
          message={
            loadFailed
              ? t("olympic_assessment_page.load_failed", "We could not load the test. Please try again.")
              : t("olympic_assessment_page.no_questions", "There are no questions available for this selection.")
          }
          description={
            loadFailed
              ? null
              : [olympic?.label, level?.label, phase?.label, year?.label].filter(Boolean).join(" • ")
          }
          action={
            <OlympicButton onClick={onRefresh}>
              {t("olympic_assessment_page.change_selection", "Change selection")}
            </OlympicButton>
          }
        />
      </OlympicPageCard>
    );
  }

  return (
    <OlympicPageCard mobilePadding={0}>
      <SoftBox width="100%" pt={1} pb={2} px={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {testFinished ? (
            <TestReview ids={questionsId} answers={idAnswerArray} questions={questions} />
          ) : (
            currentQuestion && (
              <>
                <SoftTypography fontWeight="bold" mb={1}>
                  {t("olympic_assessment_page.question", "Question")} {" "} {questionIndex + 1} {" "}  {t("olympic_assessment_page.of", "of")} {" "} {questions.length}
                </SoftTypography>
                <p>
                  {currentQuestion.olympic.name}, {currentQuestion.olympic_year.year}
                </p>
                <Question
                  questionID={currentQuestion.id}
                  question={currentQuestion.question?.replace(/\\\[/g, "$").replace(/\\\]/g, "$")}
                  options={options}
                  onClickAnswer={handleAnswer}
                  image={currentQuestion.file_name}
                  extension={currentQuestion.file_ext}
                />
                <SoftBox display="flex" flexDirection="row" justifyContent="flex-end">
                  {questionIndex < questions.length - 1 ? (
                    <OlympicButton
                      disabled={!isOptionSelected}
                      onClick={handleNextQuestion}
                    >
                      {t("olympic_assessment_page.next_question", "Next question")}
                    </OlympicButton>
                  ) : (
                    <OlympicButton
                      disabled={!isOptionSelected}
                      onClick={handleFinishTest}
                    >
                      {t("olympic_assessment_page.finish_test", "Finish Test")}
                    </OlympicButton>
                  )}
                </SoftBox>
              </>
            )
          )}
        </SoftBox>
      </SoftBox>
    </OlympicPageCard>
  );
}

Header.propTypes = {
  olympic: PropTypes.object.isRequired,
  level: PropTypes.object.isRequired,
  phase: PropTypes.object.isRequired,
  year: PropTypes.object,
  onRefresh: PropTypes.func,
};
export default Header;
