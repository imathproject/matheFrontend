import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import logo from 'assets/images/logo_higher_education.png';
import image from 'assets/images/higher_education_image.png';
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
  margin-top: 5%;
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

const ImageSection = styled(SoftBox)`
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

const ImageWrapper = styled.div`
  width: 100%;
  margin-top: 5%;
  border: none;
  box-shadow: none;
  outline: none;

  img {
    width: 100%;
    height: auto;
    display: block;
    border: none;
    box-shadow: none;
    outline: none;
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
          alt="MathE Higher Education Logo"
          sx={{
            width: "100%",
            mb: 2,
            alignSelf: { xs: "center", lg: "flex-start" }
          }}
        />
        <SoftTypography mt={3} mb={3} sx={{ color: "rgb(110, 109, 115)", textAlign: "justify" }}>
          {t('higher_education.description', 'MathE Higher Education is a space dedicated to students and teachers in higher education. The platform features a recommendation system developed and trained to help students overcome difficulties in Mathematics and support their learning and progress at their own pace, in a personalized and efficient way.')}
        </SoftTypography>
        <SoftTypography fontWeight="bold" sx={{ color: "#2596be" }}>
          {t('higher_education.main_objectives', 'Main Objectives')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('higher_education.objective1', 'Help students to overcome difficulties and strengthen their mathematical skills effectively.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('higher_education.objective2', 'Allow advanced students to progress through complex content at their own pace in a personalized way.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('higher_education.objective3', 'Encourage autonomy in the learning process, stimulating students to develop independent and continuous study habits.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('higher_education.objective4', 'Identify the specific difficulties of each student through personalized recommendations.')}
        </SoftTypography>
        <SoftTypography sx={{ color: "rgb(110, 109, 115)", mb: 1, textAlign: "justify", ml: 2 }}>
          <FontAwesomeIcon icon={faSquareRootVariable} color='#E89F51' style={{ marginRight: 5 }} />
          {t('higher_education.objective5', "Offer content and exercises appropriate to the individual's learning profile.")}
        </SoftTypography>
      </Section>

      <ImageSection>
        <ImageWrapper>
          <img src={image} alt="Higher Education Graphic" />
        </ImageWrapper>
      </ImageSection>
    </Box>
  );
};

export default InstructionalCard;
