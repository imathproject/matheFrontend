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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftButton from "components/SoftButton";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Images
import back2 from "assets/images/backgroud2.jpg";

function Header({ name, role, typology, onEdit, onPassword, onTestimonial }) {
  const { t, i18n } = useTranslation();
  const [languageMenu, setLanguageMenu] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageMenu(null);
  };

  const openLanguageMenu = (event) => setLanguageMenu(event.currentTarget);
  const closeLanguageMenu = () => setLanguageMenu(null);
  const [profileImage, setProfileImage] = useState(null);
  const [currentView, setCurrentView] = useState("information");
  const [editButtonClicked, setEditButtonClicked] = useState(false);

  const handleEditClickEdit = () => {
    setCurrentView("edit");
    setEditButtonClicked(true);
    if (onEdit) {
      onEdit();
    }
  };

  const handleEditClickPassword = () => {
    setCurrentView("password");
    setEditButtonClicked(true);
    if (onPassword) {
      onPassword();
    }
  };

  const handleTestimonial = () => {
    setCurrentView("testimonial");
    setEditButtonClicked(true);
    if (onTestimonial) {
      onTestimonial();
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
          {editButtonClicked ? null : (
            <Grid item lg={8} sx={{ ml: "auto" }} display="flex" flexDirection="row">

              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleEditClickEdit}
                sx={{ mr: 3 }}
              >
                {t("profile_page.edit_button", "Edit")}
              </SoftButton>

              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleEditClickPassword}
                sx={{ mr: 3 }}
              >
                {t("profile_page.new_password_button", "New Password")}
              </SoftButton>

              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={openLanguageMenu}
                sx={{ mr: 3 }}
              >
                {t('profile_page.site_language', 'Language')}: {i18n.language === 'pt' ? 'PORTUGUÊS' : 'ENGLISH'}
              </SoftButton>
              <Menu
                anchorEl={languageMenu}
                open={Boolean(languageMenu)}
                onClose={closeLanguageMenu}
              >
                <MenuItem onClick={() => changeLanguage('en')}>
                  <ReactCountryFlag countryCode="GB" svg style={{ marginRight: '8px' }} />
                  English
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('pt')}>
                  <ReactCountryFlag countryCode="PT" svg style={{ marginRight: '8px' }} />
                  Português
                </MenuItem>
              </Menu>

              <SoftButton
                variant="gradient"
                color="dark"
                fullWidth
                onClick={handleTestimonial}

              >
                {t("profile_page.testimonial_button")}
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
  onEdit: PropTypes.func,
  onPassword: PropTypes.func,
  onTestimonial: PropTypes.func
};

export default Header;
