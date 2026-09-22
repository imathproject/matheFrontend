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
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import SearchBar from "../SearchBar";
import { useTranslation } from "react-i18next";

function StartAssessment({ onStartAssessmentClick }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const { t } = useTranslation();
  const handleStartAssessment = () => {
    onStartAssessmentClick(selectedTopic, selectedSubtopic);
  };

  const handleFilter = (topic, subtopic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(subtopic);
  };



  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: 'flex', flexDirection: 'column' }}>
      <Grid alignItems="center" p={5}>
        <SoftBox width="100%" pt={1} pb={2} px={2}>
          <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {/* <SoftBox display="flex" justifyContent="center" mb={3}>
                  <SoftTypography color="primary" fontWeight="bold" mb={3}>
                    SELF ASSESSMENT
                  </SoftTypography>
                </SoftBox> */}
            <SoftTypography variant="h6" fontWeight="light" mb={3}>
              {t("he_assessment_page.select_topic", "Please select the topic you want to be evaluated.")}
            </SoftTypography>
            <SearchBar onFilter={handleFilter} onStart={handleStartAssessment} />
          </SoftBox>

        </SoftBox>
      </Grid>
    </Card>
  );
}

StartAssessment.propTypes = {
  onStartAssessmentClick: PropTypes.func.isRequired,
}

export default StartAssessment;
