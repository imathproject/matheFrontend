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

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Soft UI Dashboard React examples
import Sidenav from "examples/Sidenav";

// Soft UI Dashboard React themes
import theme from "assets/theme";

//Import SingIn
import SignIn from "layouts/authentication/sign-in";
import ConfirmEmail from "layouts/confirmEmail";
import RecoverPassword from "layouts/authentication/recoverPassword";
import NewPassword from "layouts/authentication/newPassword";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";

//Routes
import teacherRoutes from "routes/routes";
import reviewerRoutes from "routes/reviewerRoutes";
import notVerifiedLecturerRoutes from "routes/notVerifiedLecturers";
import studentRoutes from "routes/studentRoutes";
import completeProfileRoute from "routes/completeProfileRoutes";
import completeTeacherProfileRoute from "routes/completeTeacherProfileRoutes";
import adminRoutes from "routes/adminRoutes";
import HomePage from "layouts/homePage";
import { ROLES } from "constants/roles";
import OlympicHomePage from "layouts/OlympicHomePage";
import HigherEducationHomePage from "layouts/HigherEducationHomePage";
import NewsDetail from "layouts/newsDetail";
import NotFound from "layouts/notFound";

// Soft UI Dashboard React contexts
import { useSoftUIController, setMiniSidenav } from "context";

// Images
import brand from "assets/images/matheLogo.png";

import { ProtectedRoute } from "routes/protectedRoutes";
import { useAuth } from "./authContext";
import { logoutRequest } from "services/auth";

const routesForType = (typeFinal, profileIncomplete) => {
  if (profileIncomplete) {
    return typeFinal == 5584 ? completeProfileRoute : completeTeacherProfileRoute;
  }
  if (typeFinal == 7811) return adminRoutes;
  if (typeFinal == 5139) return teacherRoutes;
  if (typeFinal == 8079) return reviewerRoutes;
  if (typeFinal == 4367) return notVerifiedLecturerRoutes;
  return studentRoutes;
};

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { name, surname, email, role, profile, logout, token, authLoading } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState(null);
  const { i18n } = useTranslation();

  // Update routes when the role changes
  useEffect(() => {
    if (profile == 0) {
      setRoutes(role == ROLES.STUDENT ? completeProfileRoute : completeTeacherProfileRoute);
    } else if (role != null) {
      if (role == ROLES.STUDENT) setRoutes(studentRoutes);
      if (role == ROLES.ADMIN) setRoutes(adminRoutes);
      if (role == ROLES.LECTURE) setRoutes(teacherRoutes);
      if (role == ROLES.LECTURE_REVIEWER) setRoutes(reviewerRoutes);
      if (role == ROLES.LECTURER_NOT_VERIFIED) setRoutes(notVerifiedLecturerRoutes);
    }
    //IPB: Verificar isto
    if (role && role != ROLES.STUDENT) {
      i18n.changeLanguage("en");
    }
  }, [role, profile]);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleLoginSuccess = (p, roleAtLogin) => {
    //IPB: Verificar isto
    if (roleAtLogin && roleAtLogin != ROLES.STUDENT) {
      i18n.changeLanguage("en");
    }
    setIsLoggedIn(true);
    if (!p) {
      setRoutes(roleAtLogin == ROLES.STUDENT ? completeProfileRoute : completeTeacherProfileRoute);
      navigate("/profile", { replace: true });
    } else {
      if (roleAtLogin == ROLES.STUDENT) setRoutes(studentRoutes);
      if (roleAtLogin == ROLES.ADMIN) setRoutes(adminRoutes);
      if (roleAtLogin == ROLES.LECTURE) setRoutes(teacherRoutes);
      if (roleAtLogin == ROLES.LECTURE_REVIEWER) setRoutes(reviewerRoutes);
      if (roleAtLogin == ROLES.LECTURER_NOT_VERIFIED) setRoutes(notVerifiedLecturerRoutes);
      navigate("/choose-platform", { replace: true });
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    logoutRequest();
    logout();
    navigate("/", { replace: true });
  };

  const getIndexRoute = () => {
    if (token) {
      if (!isLoggedIn) {
        return <Route index element={<Navigate to="/homePage" />} />;
      } else {
        const completeProfile = localStorage.getItem("completeProfile");
        var route;
        completeProfile == 0 ? (route = "/profile") : (route = "/choose-platform");
        return (
          <Route
            index
            element={
              <ProtectedRoute>
                <Navigate to={route} />
              </ProtectedRoute>
            }
          />
        );
      }
    } else {
      return <Route index element={<Navigate to="/homePage" />} />;
    }
  };

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    (allRoutes || []).map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  if (authLoading) {
    return null;
  }

  if (token && routes === null) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn && pathname !== "/choose-platform" && (
        <Sidenav
          color={sidenavColor}
          brand={brand}
          brandName="MathE"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onSignOut={handleSignOut}
        />
      )}
      <Routes>
        <Route
          exact
          path="/sign-in"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  localStorage.getItem("completeProfile") == 0
                    ? "/profile"
                    : "/choose-platform"
                }
              />
            ) : (
              <SignIn onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          exact
          path="/homePage"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  localStorage.getItem("completeProfile") == 0
                    ? "/profile"
                    : "/welcome"
                }
              />
            ) : (
              <HomePage />
            )
          }
        />

        <Route
          exact
          path="/olympicHomePage"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  localStorage.getItem("completeProfile") == 0
                    ? "/profile"
                    : "/choose-platform"
                }
              />
            ) : (
              <OlympicHomePage />
            )
          }
        />

        <Route
          exact
          path="/higherEducationHomePage"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  localStorage.getItem("completeProfile") == 0
                    ? "/profile"
                    : "/choose-platform"
                }
              />
            ) : (
              <HigherEducationHomePage />
            )
          }
        />

        <Route
          exact
          path="/homePage"
          element={isLoggedIn ? <Navigate to="/welcome" /> : <HomePage />}
        />
        {getRoutes(routes)}
        {getIndexRoute()}
        <Route exact path="/news/:id" element={<NewsDetail />} />
        <Route exact path="/confirmEmail" element={<ConfirmEmail />} />
        <Route exact path="/newPassword" element={<NewPassword />} />
        <Route exact path="/recoverPassword" element={<RecoverPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
