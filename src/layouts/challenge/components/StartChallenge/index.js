import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useApi } from "api";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function StartChallenge({ onStartChallenge }) {
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitingForStart, setWaitingForStart] = useState(false);
  const pollingRef = useRef(null);
  const api = useApi();
  const { t } = useTranslation();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const isToday = (dateString) => {
    const today = new Date();
    const compDate = new Date(dateString);
    return (
      today.getFullYear() === compDate.getUTCFullYear() &&
      today.getMonth() === compDate.getUTCMonth() &&
      today.getDate() === compDate.getUTCDate()
    );
  };

  const handleSearch = async () => {
    if (!code.trim()) {
      setError(t("challenge.code_required", "Please enter a valid challenge code."));
      return;
    }
    setLoading(true);
    setError("");
    setChallenge(null);
    setWaitingForStart(false);

    // Stop any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    try {
      const response = await api.get(`challenge/getById/${code.trim()}`);
      const data = response.data.element;
      if (data) {
        // Check if challenge is for today
        if (!isToday(data.date)) {
          setError(t("challenge.not_today", "This challenge is not available today."));
          return;
        }

        setChallenge(data);

        // Check status and act accordingly
        if (data.status === "finished") {
          setError(t("challenge.already_ended", "This challenge has already ended."));
          setChallenge(null);
        } else if (data.status === "created" || data.status === "paused") {
          // Enter waiting room - start polling
          setWaitingForStart(true);
          startPolling(data.id);
        }
        // If status === "started", show the challenge details with Start button (normal flow)
      } else {
        setError(t("challenge.not_found", "Challenge not found. Please verify the code."));
      }
    } catch (err) {
      console.error(err);
      setError(t("challenge.error_fetching", "Error fetching challenge details. Make sure the code is correct."));
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (challengeId) => {
    pollingRef.current = setInterval(async () => {
      try {
        const response = await api.get(`challenge/${challengeId}/status`);
        const statusData = response.data.element;
        if (statusData.status === "started") {
          // Stop polling and auto-start
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setWaitingForStart(false);
          handleAutoStart(challengeId);
        } else if (statusData.status === "finished") {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setWaitingForStart(false);
          setError(t("challenge.already_ended", "This challenge has already ended."));
          setChallenge(null);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);
  };

  const handleAutoStart = async (challengeId) => {
    setLoading(true);
    try {
      // Re-fetch challenge details to get full object
      const compResponse = await api.get(`challenge/getById/${challengeId}`);
      const challengeDetails = compResponse.data.element;

      const response = await api.post("challenge/start", {
        challengeId: challengeId,
      });
      const existingAnswers = response.data.elements;
      const totalQuestions = response.data.totalQuestions;
      onStartChallenge(challengeDetails, existingAnswers, totalQuestions);
    } catch (err) {
      console.error(err);
      setError(t("challenge.error_starting", "Failed to start the challenge. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!challenge) return;
    setLoading(true);
    try {
      const response = await api.post("challenge/start", {
        challengeId: challenge.id,
      });
      const existingAnswers = response.data.elements;
      const totalQuestions = response.data.totalQuestions;
      onStartChallenge(challenge, existingAnswers, totalQuestions);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        const errMsg = err.response.data.error;
        if (errMsg.includes("COMPETITION_NOT_STARTED") || errMsg.includes("CHALLENGE_NOT_STARTED")) {
          setError(t("challenge.not_started_yet", "The challenge hasn't started yet. Please wait for the professor."));
          setWaitingForStart(true);
          startPolling(challenge.id);
        } else {
          setError(t("challenge.error_starting", "Failed to start the challenge. Please try again."));
        }
      } else {
        setError(t("challenge.error_starting", "Failed to start the challenge. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  // Waiting Room UI
  if (waitingForStart && challenge) {
    return (
      <Card sx={{ minHeight: "60vh", mt: 5, p: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <SoftBox textAlign="center" mb={4}>
              <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
                {challenge.title || t("challenge.title", "Student Challenge")}
              </SoftTypography>
              <SoftTypography variant="body2" color="text" mt={1}>
                {t("challenge.waiting_subtitle", "Waiting for the professor to start the challenge...")}
              </SoftTypography>
            </SoftBox>

            <Card sx={{ p: 3, bgColor: "grey-100", border: "1px solid #e2e8f0", mb: 3 }}>
              <Grid container spacing={2}>
                {challenge.localization && (
                  <Grid item xs={6}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                      {t("challenge.location_label", "Location:")}
                    </SoftTypography>
                    <SoftTypography variant="body2" fontWeight="medium" color="dark">
                      {challenge.localization}
                    </SoftTypography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.topic_label", "Topic:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.platform__topic ? challenge.platform__topic.label : t("challenge.n_a", "N/A")}
                  </SoftTypography>
                </Grid>
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.questions_label", "Questions:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.numberOfQuestions}
                  </SoftTypography>
                </Grid>
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.max_duration_label", "Max Duration:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.maxDuration} {t("challenge.minutes", "minutes")}
                  </SoftTypography>
                </Grid>
              </Grid>
            </Card>

            <SoftBox textAlign="center" mt={4}>
              <CircularProgress color="info" size={48} />
              <SoftTypography variant="h6" color="text" mt={2} fontWeight="medium">
                {t("challenge.waiting_message", "Please wait... The challenge will start automatically.")}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: "60vh", mt: 5, p: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <SoftBox textAlign="center" mb={4}>
            {/* <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
              {t("challenge.title", "Student Challenge")}
            </SoftTypography> */}
            <SoftTypography variant="body2" color="text" mt={1}>
              {t("challenge.subtitle", "Enter your challenge access code to start.")}
            </SoftTypography>
          </SoftBox>

          <SoftBox display="flex" gap={2} mb={3}>
            <SoftInput
              placeholder={t("challenge.input_placeholder", "e.g., 123456")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              size="large"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <SoftButton variant="gradient" color="info" onClick={handleSearch} disabled={loading}>
              {loading ? t("challenge.searching", "Searching...") : t("challenge.search_btn", "Search")}
            </SoftButton>
          </SoftBox>

          {error && (
            <SoftBox mb={3} textAlign="center">
              <SoftTypography variant="button" color="error" fontWeight="medium">
                {error}
              </SoftTypography>
            </SoftBox>
          )}

          {challenge && !waitingForStart && (
            <Card sx={{ p: 3, bgColor: "grey-100", border: "1px solid #e2e8f0", mb: 3 }}>
              <SoftBox mb={2}>
                <SoftTypography variant="h5" fontWeight="bold" color="dark">
                  {challenge.title || t("challenge.details_title", "Challenge Details")}
                </SoftTypography>
              </SoftBox>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.topic_label", "Topic:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.platform__topic ? challenge.platform__topic.label : t("challenge.n_a", "N/A")}
                  </SoftTypography>
                </Grid>
                {challenge.platform__subtopic && (
                  <Grid item xs={6}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                      {t("challenge.subtopic_label", "Subtopic:")}
                    </SoftTypography>
                    <SoftTypography variant="body2" fontWeight="medium" color="dark">
                      {challenge.platform__subtopic.label}
                    </SoftTypography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.questions_label", "Questions:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.numberOfQuestions}
                  </SoftTypography>
                </Grid>
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.max_duration_label", "Max Duration:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {challenge.maxDuration} {t("challenge.minutes", "minutes")}
                  </SoftTypography>
                </Grid>
                {challenge.localization && (
                  <Grid item xs={6}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                      {t("challenge.location_label", "Location:")}
                    </SoftTypography>
                    <SoftTypography variant="body2" fontWeight="medium" color="dark">
                      {challenge.localization}
                    </SoftTypography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <SoftTypography variant="caption" color="text" fontWeight="bold">
                    {t("challenge.date_label", "Scheduled Date:")}
                  </SoftTypography>
                  <SoftTypography variant="body2" fontWeight="medium" color="dark">
                    {new Date(challenge.date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                  </SoftTypography>
                </Grid>
              </Grid>

              <SoftBox mt={4} display="flex" justifyContent="center">
                <SoftButton variant="gradient" color="success" size="large" onClick={handleStart} disabled={loading}>
                  {t("challenge.start_test_btn", "Start challenge")}
                </SoftButton>
              </SoftBox>
            </Card>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}

StartChallenge.propTypes = {
  onStartChallenge: PropTypes.func.isRequired,
};

export default StartChallenge;
