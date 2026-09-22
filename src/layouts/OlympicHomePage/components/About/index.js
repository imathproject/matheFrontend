import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import logo from 'assets/images/logo_olympiads.jpg';

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: row;
  text-align: flex-start;
  justify-content: center;
  align-items: center;
  margin-top:50px;

   @media (max-width: 1070px) {
    flex-direction: column;
  }
`;

const Section = styled(SoftBox)`
  width: 50%;
  margin-top: 5%;
  margin-right: 50%;
  margin-left: 8.3%;
  display: flex; 
  flex-direction: column; 
  text-align: flex-start; 
  justify-content: flex-start; 
  align-items: flex-start; 

  @media (max-width: 1070px) {
    width: 90%;
    margin-top: 31%;
    margin-right: 2%;
    margin-left: 2%;
  }
`;


const InstructionalCard = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Section>
        <SoftBox
          component="img"
          src={logo}
          alt="MathE Olympiads Logo"
          sx={{
            width: "100%",
            mb: 2,
            alignSelf: { xs: "center", lg: "flex-start" }
          }}
        />
        <SoftTypography mt={3} mb={3} sx={{ color: "rgb(110, 109, 115)", textAlign: "justify" }}>
          {t('home_page_olympiad.mathe_olympiads_desc', 'The MathE Olympiads is a space designed for students interested in academic competitions. The platform provides access to extensive question banks from scientific contests and olympiads from several countries, enabling students to prepare effectively through personalized learning resources and practice tools.')}
        </SoftTypography>
        <SoftTypography fontWeight="bold" sx={{ color: "#2596be" }}>
          {t('home_page_olympiad.main_objectives', 'Main Objectives')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page_olympiad.objective1', 'Promote and encourage the study of mathematics through academic competitions and Olympiads.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page_olympiad.objective2', 'Democratize access to mathematics competitions, particularly for students in underserved areas.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page_olympiad.objective3', 'Support students in preparing for scientific competitions through high-quality learning materials, practice exercises, and personalized resources.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page_olympiad.objective4', 'Foster problem-solving and mathematical reasoning skills through engaging and challenging learning experiences.')}
        </SoftTypography>
      </Section>

    </Box>
  );
};

export default InstructionalCard;
