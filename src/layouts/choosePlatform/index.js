import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Images
import brand from "assets/images/matheLogo.png";
import olympic_choose from "assets/images/olympic_choose.png";
import card2 from "assets/images/card2.jpg";
import { useAuth } from "authContext";

function ChoosePlatform() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSelectPlatform = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <PageLayout background="white">
      <SoftBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={6}
        px={3}
      >
        <SoftBox mb={4} textAlign="center">
          <SoftBox component="img" src={brand} alt="MathE Logo" width="100px" mb={2} />
          <SoftTypography variant="h3" fontWeight="bold" color="dark">
            {t("choose_platform.welcome", "Welcome to MathE!")}
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            {t("choose_platform.subtitle", "Please select your learning environment to continue.")}
          </SoftTypography>
        </SoftBox>

        <SoftBox width="100%" maxWidth="900px">
          <Grid container spacing={4} justifyContent="center">
            {/* Higher Education Card */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },
                  height: "100%",
                }}
                onClick={() => handleSelectPlatform("/welcome")}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={card2}
                  alt={t("choose_platform.higher_education", "Higher Education")}
                  sx={{ objectFit: 'cover', objectPosition: 'top' }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                    {t("choose_platform.higher_education", "Higher Education")}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    {t("choose_platform.he_desc", "Access courses, materials, and assessments for higher education students and educators.")}
                  </SoftTypography>
                </CardContent>
              </Card>
            </Grid>

            {/* Olympic Card */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },
                  height: "100%",
                }}
                onClick={() => handleSelectPlatform("/welcome-Olympiads")}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={olympic_choose}
                  alt={t("choose_platform.olympiads", "Olympiads")}
                  sx={{ objectFit: 'cover', objectPosition: 'top' }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                    {t("choose_platform.olympiads", "Olympiads")}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    {t("choose_platform.olympiads_desc", "Prepare for competitions with specialized challenges, quizzes, and performance tracking.")}
                  </SoftTypography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mt={6}>
          <SoftButton variant="gradient" color="info" onClick={logout} >
            {t("choose_platform.sign_out", "Sign Out")}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </PageLayout>
  );
}

export default ChoosePlatform;
