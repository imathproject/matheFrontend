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
import Header from 'layouts/selfAssessment/components/Header';
import StartAssessment from './components/StartAssessment';
import Title from './components/Title';


function SelfAssessment() {
  const [showHeader, setShowHeader] = useState(false);
  const [topic, setTopic] = useState();
  const [subtopic, setSubtopic] = useState();

  const handleStartAssessmentClick = (topic, subtopic) => {
    setShowHeader(true);
    setTopic(topic);
    setSubtopic(subtopic);
  };

  const handleRefresh = () => {
    setShowHeader(false);
  };

  return (
    <DashboardLayout>
      <Title/>
     {showHeader ? (
        <>
          <Header topic={topic} subtopic={subtopic} onRefresh={handleRefresh}/> 
        </>
      ) : (
        <StartAssessment onStartAssessmentClick={handleStartAssessmentClick} />
      )} 
    </DashboardLayout>
  );
}

export default SelfAssessment;