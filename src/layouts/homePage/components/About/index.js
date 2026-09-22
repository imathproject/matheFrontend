import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import logo from 'assets/images/logos/logo_azul.png';


const Box = styled(SoftBox)`
  display: flex;
  flex-direction: row;
  text-align: flex-start;
  justify-content: center;
  align-items: center; 

   @media (max-width: 1070px) {
    flex-direction: column;
  }
`;

const Section = styled(SoftBox)`
  width: 45%;
  margin-top: 20%;
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

const VideoSection = styled(SoftBox)`
  width: 40%; 
  margin-top: 18%;
  margin-left: 3.4%;
  margin-right: 8.3%;
  display: flex; 
  flex-direction: column; 
  text-align: flex-start; 
  justify-content: flex-start; 
  align-items: center;

   @media (max-width: 1070px) {
    width: 90%;
    margin-right: 2%;
    margin-left: 2%;
    margin-top: 2%;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 5%;
  padding-bottom: 56.25%; 
  height: 0;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15px; 
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
          alt="MathE Logo"
          sx={{
            width: "100%",
            mb: 2,
            alignSelf: { xs: "center", lg: "flex-start" }
          }}
        />
        <SoftTypography mt={3} mb={3} sx={{ color: "rgb(110, 109, 115)", textAlign: "justify" }}>
          {t('home_page.mathe_description', 'Is an adaptive, open-access platform designed to empower students and educators through personalized mathematical learning, offering adaptive assessments, interactive resources, and AI-supported tools that enrich the learning experience, strengthen mathematical understanding, and promote academic success.')}
        </SoftTypography>
        <SoftTypography fontWeight="bold" sx={{ color: "#2596be" }}>
          {t('home_page.main_objectives', 'Main Objectives')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page.objective1', 'Offer free access to an AI-driven learning platform designed to enhance mathematical understanding and engagement.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page.objective2', 'Provide diverse learning resources, including written materials and video lessons.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page.objective3', 'Support both independent learning and collaborative educational experiences.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('home_page.objective4', 'Identify areas where students excel and areas requiring additional support.')}
        </SoftTypography>
      </Section>

      <VideoSection>
        <VideoWrapper>
          <YouTube
            videoId="X9GgQx-mxXg"
            opts={{ playerVars: { controls: 1, rel: 0, showinfo: 0, color: "white", controls: 1 } }}
          />
        </VideoWrapper>
      </VideoSection>
    </Box>
  );
};

export default InstructionalCard;
