import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useApi } from 'api';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import card3 from 'assets/images/card3.jpg';
import olympicChoose from 'assets/images/olympic_choose.png';

const AnimatedCardBlue = styled(Card)`
  width: 25%; 
  height: 100%; 
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: white;
  border-color: white;
  margin: 30px;
  border-radius: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 

  &:hover {
    transform: scale(1.05);
    background-color: #f9f9f9;
    box-shadow: 0 8px 16px #2596be; 
  }

  @media (max-width: 1070px) {
    width: 70%;
  }
`;

const AnimatedCardOrange = styled(Card)`
  width: 25%; 
  height: 100%; 
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: white;
  border-color: white;
  margin: 30px;
  border-radius: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 

  &:hover {
    transform: scale(1.05);
    background-color: #f9f9f9;
    box-shadow: 0 8px 16px #E89F51; 
  }

  @media (max-width: 1070px) {
    width: 70%;
  }
`;

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column; 
  text-align: center;
  justify-content: center;
  align-items: center; 
`;

const Section = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: center;

  @media (max-width: 1070px) {
    width: 100%;
    flex-direction: column; 
    margin-top: 10%;
  }
`;

const Text = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: center;
  padding: 16px;
`;

const RoundedImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px 15px 0 0; 
`;

const RoundButtonOrange = styled(Button)`
  background: linear-gradient(315deg, #f5d020 0%, #E89F51 74%);
  display: flex;
  width: 48%;
  align-items: center;
  justify-content: space-between;
  margin: 8px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(315deg, #f5d020 0%, #E89F51 74%);
    color: white;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const RoundButtonBlue = styled(Button)`
  background: linear-gradient(315deg, #ADD8E6 0%, #2596be 74%);
  display: flex;
  width: 48%;
  align-items: center;
  justify-content: space-between;
  margin: 8px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(315deg, #ADD8E6 0%, #2596be 74%);
    color: white;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const ButtonContainer = styled(SoftBox)`
  display: flex;
  justify-content: start;
  align-items: flex-end;
  margin-top: auto;
  padding: 16px;
`;

const ColoredLineOrange = styled.div`
  width: 20%;
  height: 3px;
  background: linear-gradient(315deg, #f5d020 0%, #E89F51 74%);
  margin-left: 3%;
  margin-bottom: 5%;
`;

const ColoredLineBlue = styled.div`
  width: 20%;
  height: 3px;
  background: linear-gradient(315deg, #ADD8E6 0%, #2596be 74%);
  margin-left: 3%;
  margin-bottom: 5%;
`;

const Information = () => {
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();

  async function handleDownload(name) {
    try {
      const response = await api.get(`info/download${name}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error
    }
  }

  function openYouTubeVideo(videoUrl) {
    window.open(videoUrl, '_blank');
  }

  return (
    <Box>
      <Section>

        <AnimatedCardBlue>
          <Card.Body style={{ padding: 0 }}>
            <RoundedImage src={card3} alt="Card Image" />
            <Text>
              <SoftTypography variant="h2" color="dark" ml={2}>{t('home_page.higher_education', 'Higher Education')}</SoftTypography>
              <ColoredLineBlue />
              <SoftTypography variant="h6" color="dark" ml={2}>
                {t('home_page.mathe_higher_education_desc', 'The MathE Higher Education provides a personalized learning environment designed to support students in overcoming mathematical challenges and progressing at their own pace.')}
              </SoftTypography>
            </Text>
            <ButtonContainer>
              <RoundButtonBlue variant="gradient" color="info" onClick={() => navigate("/higherEducationHomePage")}>
                <SoftTypography fontWeight="bold" variant="h6" color="white">
                  {t('home_page.see_more', 'See more')}
                </SoftTypography>
                <FontAwesomeIcon icon={faChevronRight} color="white" style={{ marginLeft: 2 }} />
              </RoundButtonBlue>
            </ButtonContainer>
          </Card.Body>
        </AnimatedCardBlue>
        <AnimatedCardOrange>
          <Card.Body style={{ padding: 0 }}>
            <RoundedImage src={olympicChoose} alt="Card Image" />
            <Text>
              <SoftTypography variant="h2" ml={2} sx={{ color: "#344767" }}>{t('home_page.olympiads', 'Olympiads')}</SoftTypography>
              <ColoredLineOrange />
              <SoftTypography variant="h6" color="dark" ml={2}>
                {t('home_page.mathe_olympiads_desc', 'The MathE Olympiads provides students with access to scientific competitions from different countries, encouraging excellence, critical thinking, and international engagement in mathematics.')}
              </SoftTypography>
            </Text>
            <ButtonContainer>
              <RoundButtonOrange variant="gradient" color="info" onClick={() => navigate("/olympicHomePage")}>
                <SoftTypography fontWeight="bold" variant="h6" color="white">
                  {t('home_page.see_more', 'See more')}
                </SoftTypography>
                <FontAwesomeIcon icon={faChevronRight} color="white" style={{ marginLeft: 2 }} />
              </RoundButtonOrange>

            </ButtonContainer>
          </Card.Body>
        </AnimatedCardOrange>

      </Section>
    </Box>
  );
};

export default Information;
