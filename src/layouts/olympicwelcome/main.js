import SoftTypography from "components/SoftTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import "./customStyles.css"; // Import your custom CSS file
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import colors from "components/olympiads/colors";

function Main() {
  const { t } = useTranslation();

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Grid
        alignItems="center"
        justifyContent="center"
        p={5}
        sx={{
          "@media (max-width: 600px)": {
            p: 2,
          },
        }}
      >
        <SoftBox sx={{ width: "100%" }}>
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SoftTypography
              variant="h1"
              fontWeight="light"
              mr={1}
              sx={{
                color: colors.brown,
                "@media (max-width: 740px)": {
                  fontSize: "40px",
                },
              }}
            >
              {t('olympiad_welcome_page.welcome_to_the', 'Welcome to the ')}
            </SoftTypography>
            <SoftTypography
              fontWeight="bold"
              sx={{
                background: colors.orangeGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "80px",
                "@media (max-width: 740px)": {
                  fontSize: "50px",
                },
              }}
            >
              {t('olympiad_welcome_page.mathe_olympiads', 'MathE Olympiads!')}
            </SoftTypography>
          </SoftBox>
          <SoftBox
            mb={20}
            sx={{
              color: colors.brown,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              "@media (max-width: 740px)": {
                mb: 10,
              },
            }}
          >
            <SoftTypography
              sx={{
                color: colors.brown,
                "@media (max-width: 740px)": {
                  fontSize: "16px",
                },
              }}
            >
              {" "}
              {t('olympiad_welcome_page.description', 'Here, you will find a variety of resources to aid your study organized by topics and subtopics.')}
            </SoftTypography>
          </SoftBox>

          <SoftBox
            mb={15}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-start",
              "@media (max-width: 740px)": {
                flexDirection: "column",
                mb: 8,
                alignItems: "center",
              },
            }}
          >
            {/* Interactive Tests Button */}
            <SoftBox
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "@media (max-width: 740px)": {
                  width: "100%",
                  mb: 5,
                },
              }}
            >
              <NavLink to={"/Olympiads-Assessment"} key={"assessment"}>
                <FontAwesomeIcon icon={faListCheck} color={colors.lightBrown} className="custom-icon" />
              </NavLink>
              <SoftTypography ml={2}
                sx={{
                  color: colors.brown,
                }}
              >{t('olympiad_welcome_page.interactive_tests', 'Interactive multiple-choice tests')}</SoftTypography>
            </SoftBox>


            {/* Written Materials Button */}
            <SoftBox
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "@media (max-width: 740px)": {
                  width: "100%",
                  mb: 5,
                },
              }}
            >
              <NavLink to={"/Olympiads-Performance"} key={"performance"}>
                <FontAwesomeIcon icon={faChartSimple} color={colors.lightBrown} className="custom-icon" />
              </NavLink>
              <SoftTypography ml={2} sx={{ color: colors.brown }}>
                {t('olympiad_welcome_page.performance', 'Performance')}
              </SoftTypography>
            </SoftBox>
          </SoftBox>

          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SoftTypography mr={1} sx={{ color: colors.brown }}>
              {t('olympiad_welcome_page.we_are_here_to_support', 'We are here to support you in a personalized and self-managed study journey.')}
            </SoftTypography>
            <SoftTypography fontWeight="bold" sx={{ color: colors.brown }} >
              {t('olympiad_welcome_page.welcome_aboard', 'Welcome aboard!')}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </Grid>
    </Card>
  );
}

export default Main;
