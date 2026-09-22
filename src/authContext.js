const BASE_URL = process.env.REACT_APP_MATHE_API;
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(localStorage.getItem("name") || null);
  const [surname, setSurname] = useState(localStorage.getItem("surname") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(localStorage.getItem("completeProfile") || null);
  const [expiredModel, setExpiredModel] = useState(localStorage.getItem("expiredModel") || false);
  const [authLoading, setAuthLoading] = useState(true);

  const role = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return String(decoded?.userInfo?.roles ?? "");
    } catch {
      return null;
    }
  }, [token]);

  // IPB: Remove in the next production release. This is only for development purposes to clear the local storage on page refresh.
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("oldUser");
    localStorage.removeItem("type");
  }, []);

  // IPB: This useEffect is used to check if the user has an active session by calling the refreshToken endpoint.
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await fetch(BASE_URL + "auth/refreshToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("No active session");
        }

        const data = await response.json();
        setToken(data.accessToken);
      } catch (error) {
        setToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const login = (name, surname, email, profile, token) => {
    setName(name);
    setSurname(surname);
    setEmail(email);
    setProfile(profile);
    setToken(token);
    setExpiredModel(false);

    localStorage.setItem("name", name);
    localStorage.setItem("surname", surname);
    localStorage.setItem("email", email);
    localStorage.setItem("completeProfile", profile);

    const origin = location.pathname || "/welcome";
    navigate(origin, { replace: true });
  };

  const logout = () => {
    setToken(null);
    setExpiredModel(false);
    localStorage.removeItem("name");
    localStorage.removeItem("surname");
    localStorage.removeItem("email");
    localStorage.removeItem("completeProfile");
  };

  return (
    <AuthContext.Provider
      value={{
        name,
        surname,
        email,
        role,
        profile,
        token,
        authLoading,
        expiredModel,
        setToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
