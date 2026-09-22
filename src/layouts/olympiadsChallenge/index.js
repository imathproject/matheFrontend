import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StartChallenge from "./components/StartChallenge";
import FinishChallenge from "./components/FinishChallenge";
import Leaderboard from "./components/Leaderboard";
import Question from "./components/Question";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import ProgressBar from "layouts/selfOlympicAssessment/components/ProgressBar";
import SpinnerLoader from "components/olympiads/Loader";
import SoftBox from "components/SoftBox";
import OlympicButton from "components/olympiads/OlympicButton";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function OlympiadsChallenge() {
  const [step, setStep] = useState("start"); // start, questions, finish, leaderboard
  const [challenge, setChallenge] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const api = useApi();
  const { t } = useTranslation();

  // Shuffles answers whenever currentQuestion changes
  useEffect(() => {
    if (currentQuestion) {
      const olympicQuestion = currentQuestion.olympic_question;
      const alternatives = olympicQuestion.alternatives || [];

      // Build options from dynamic alternatives
      const optionsWithIdx = alternatives.map((alt) => ({
        value: alt.text,
        originalIndex: alt.id, // Use the alternative ID as the original index
      }));

      const shuffled = [...optionsWithIdx].sort(() => Math.random() - 0.5);
      // Add "I don't know" option with id=0 (maps to answer=-1 in the backend)
      shuffled.push({ value: t("challenge.dont_know", "I don't know"), originalIndex: 0 });

      setShuffledOptions(shuffled);
      setSelectedOption(null);
      setIsOptionSelected(false);
      setStartTime(Date.now());
    }
  }, [currentQuestion, t]);

  // Fetch the next question from the backend
  const fetchNextQuestion = async (challengeId) => {
    try {
      const response = await api.post("olympiadsChallenge/nextQuestion", {
        challengeId: challengeId,
      });
      const result = response.data.element;

      if (result.finished) {
        // All questions answered
        const elapsed = challengeStartTime
          ? Math.round((Date.now() - challengeStartTime) / 1000)
          : 0;
        setTotalElapsedTime(elapsed);
        setAnsweredCount(result.answeredCount);
        setTotalQuestions(result.totalQuestions);
        setStep("finish");
        return;
      }

      setCurrentQuestion(result.question);
      setAnsweredCount(result.answeredCount);
      setTotalQuestions(result.totalQuestions);
    } catch (err) {
      console.error("Error fetching next question:", err);
    }
  };

  const handleStart = (challengeDetails, existingAnswers, totalQs) => {
    setChallenge(challengeDetails);
    setTotalQuestions(totalQs);
    setChallengeStartTime(Date.now());

    // Count already correct answers (for resume)
    const alreadyCorrect = existingAnswers.filter((q) => q.answer === 1).length;
    setCorrectCount(alreadyCorrect);

    // Count already answered questions (for resume)
    const alreadyAnswered = existingAnswers.filter((q) => q.option_selected !== -1).length;
    setAnsweredCount(alreadyAnswered);

    if (alreadyAnswered >= totalQs) {
      // All questions already answered (resuming a finished challenge)
      setTotalElapsedTime(0);
      setStep("finish");
    } else {
      // Fetch the next question
      setLoading(true);
      setStep("questions");
      fetchNextQuestion(challengeDetails.id).finally(() => setLoading(false));
    }
  };

  const handleAnswer = (originalIndex) => {
    setSelectedOption(Number(originalIndex));
    setIsOptionSelected(true);
  };

  const handleNext = async () => {
    const duration = (Date.now() - startTime) / 1000;
    setLoading(true);

    try {
      // Submit the answer for the current question
      const result = await api.post("olympiadsChallenge/submitAnswer", {
        challengeId: challenge.id,
        questionId: currentQuestion.id_olympic_question,
        optionSelected: selectedOption,
        duration: Math.round(duration),
      });

      // Track correct answers locally
      if (result.data.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      // Fetch the next question
      await fetchNextQuestion(challenge.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    setStep("start");
    setChallenge(null);
    setCurrentQuestion(null);
    setAnsweredCount(0);
    setTotalQuestions(0);
    setCorrectCount(0);
    setChallengeStartTime(null);
    setTotalElapsedTime(0);
  };

  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("challenge.olympiads_challenge", "Olympiads Challenge")} />
      {step === "start" && (
        <StartChallenge onStartChallenge={handleStart} />
      )}

      {step === "questions" && (
        <Card sx={{ minHeight: "80vh", mt: 5, p: 4, display: "flex", flexDirection: "column" }}>
          <Grid container alignItems="center" justifyContent="space-between" mb={3} borderBottom={1} borderColor="grey-200" pb={2}>
            <Grid item>
              <SoftTypography variant="h4" fontWeight="bold" sx={{ color: "#F0A844" }}>
                {t("challenge.taking_title", "Taking Challenge")}
              </SoftTypography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SoftBox display="flex" flexDirection="column" alignItems="flex-end">
                <SoftTypography variant="caption" color="text" fontWeight="bold" mb={0.5}>
                  {t("challenge.progress", "Progress: ")}{answeredCount + 1} / {totalQuestions}
                </SoftTypography>
                <ProgressBar progress={answeredCount + 1} maxLevel={totalQuestions} />
              </SoftBox>
            </Grid>
          </Grid>

          {loading || !currentQuestion ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
              <SpinnerLoader />
            </SoftBox>
          ) : (
            <SoftBox flexGrow={1} display="flex" flexDirection="column">
              <Question
                questionID={currentQuestion.olympic_question.id}
                question={currentQuestion.olympic_question.question}
                options={shuffledOptions}
                olympicName={challenge.olympic ? challenge.olympic.name : ""}
                onClickAnswer={(val) => handleAnswer(val)}
                image={currentQuestion.olympic_question.file_name}
                extension={currentQuestion.olympic_question.file_ext}
              />

              <SoftBox mt={4} display="flex" justifyContent="flex-end">
                <OlympicButton
                  size="large"
                  onClick={handleNext}
                  disabled={!isOptionSelected || loading}
                >
                  {answeredCount + 1 === totalQuestions
                    ? t("challenge.finish_btn", "Finish Challenge")
                    : t("challenge.next_btn", "Next Question")}
                </OlympicButton>
              </SoftBox>
            </SoftBox>
          )}
        </Card>
      )}

      {step === "finish" && (
        <FinishChallenge
          correctCount={correctCount}
          totalCount={totalQuestions}
          onViewLeaderboard={() => setStep("leaderboard")}
          onExit={handleExit}
          challengeId={challenge.id}
          elapsedTime={totalElapsedTime}
        />
      )}

      {step === "leaderboard" && (
        <Leaderboard
          challengeId={challenge.id}
          onExit={handleExit}
        />
      )}
    </DashboardLayout>
  );
}

export default OlympiadsChallenge;
