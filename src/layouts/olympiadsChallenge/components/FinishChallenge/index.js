import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import OlympicButton from "components/olympiads/OlympicButton";
import { useApi } from "api";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import OlympicConfetti from "components/olympiads/OlympicConfetti";

function FinishChallenge({ correctCount, totalCount, onViewLeaderboard, onExit, challengeId, elapsedTime }) {
  const { t } = useTranslation();
  const api = useApi();
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [polling, setPolling] = useState(true);
  const pollingRef = useRef(null);
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const formatElapsedTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  useEffect(() => {
    // Start polling for challenge status
    checkStatus();
    pollingRef.current = setInterval(checkStatus, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [challengeId]);

  const checkStatus = async () => {
    try {
      const response = await api.get(`olympiadsChallenge/${challengeId}/status`);
      const statusData = response.data.element;
      if (statusData.status === "finished") {
        setChallengeFinished(true);
        setPolling(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    } catch (err) {
      console.error("Status polling error:", err);
    }
  };

  // Phase 1: Challenge still running - show waiting screen
  if (!challengeFinished) {
    return (
      <Card sx={{ minHeight: "60vh", mt: 5, p: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6} textAlign="center">
            <SoftBox mb={4}>
              <SoftTypography variant="h2" fontWeight="bold" sx={{ color: "#F0A844" }}>
                {t("challenge.finished_waiting_title", "You Finished!")}
              </SoftTypography>
              <SoftTypography variant="h5" fontWeight="medium" color="text" mt={1}>
                {t("challenge.finished_waiting_subtitle", "You have completed all questions.")}
              </SoftTypography>
            </SoftBox>

            <Card sx={{ p: 4, mb: 4, bg: "grey-100", border: "1px solid #e2e8f0" }}>
              <SoftBox mb={1}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  {t("challenge.completion_time_label", "Your Completion Time")}
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h1" fontWeight="bold" sx={{ color: "#F0A844", fontSize: "3.5rem" }}>
                {formatElapsedTime(elapsedTime)}
              </SoftTypography>
            </Card>

            <SoftBox mt={4}>
              <CircularProgress color="warning" size={48} />
              <SoftTypography variant="h6" color="text" mt={2} fontWeight="medium">
                {t("challenge.waiting_for_finish", "Waiting for the challenge to end...")}
              </SoftTypography>
              <SoftTypography variant="body2" color="secondary" mt={1}>
                {t("challenge.waiting_for_finish_hint", "Results will be available once the professor finishes the challenge.")}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
    );
  }

  // Phase 2: Challenge finished - show results with confetti
  return (
    <Card sx={{ minHeight: "60vh", mt: 5, p: 4, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <OlympicConfetti />
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6} textAlign="center">
          <SoftBox mb={4}>
            <SoftTypography variant="h2" fontWeight="bold" sx={{ color: "#F0A844" }}>
              {t("challenge.finished_title", "Congratulations!")}
            </SoftTypography>
            <SoftTypography variant="h5" fontWeight="medium" color="text" mt={1}>
              {t("challenge.finished_subtitle", "You have successfully finished the challenge.")}
            </SoftTypography>
          </SoftBox>

          <Card sx={{ p: 4, mb: 2, bg: "grey-100", border: "1px solid #e2e8f0" }}>
            <SoftBox mb={1}>
              <SoftTypography variant="h6" color="text" fontWeight="medium">
                {t("challenge.completion_time_label", "Your Completion Time")}
              </SoftTypography>
            </SoftBox>
            <SoftTypography variant="h3" fontWeight="bold" color="dark">
              {formatElapsedTime(elapsedTime)}
            </SoftTypography>
          </Card>

          <Card sx={{ p: 4, mb: 4, bg: "grey-100", border: "1px solid #e2e8f0" }}>
            <SoftBox mb={1}>
              <SoftTypography variant="h6" color="text" fontWeight="medium">
                {t("challenge.score_label", "Your Score")}
              </SoftTypography>
            </SoftBox>
            <SoftTypography variant="h1" fontWeight="bold" sx={{ color: "#F0A844", fontSize: "4.5rem" }}>
              {correctCount} / {totalCount}
            </SoftTypography>
            <SoftTypography variant="button" color="text" fontWeight="bold">
              {percentage}% {t("challenge.correct_answers", "Correct Answers")}
            </SoftTypography>
          </Card>

          <SoftBox display="flex" justifyContent="center" gap={3}>
            <OlympicButton
              size="large"
              onClick={onViewLeaderboard}
            >
              {t("challenge.view_leaderboard_btn", "View Leaderboard")}
            </OlympicButton>
            <OlympicButton variant="outlined" tone="neutral" size="large" onClick={onExit}>
              {t("challenge.exit_btn", "Exit")}
            </OlympicButton>
          </SoftBox>
        </Grid>
      </Grid>
    </Card>
  );
}

FinishChallenge.propTypes = {
  correctCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onViewLeaderboard: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  challengeId: PropTypes.number.isRequired,
  elapsedTime: PropTypes.number,
};

export default FinishChallenge;
