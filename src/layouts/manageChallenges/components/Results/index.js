import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useApi } from "api";

function Results({ challengeId, onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const api = useApi();

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
      setError("Failed to load results for this challenge.");
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

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, p: 4, display: "flex", flexDirection: "column" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={4} borderBottom={1} borderColor="grey-200" pb={2}>
        <SoftBox>
          <SoftTypography variant="h4" fontWeight="bold" color="info">
            Challenge Results
          </SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Standings and stats of all student participants
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" gap={2}>
          <SoftButton variant="gradient" color="info" size="small" onClick={fetchLeaderboard}>
            Refresh
          </SoftButton>
          <SoftButton variant="outlined" color="dark" size="small" onClick={onBack}>
            Back
          </SoftButton>
        </SoftBox>
      </SoftBox>

      {loading ? (
        <SoftBox display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="30vh">
          <CircularProgress color="info" />
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
            No student responses submitted yet for this challenge.
          </SoftTypography>
        </SoftBox>
      ) : (
        <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", mb: 4 }}>
          <Table>
            <TableHead sx={{ display: "table-header-group", backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>University</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Score</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Time Spent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((student, index) => {
                const rank = index + 1;
                return (
                  <TableRow key={student.userId} sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}>
                    <TableCell align="center">
                      <SoftTypography variant="button" fontWeight="bold">
                        {rank}
                      </SoftTypography>
                    </TableCell>
                    <TableCell>
                      <SoftTypography variant="button" fontWeight="bold" color="dark">
                        {student.name} {student.surname}
                      </SoftTypography>
                    </TableCell>
                    <TableCell>
                      <SoftTypography variant="caption" fontWeight="medium" color="text">
                        {student.email}
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
    </Card>
  );
}

Results.propTypes = {
  challengeId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Results;
