import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled, { keyframes } from 'styled-components';
import Form from './forum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faFacebook, faInstagram, faLinkedin, faSquareInstagram } from "@fortawesome/free-brands-svg-icons";

const Box = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: space-around;
  margin-top: 3%;

   @media (max-width: 1070px) {
   flex-direction: column;
  }
`;



// Define the smooth shake animation
const smoothShake = keyframes`
0% { transform: translateX(0); }
10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
20%, 40%, 60%, 80% { transform: translateX(5px); }
100% { transform: translateX(0); }
`;

// Apply the animation to the FontAwesomeIcon
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
&:hover {
  animation: ${smoothShake} 0.5s ease-in-out;
}
`;

// Style the RoundButton
const RoundButton = styled(Button)`
background-color: #344764;
border-radius: 50%;
width: 40px;
height: 40px;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

&:hover {
  transform: scale(1.05);
  background-color: #344764;
  
  ${StyledFontAwesomeIcon} {
    animation: ${smoothShake} 0.5s ease-in-out;
  }
}
`;

const Contacts = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <SoftBox sx={{
        width: "60%", display: "flex", alignItems: "center", justifyContent: "space-around",
        '@media (max-width: 1070px)': {
          width: "100%"
        }
      }}>
        <Form />

      </SoftBox>
      <SoftBox sx={{
        width: "40%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", mt: "3%", '@media (max-width: 1070px)': {
          width: "100%"
        }
      }}>
        <SoftTypography variant="h3" fontWeight="bold" alignItems="center" mx={3} mb={3} sx={{ color: "#2596be" }}>
          {t('common.contact_information', 'Contact Information')}
        </SoftTypography>

        <SoftBox mx={3} mb={6}>
          <SoftBox display="flex" alignItems="center" m={1}>
            <RoundButton variant="gradient" color="info">
              <StyledFontAwesomeIcon icon={faEnvelope} color="#D6F0FF" size="1x" />
            </RoundButton>

            <SoftTypography color="dark" variant="body1" ml={2}>
              mathe@ipb.pt
            </SoftTypography>
          </SoftBox>

          <a href="https://www.youtube.com/channel/UCGKINlc7YgMrHzTIPp2rYcg" target="_blank" rel="noopener noreferrer">
            <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton variant="gradient" color="info">
                <StyledFontAwesomeIcon icon={faYoutube} color="#D6F0FF" size="1x" />
              </RoundButton>

              <SoftTypography color="dark" variant="body1" ml={2}>
                {t('common.follow_us_youtube', 'Follow us on Youtube!')}
              </SoftTypography>
            </SoftBox>
          </a>

          <a href="https://www.facebook.com/MathEproject/?locale=cx_PH" target="_blank" rel="noopener noreferrer">
            <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton variant="gradient" color="info">
                <StyledFontAwesomeIcon icon={faFacebook} color="#D6F0FF" size="1x" />
              </RoundButton>
              <SoftTypography color="dark" variant="body1" ml={2}>
                {t('common.follow_us_facebook', 'Follow us on Facebook!')}
              </SoftTypography>
            </SoftBox>
          </a>

          <a href="https://www.instagram.com/mathe_project/" target="_blank" rel="noopener noreferrer">
            <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton variant="gradient" color="info">
                <StyledFontAwesomeIcon icon={faInstagram} color="#D6F0FF" size="1x" />
              </RoundButton>
              <SoftTypography color="dark" variant="body1" ml={2}>
                {t('common.follow_us_instagram', 'Follow us on Instagram!')}
              </SoftTypography>
            </SoftBox>
          </a>
        </SoftBox>
      </SoftBox>



    </Box>
  );
};

export default Contacts;

