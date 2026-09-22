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

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
import mathe from "assets/images/matheLogo.png";
import matheLogoText from "assets/images/matheLogoText.png";

function DefaultNavbar({ transparent, light, action }) {
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const { t, i18n } = useTranslation();
  const [languageMenu, setLanguageMenu] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageMenu(null);
  };

  const openLanguageMenu = (event) => setLanguageMenu(event.currentTarget);
  const closeLanguageMenu = () => setLanguageMenu(null);

  const openMobileNavbar = ({ currentTarget }) => setMobileNavbar(currentTarget.parentNode);
  const closeMobileNavbar = () => setMobileNavbar(false);

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /** 
     The event listener that's calling the displayMobileNavbar function when 
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  return (
    <Container>
      <SoftBox
        py={1.5}
        px={{ xs: transparent ? 4 : 5, sm: transparent ? 2 : 5, lg: transparent ? 0 : 5 }}
        my={2}
        mx={3}
        width="calc(100% - 48px)"
        borderRadius="section"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        left={0}
        zIndex={3}
        sx={({ palette: { transparent: transparentColor, white }, functions: { rgba } }) => ({
          backgroundColor: transparent ? transparentColor.main : rgba(white.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        })}
      >
        <SoftBox display="flex" alignItems="center" py={transparent ? 1.5 : 0.75} lineHeight={1}>
          <SoftBox component="img" src={mathe} alt="MathE Logo" width="40px" />

          <SoftBox
            component="img"
            src={matheLogoText}
            alt="MathE"
            height="34px"
            ml={0}
            sx={{
              filter: light ? "brightness(0) invert(1)" : "none",
            }}
          />
        </SoftBox>
        <SoftBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
          <DefaultNavbarLink
            icon="home"
            name={t('navbar.home_nav', 'home')}
            route="/homePage"
            light={light}
          />
          <DefaultNavbarLink
            icon="account_circle"
            name={t('navbar.sign_up_nav', 'sign up')}
            route="/sign-up"
            light={light}
          />
          <DefaultNavbarLink
            icon="person"
            name={t('navbar.sign_in_nav', 'sign in')}
            route="/sign-in" //route="/authentication/sign-in"
            light={light}
          />
          <SoftBox display="flex" alignItems="center" ml={2}>
            <SoftButton variant="text" color={light ? "white" : "dark"} onClick={openLanguageMenu} sx={{ px: 1 }}>
              {t('navbar.site_language', 'Language')}: {i18n.language === 'pt' ? 'PORTUGUÊS' : 'ENGLISH'} <Icon sx={{ ml: 0.5 }}>keyboard_arrow_down</Icon>
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
          </SoftBox>
        </SoftBox>
        {/* <SoftBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
          <DefaultNavbarLink icon="donut_large" name="dashboard" route="" light={light} />
          <DefaultNavbarLink icon="person" name="profile" route="" light={light} />
          <DefaultNavbarLink
            icon="account_circle"
            name="sign up"
            route=""
            light={light}
          />
        </SoftBox> */}
        {action &&
          (action.type === "internal" ? (
            <SoftBox display={{ xs: "none", lg: "inline-block" }}>
              <SoftButton
                component={Link}
                to={action.route}
                variant="gradient"
                color={action.color ? action.color : "info"}
                size="small"
                circular
              >
                {action.label}
              </SoftButton>
            </SoftBox>
          ) : (
            <SoftBox display={{ xs: "none", lg: "inline-block" }}>
              <SoftButton
                component="a"
                href={action.route}
                target="_blank"
                rel="noreferrer"
                variant="gradient"
                color={action.color ? action.color : "info"}
                size="small"
                circular
              >
                {action.label}
              </SoftButton>
            </SoftBox>
          ))}
        <SoftBox
          display={{ xs: "inline-block", lg: "none" }}
          lineHeight={0}
          py={1.5}
          pl={1.5}
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={openMobileNavbar}
        >
          <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
        </SoftBox>
      </SoftBox>
      {mobileView && <DefaultNavbarMobile open={mobileNavbar} close={closeMobileNavbar} />}
    </Container>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  transparent: false,
  light: false,
  action: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbar;
