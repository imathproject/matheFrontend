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

import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { Scrollbar } from 'react-scrollbars-custom';


// Soft UI Dashboard React examples
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Colors
import { COLORS } from "components/olympiads/colors";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Soft UI Dashboard React context
import { useSoftUIController, setMiniSidenav } from "context";

import { useTranslation } from "react-i18next";
function Sidenav({ color, brand, brandName, routes, onSignOut, ...rest }) {
  const { t } = useTranslation();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];

  const [tabValue, setTabValue] = useState(() => {
    const saved = localStorage.getItem("mathe_platform");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const sharedPaths = ["/profile", "/sign-up", "/homepage"];
    const isShared = sharedPaths.some((p) => pathname.toLowerCase().startsWith(p.toLowerCase()));

    if (pathname.toLowerCase().includes("olympiads")) {
      setTabValue(1);
      localStorage.setItem("mathe_platform", 1);
    } else if (!isShared) {
      setTabValue(0);
      localStorage.setItem("mathe_platform", 0);
    }
  }, [pathname]);

  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(null);

  const handleMenuSelect = (newValue) => {
    setTabValue(newValue);
    localStorage.setItem("mathe_platform", newValue);
    if (newValue === 0) {
      navigate("/welcome");
    } else if (newValue === 1) {
      navigate("/welcome-Olympiads");
    }
    handleCloseMenu();
  };

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Logic to separate "MathE" and "MathE Olympic" routes
  const isOlympicRoute = (route) => {
    if (!route.key && !route.name) return false;
    const searchField = `${route.key || ""} ${route.name || ""}`.toLowerCase();
    return searchField.includes("olympiads");
  };

  const isSharedRoute = (route) => {
    const sharedKeys = ["profile", "sign-up", "homePage", "account-pages"];

    // Specifically handle the welcome pages not to be fully shared if we are trying to separate them visually
    // but typically they might just be hidden from sidenav anyway if type="none".
    return sharedKeys.includes(route.key) || route.type === "none";
  };

  const filteredRoutes = routes.filter((route) => {
    // Keep titles and dividers for now, will clean empty titles later
    if (route.type === "title" || route.type === "divider") return true;

    if (isSharedRoute(route)) return true;

    const isOlympic = isOlympicRoute(route);
    if (tabValue === 0) {
      return !isOlympic;
    } else {
      return isOlympic;
    }
  });

  const cleanedRoutes = filteredRoutes.filter((route, index, array) => {
    if (route.type === "title") {
      // Find if there's any non-title/non-divider item before the next title
      let hasItem = false;
      for (let i = index + 1; i < array.length; i++) {
        if (array[i].type === "title") break;
        if (array[i].type !== "divider") {
          hasItem = true;
          break;
        }
      }
      return hasItem;
    }
    return true;
  });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = cleanedRoutes.map(({ type, name, icon, title, noCollapse, key, route, href, collapse }) => {
    let returnValue;
    const translatedName = key ? t(`sidenavbar.${key}`) : name;
    const displayName = key && translatedName !== `sidenavbar.${key}` ? translatedName : name;

    const translatedTitle = key ? t(`sidenavbar.${key}`) : title;
    const displayTitle = key && translatedTitle !== `sidenavbar.${key}` ? translatedTitle : title;

    if (type === "collapse") {
      if (collapse && collapse.length > 0) {
        returnValue = (
          <NavLink to={route} key={key}>
            <SidenavCollapse
              color={tabValue === 1 ? COLORS.lightBrown : color}
              key={key}
              name={displayName}
              icon={icon}
              noCollapse={noCollapse}
              collapse={collapse}
              open={false}
            />
          </NavLink>

        );
      } else {
        returnValue = (
          <NavLink to={route} key={key}>
            <SidenavCollapse
              color={tabValue === 1 ? COLORS.lightBrown : color}
              key={key}
              name={displayName}
              icon={icon}
              active={key && collapseName && key.toLowerCase() === collapseName.toLowerCase()}
              noCollapse={noCollapse}
            />
          </NavLink>
        );
      }
    } else if (type === "title") {
      returnValue = (
        <SoftTypography
          key={key}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          opacity={0.6}
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {displayTitle}
        </SoftTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider key={key} />;
    }

    return returnValue;
  });

  const signOutBg =
    tabValue === 1
      ? COLORS.lightBrown
      : "linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)";

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <SoftBox component={NavLink} to={tabValue === 0 ? "/welcome" : "/welcome-Olympiads"} display="flex" alignItems="center">
            {brand && <SoftBox component="img" src={brand} alt="Soft UI Logo" width="2rem" />}
            <SoftBox
              width={!brandName && "100%"}
              sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            >
              <SoftTypography component="h6" variant="button" fontWeight="medium">
                {brandName}
              </SoftTypography>
            </SoftBox>
          </SoftBox>

          <SoftBox
            display="flex"
            alignItems="center"
            onClick={handleOpenMenu}
            sx={(theme) => ({
              cursor: "pointer",
              ml: 0.5,
              ...sidenavLogoLabel(theme, { miniSidenav })
            })}
          >
            <SoftTypography variant="button" fontWeight="medium" color="text">
              {tabValue === 0 ? t("sidenavbar.higher_education") : t("sidenavbar.olympiads")}
            </SoftTypography>
            <Icon fontSize="small" sx={{ ml: 0.5 }}>expand_more</Icon>
          </SoftBox>
        </SoftBox>

        <Menu
          anchorEl={openMenu}
          open={Boolean(openMenu)}
          onClose={handleCloseMenu}
          sx={{ mt: 2 }}
        >
          <MenuItem onClick={() => handleMenuSelect(0)} selected={tabValue === 0}>
            {t("sidenavbar.higher_education")}
          </MenuItem>
          <MenuItem onClick={() => handleMenuSelect(1)} selected={tabValue === 1}>
            {t("sidenavbar.olympiads")}
          </MenuItem>
        </Menu>
      </SoftBox>
      <Divider />

      {/* The Tab Selector has been removed and replaced with a Dropdown Menu above. */}

      <Scrollbar noScrollX >
        <List>{renderRoutes}</List>
      </Scrollbar>
      <SoftBox pt={2} my={2} mx={2} mt="auto">
        <SoftBox mt={2}>
          <SoftButton
            variant="gradient"
            color="info"
            sx={{
              background: signOutBg,
              "&:hover, &:focus, &:focus:not(:hover)": {
                background: signOutBg,
              },
            }}
            fullWidth
            onClick={onSignOut}
          >
            {t("sidenavbar.sign_out", "SIGN OUT")}
          </SoftButton>
        </SoftBox>
      </SoftBox>
      <SoftBox m={1} sx={{ width: "10px", display: "flex", flexDirection: "column" }}>
        <SoftTypography fontWeight="light" variant="overline" sx={{ fontSize: "10px", letterSpacing: "-0.5px" }}>
          MIT License Copyright (c) 2021
        </SoftTypography>
        <Link href="https://www.creative-tim.com/?_ga=2.159173946.1204419450.1709057245-676324523.1701972154" target="_blank" sx={{ marginTop: "-5px" }}>
          <SoftTypography variant="button" fontWeight="medium" sx={{ fontSize: "10px", letterSpacing: "-0.5px" }}>Creative Tim</SoftTypography>
        </Link>
      </SoftBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSignOut: PropTypes.func,
};

export default Sidenav;
