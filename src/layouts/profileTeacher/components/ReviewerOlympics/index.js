import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import OlympicChecklist from "components/olympiads/OlympicChecklist";
import { useApi } from "api";

// Where a Lecturer Reviewer declares which olympiads they review. The server takes
// the user from the token, so this only ever changes the caller's own list.
function ReviewerOlympics({ onBack }) {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

  useEffect(() => {
    async function fetchData() {
      try {
        const [olympics, reviewerOlympics] = await Promise.all([
          api.get("olympic/getAll"),
          api.get("olympicQuestion/getMyReviewerOlympics"),
        ]);
        setOptions(olympics.data.elements);
        setSelected(reviewerOlympics.data.elements.olympicIds);
      } catch (error) {
        setErrorMessage("Could not load the olympiads.");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleChange = (olympics) => {
    setSelected(olympics);
    setSaved(false);
    setErrorMessage(olympics.length < 1 ? "Please select at least 1 olympiad." : null);
  };

  const handleSave = async () => {
    if (selected.length < 1) {
      setErrorMessage("Please select at least 1 olympiad.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("olympicQuestion/updateMyReviewerOlympics", {
        olympics: selected,
      });
      // What the server kept, which drops any olympiad that no longer exists.
      setSelected(response.data.elements.map((row) => row.id_olympic));
      setErrorMessage(null);
      setSaved(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not save the olympiads.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ mt: 5, height: "100%" }}>
      <SoftBox p={2}>
        <SoftTypography variant="h6" fontWeight="bold" color="info">
          Olympiads you review &nbsp;
        </SoftTypography>
        <Divider />
        <SoftBox py={1} pr={2} pl={2} sx={{ display: "flex", flexDirection: "column" }}>
          <SoftTypography
            variant="button"
            fontWeight="light"
            color={errorMessage ? "error" : "dark"}
            mb={2}
          >
            Review Questions in MathE Olympic lists the proposed questions of the olympiads you
            select here. Please select at least 1 olympiad.
          </SoftTypography>
          <OlympicChecklist options={options} selected={selected} onChange={handleChange} />
          {errorMessage && (
            <SoftTypography variant="caption" color="error" mt={2}>
              {errorMessage}
            </SoftTypography>
          )}
          {saved && (
            <SoftTypography variant="caption" color="success" mt={2}>
              Your olympiads were saved.
            </SoftTypography>
          )}
        </SoftBox>
        <SoftBox
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          py={1}
          pr={2}
          pl={2}
          mt={2}
        >
          <Grid item xs={12} lg={2}>
            <SoftButton variant="outlined" color="info" fullWidth onClick={onBack}>
              Back to profile
            </SoftButton>
          </Grid>
          <Grid item xs={12} lg={2}>
            <SoftButton
              variant="gradient"
              color="info"
              fullWidth
              disabled={saving}
              onClick={handleSave}
            >
              Save
            </SoftButton>
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

ReviewerOlympics.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReviewerOlympics;
