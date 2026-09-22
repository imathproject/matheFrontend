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
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Images
import back2 from "assets/images/backgroud2.jpg";

function Header({
  name,
  role,
  typology,
  showActions = true,
  onEdit,
  onPassword,
  onTestimonial,
  onReviewerOlympics,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [currentView, setCurrentView] = useState("information");

  const handleEditClickEdit = () => {
    setCurrentView("edit");
    if (onEdit) {
      onEdit();
    }
  };

  const handleEditClickPassword = () => {
    setCurrentView("password");
    if (onPassword) {
      onPassword();
    }
  };

  const handleTestimonial = () => {
    setCurrentView("testimonial");
    if (onTestimonial) {
      onTestimonial();
    }
  };

  const handleReviewerOlympics = () => {
    setCurrentView("reviewerOlympics");
    if (onReviewerOlympics) {
      onReviewerOlympics();
    }
  };

  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${back2})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={profileImage}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {name}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {role}
              </SoftTypography>
            </SoftBox>
          </Grid>
          {showActions && (
            <Grid
              item
              lg={6}
              sx={{
                ml: "auto",
                "@media (max-width: 510px)": {
                  flexDirection: "column",
                },
              }}
              display="flex"
              flexDirection="row"
            >
              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleEditClickEdit}
                sx={{
                  mr: 3,
                  "@media (max-width: 510px)": {
                    mr: 0,
                    mt: 2,
                  },
                }}
              >
                Edit
              </SoftButton>

              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleEditClickPassword}
                sx={{
                  mr: 3,
                  "@media (max-width: 510px)": {
                    mr: 0,
                    mt: 2,
                  },
                }}
              >
                New Password
              </SoftButton>

              {/* Only a reviewer has olympiads to declare; the server enforces it too. */}
              {role === "Lecturer Reviewer" && (
                <SoftButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleReviewerOlympics}
                  sx={{
                    mr: 3,
                    "@media (max-width: 510px)": {
                      mr: 0,
                      mt: 2,
                    },
                  }}
                >
                  Olympiads
                </SoftButton>
              )}

              <SoftButton
                variant="gradient"
                color="dark"
                fullWidth
                onClick={handleTestimonial}
                sx={{
                  mr: 3,
                  "@media (max-width: 510px)": {
                    mr: 0,
                    mt: 2,
                  },
                }}
              >
                Testimonial
              </SoftButton>
            </Grid>
          )}
        </Grid>
      </Card>
    </SoftBox>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  typology: PropTypes.number.isRequired,
  // The profile's buttons, hidden while one of their views is open.
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onPassword: PropTypes.func,
  onTestimonial: PropTypes.func,
  onReviewerOlympics: PropTypes.func,
};

export default Header;
