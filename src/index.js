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
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { AuthProvider } from "./authContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import './i18n';

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <BrowserRouter>
    <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_SITE_KEY}>
      <SoftUIControllerProvider>
      <AuthProvider>
        <Suspense fallback={<div>Loading translations...</div>}>
        <App />
        </Suspense>
    </AuthProvider>
      </SoftUIControllerProvider>
    </GoogleReCaptchaProvider>
  </BrowserRouter>

);
