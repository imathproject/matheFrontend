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

import { useState } from "react";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import OlympicFilters from "components/olympiads/OlympicFilters";
import OlympicButton from "components/olympiads/OlympicButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import OlympicPageCard from "components/olympiads/OlympicPageCard";
import { useTranslation } from "react-i18next";

function StartAssessment({ onStartAssessmentClick }) {
  const [selectedOlympic, setSelectedOlympic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const { t } = useTranslation();
  const handleStartAssessment = () => {
    onStartAssessmentClick(selectedOlympic, selectedLevel, selectedPhase, selectedYear);
  };

  const handleFilter = ({ olympic, level, phase, year }) => {
    setSelectedOlympic(olympic);
    setSelectedLevel(level);
    setSelectedPhase(phase);
    setSelectedYear(year);
  };



  return (
    <OlympicPageCard>
      <SoftBox width="100%" pt={1} pb={2} px={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {/* <SoftBox display="flex" justifyContent="center" mb={3}>
                <SoftTypography color="warning" fontWeight="bold" mb={3}>
                  SELF ASSESSMENT
                </SoftTypography>
              </SoftBox> */}
          <SoftTypography variant="h6" fontWeight="light" mb={3}>
            {t("olympic_assessment_page.please_select", "Please select the Olympic, Level, Phase and Year you want to be evaluated.")}
          </SoftTypography>
          <OlympicFilters
            layout="grid"
            restrictToAvailable
            emptyNotice
            required={["olympic", "level", "phase", "year"]}
            onChange={handleFilter}
            footer={
              <SoftBox mt={4} mb={1} display="flex" flexDirection="row" alignItems="flex-end" marginLeft="auto">
                <OlympicButton
                  fullWidth
                  disabled={!(selectedOlympic && selectedLevel && selectedPhase)}
                  onClick={handleStartAssessment}
                >
                  {t("olympic_assessment_page.start_assessment", "Start Assessment")}
                  <FontAwesomeIcon icon={faAngleRight} size="2x" />
                </OlympicButton>
              </SoftBox>
            }
          />
        </SoftBox>

      </SoftBox>
    </OlympicPageCard>
  );
}

StartAssessment.propTypes = {
  onStartAssessmentClick: PropTypes.func.isRequired,
}

export default StartAssessment;
