import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useApi } from "api";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import SpinnerLoader from "../Loader";

function Leaderboard({ challengeId, onExit }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const api = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    fetchLeaderboard();
  }, [challengeId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`challenge/${challengeId}/leaderboard`);
      setLeaderboard(response.data.elements || []);
    } catch (err) {
      console.error(err);
      setError(t("challenge.error_leaderboard", "Failed to load leaderboard standings."));
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "warning"; // Gold color in Soft UI Dashboard
    if (rank === 2) return "secondary"; // Silver
    if (rank === 3) return "info"; // Bronze
    return "dark";
  };

  const getRankBadgeText = (rank) => {
    if (rank === 1) return "🥇 1st";
    if (rank === 2) return "🥈 2nd";
    if (rank === 3) return "🥉 3rd";
    return `${rank}th`;
  };

  return (
    <Card sx={{ minHeight: "70vh", mt: 5, p: 4, display: "flex", flexDirection: "column" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={4} borderBottom={1} borderColor="grey-200" pb={2}>
        <SoftBox>
          <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
            {t("challenge.leaderboard_title", "Challenge Leaderboard")}
          </SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            {t("challenge.leaderboard_subtitle", "Live standings of all student participants")}
          </SoftTypography>
        </SoftBox>
        <SoftButton variant="outlined" color="dark" size="small" onClick={fetchLeaderboard}>
          {t("challenge.refresh_btn", "Refresh")}
        </SoftButton>
      </SoftBox>

      {loading ? (
        <SoftBox display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="30vh">
          <SpinnerLoader />
        </SoftBox>
      ) : error ? (
        <SoftBox textAlign="center" my={5}>
          <SoftTypography color="error" variant="h6">
            {error}
          </SoftTypography>
        </SoftBox>
      ) : leaderboard.length === 0 ? (
        <SoftBox textAlign="center" my={5}>
          <SoftTypography variant="h6" color="text">
            {t("challenge.no_leaderboard_data", "No responses submitted yet for this challenge.")}
          </SoftTypography>
        </SoftBox>
      ) : (
        <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", mb: 4 }}>
          <Table>
            <TableHead sx={{ display: "table-header-group", backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("challenge.rank", "Rank")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("challenge.student", "Student")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("challenge.university", "University")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("challenge.score", "Score")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("challenge.time_spent", "Time Spent")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((student, index) => {
                const rank = index + 1;
                return (
                  <TableRow key={student.userId} sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}>
                    <TableCell align="center">
                      <SoftTypography variant="button" fontWeight="bold" color={getRankBadgeColor(rank)}>
                        {getRankBadgeText(rank)}
                      </SoftTypography>
                    </TableCell>
                    <TableCell>
                      <SoftTypography variant="button" fontWeight="bold" color="dark">
                        {student.name} {student.surname}
                      </SoftTypography>
                    </TableCell>
                    <TableCell>
                      <SoftTypography variant="caption" fontWeight="medium" color="text">
                        {student.university}
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="center">
                      <SoftTypography variant="button" fontWeight="bold" color="info">
                        {student.correct} / {student.total}
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="center">
                      <SoftTypography variant="caption" fontWeight="medium" color="text">
                        {formatDuration(student.duration)}
                      </SoftTypography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <SoftBox mt="auto" display="flex" justifyContent="center">
        <SoftButton variant="gradient" color="info" size="large" onClick={onExit}>
          {t("challenge.exit_to_menu", "Exit to Menu")}
        </SoftButton>
      </SoftBox>
    </Card>
  );
}

Leaderboard.propTypes = {
  challengeId: PropTypes.number.isRequired,
  onExit: PropTypes.func.isRequired,
};

export default Leaderboard;
