/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React examples
import React, { useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Header from 'layouts/selfOlympicAssessment/components/Header';
import StartAssessment from './components/StartAssessment';
import OlympicPageHeader from 'components/olympiads/OlympicPageHeader';
import { useTranslation } from 'react-i18next';


function SelfOlympicAssessment() {
  const { t } = useTranslation();
  const [showHeader, setShowHeader] = useState(false);
  const [olympic, setOlympic] = useState(null);
  const [level, setLevel] = useState(null);
  const [phase, setPhase] = useState(null);
  const [year, setYear] = useState(null);

  const handleStartAssessmentClick = (olympic, level, phase, year) => {
    setShowHeader(true);
    setOlympic(olympic);
    setLevel(level);
    setPhase(phase);
    setYear(year);
  };

  const handleRefresh = () => {
    setShowHeader(false);
  };

  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("olympic_assessment_page.olympiad_assessment", "Olympiads Assessment")} />
     {showHeader ? (
        <>
          <Header olympic={olympic} level={level} phase={phase} year={year} onRefresh={handleRefresh}/> 
        </>
      ) : (
        <StartAssessment onStartAssessmentClick={handleStartAssessmentClick} />
      )} 
    </DashboardLayout>
  );
}

export default SelfOlympicAssessment;