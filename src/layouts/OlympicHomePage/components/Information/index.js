import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'api';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import olympicChoose from 'assets/images/olympic_choose.png';
import performance from 'assets/images/performance.png';

const AnimatedCardBlue = styled(Card)`
  width: 40%; 
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
  width: 40%; 
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
  width: auto;
  padding: 8px 16px;
  gap: 8px;
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
`;

const RoundButtonBlue = styled(Button)`
  background: linear-gradient(315deg, #ADD8E6 0%, #2596be 74%);
  display: flex;
  width: auto;
  padding: 8px 16px;
  gap: 8px;
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
  const navigate = useNavigate();

  return (
    <Box>
      <Section>
        <AnimatedCardBlue>
          <Card.Body style={{ padding: 0 }}>
            <RoundedImage src={olympicChoose} alt="Card Image" />
            <Text>
              <SoftTypography variant="h2" ml={2} sx={{ color: "#344767" }}>{t('home_page_olympiad.olympiads', 'Olympiads')}</SoftTypography>
              <ColoredLineBlue />
              <SoftTypography variant="h6" color="dark" ml={2}>
                {t('home_page_olympiad.mathe_info_olympiads_desc', 'The MathE Olympiads is an enrichment initiative designed to challenge and inspire students with an interest in mathematics.')}
              </SoftTypography>
            </Text>
            {/* Temporarily hidden
            <ButtonContainer>
              <RoundButtonBlue variant="gradient" color="info" onClick={() => navigate("/olympicHomePage")}>
                <SoftTypography fontWeight="bold" variant="h6" color="white">
                  {t('home_page_olympiad.see_more', 'See more')}
                </SoftTypography>
                <FontAwesomeIcon icon={faChevronRight} color="white" style={{ marginLeft: 2 }} />
              </RoundButtonBlue>

            </ButtonContainer>
            */}
          </Card.Body>
        </AnimatedCardBlue>
        <AnimatedCardOrange>
          <Card.Body style={{ padding: 0 }}>
            <RoundedImage src={performance} alt="Card Image" />
            <Text>
              <SoftTypography variant="h2" ml={2} sx={{ color: "#344767" }}>{t('performance_tab', 'Performance')}</SoftTypography>
              <ColoredLineOrange />
              <SoftTypography variant="h6" color="dark" ml={2}>
                {t('home_page_olympiad.performance_desc2', 'Track your progress with a comprehensive overview of all completed activities, helping you identify strengths, monitor improvement, and focus on areas needing further development.')}
              </SoftTypography>
            </Text>
            {/* Temporarily hidden
            <ButtonContainer>
              <RoundButtonOrange variant="gradient" color="info" onClick={() => navigate("/olympicHomePage")}>
                <SoftTypography fontWeight="bold" variant="h6" color="white">
                  {t('home_page_olympiad.see_more', 'See more')}
                </SoftTypography>
                <FontAwesomeIcon icon={faChevronRight} color="white" style={{ marginLeft: 2 }} />
              </RoundButtonOrange>

            </ButtonContainer>
            */}
          </Card.Body>
        </AnimatedCardOrange>
      </Section>
    </Box>
  );
};

export default Information;
