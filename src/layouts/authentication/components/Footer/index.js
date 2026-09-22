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

// @mui material components
import Grid from "@mui/material/Grid";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

//Images
import license from "assets/images/license.png";
import iMathe from "assets/images/iMatheLogo.png"
import Mathe from "assets/images/oldMatheLogo.png"
import flag from "assets/images/europe_flag.png"

//Icons
import { Button } from 'react-bootstrap';


function Footer() {
  const { t } = useTranslation();
  const RoundButton = styled(Button)`
  background-color: #add8e6;
  border: 0px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    background-color: #add8e6;
  }
  `;
  return (
    <SoftBox component="footer" variant="gradient" py={6} sx={{ background: "#141727" }}>
      <Grid container justifyContent="center">

        <Grid item xs={12} lg={10}>
          <SoftBox display="flex" justifyContent="space-between" mt={1} mb={3} sx={{
            '@media (max-width: 1020px)': {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            },
          }}>
            <SoftBox width="30%" mt={2} textAlign="justify" sx={{
              '@media (max-width: 1020px)': {
                width: "90%"
              },
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={Mathe} width="25%" />
              </div>
              <SoftBox mt={3}>
                <SoftTypography variant="overline" color="light" fontWeight="light">
                  {t('footer.mathe_project_desc', 'The MathE project (2018-1-PT01-KA203-047361) is funded by the European Commission through the Portuguese National Agency for the Erasmus+ Programme with the aim of enhancing the quality of teaching and improving pedagogies and assessment methods.')} <br />
                </SoftTypography>
              </SoftBox>
            </SoftBox>

            <SoftBox width="30%" mt={2} textAlign="justify" sx={{
              '@media (max-width: 1020px)': {
                width: "90%"
              },
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={iMathe} width="25%" />
              </div>

              <SoftBox mt={2.8}>
                <SoftTypography variant="overline" color="light" >
                  {t('footer.imath_desc_1', 'The iMath project (2021-1-PT01-KA220-HED-000023288) is funded by the ')}
                  <Link to="https://www.eacea.ec.europa.eu/grants_en" style={{ color: '#add8e6' }}>
                    {t('footer.european_commission', 'European Commission')}
                  </Link>
                  {t('footer.imath_desc_2', ' through the ')}
                  <Link to="https://erasmusmais.pt/" style={{ color: '#add8e6' }}>
                    {t('footer.portuguese_agency_erasmus', 'Portuguese National Agency for the Erasmus+ Programme')}
                  </Link>
                  {t('footer.imath_desc_3', ', to apply an AI-driven tool to support higher education students in improving their performances in mathematics subjects.')}
                </SoftTypography>
              </SoftBox>
            </SoftBox>

            <SoftBox width="30%" alignItems="center" sx={{
              display: "flex", flexDirection: "column", justifyContent: "center",
              '@media (max-width: 1020px)': {
                width: "90%"
              },
            }}>
              {/* <SoftTypography variant="h4" fontWeight="bold" alignItems="center" mx={1} color="light">
                Contacts
              </SoftTypography>

              <SoftBox  mb={6}>
              <SoftBox display="flex" alignItems="center" m={1}>
                <RoundButton>
                  <FontAwesomeIcon icon={faEnvelope} color="#344767" size="xs"/>
                </RoundButton>
                <SoftTypography color="light" variant="h6" fontWeight="light" ml={2}>
                  mathe@ipb.pt
                </SoftTypography>
              </SoftBox>

              <a href="https://www.youtube.com/channel/UCGKINlc7YgMrHzTIPp2rYcg" target="_blank" rel="noopener noreferrer">
              <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton>
                  <FontAwesomeIcon icon={faYoutube} color="#344767" size="xs"/>
                </RoundButton>
                <SoftTypography color="light"  variant="h6" fontWeight="light" ml={2}>
                  Follow us on Youtube!
                </SoftTypography>
              </SoftBox>
              </a>
             
              <a href="https://www.facebook.com/MathEproject/?locale=cx_PH" target="_blank" rel="noopener noreferrer">
              <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton>
                  <FontAwesomeIcon icon={faFacebook} color="#344767" size="xs"/>
                </RoundButton>
                <SoftTypography color="light" variant="h6" fontWeight="light" ml={2}>
                  Follow us on Facebook!
                </SoftTypography>
              </SoftBox>
              </a>

              <a href="https://www.instagram.com/mathe_project/" target="_blank" rel="noopener noreferrer">
              <SoftBox display="flex" alignItems="center" m={1}>
              <RoundButton>
                  <FontAwesomeIcon icon={faInstagram} color="#344767" size="xs"/>
                </RoundButton>
                <SoftTypography color="light" variant="h6" fontWeight="light" ml={2}>
                  Follow us on Instagram!
                </SoftTypography>
              </SoftBox>
              </a>
              </SoftBox> */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "10%" }}>
                <img src={flag} width="130" />
              </div>

              <SoftBox textAlign="justify">
                <SoftTypography variant="overline" color="light" >
                  {t('footer.funded_by_eu_disclaimer', 'Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.')}
                </SoftTypography>
              </SoftBox>

            </SoftBox>
          </SoftBox>
        </Grid>

        <Grid item xs={12} lg={10} sx={{ textAlign: "center" }}>
          <SoftBox display="flex" justifyContent="space-between" mt={1} mb={3} sx={{
            '@media (max-width: 1020px)': {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            },
          }}>
            <SoftBox width="30%" mt={2} textAlign="justify" sx={{
              '@media (max-width: 1020px)': {
                width: "90%"
              },
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={license} style={{ height: '50px', width: 'auto' }} />
              </div>
              <SoftTypography variant="overline" color="light" fontWeight="light">
                {t('footer.license_prefix', 'This work is licensed under a ')}
                <Link to="https://creativecommons.org/licenses/by-nc-sa/4.0/" style={{ color: '#add8e6' }}>
                  {t('footer.license_link', ' Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.')}
                </Link>
              </SoftTypography>
            </SoftBox>
            <SoftBox width="30%" mt={2} textAlign="justify" sx={{
              display: 'flex', justifyContent: 'center', alignItems: "center",
              '@media (max-width: 1020px)': {
                width: "90%"
              },
            }}>
              <SoftTypography variant="overline" color="secondary">
                {t('footer.copyright', 'Copyright © 2021 Soft by Creative Tim.')}
              </SoftTypography>
            </SoftBox>
            {/* <SoftBox width="30%" mt={2} textAlign="justify" >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={europe} style={{ height: '50px', width: 'auto' }} /> 
                </div>
        </SoftBox> */}

          </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

export default Footer;
