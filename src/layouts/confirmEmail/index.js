

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

// react-router-dom components
import {useNavigate, useSearchParams} from "react-router-dom";


// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "./components/BasicLayout"
import backgroud from "assets/images/tessera4.jpg";

//API
import { updateEmail } from "services/user";

function ConfirmEmail() {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    const checkcode = queryParameters.get("checkcode")

    useEffect(() => {
        if(!checkcode) navigate("/", { replace: true });
        confirmEmail(checkcode);
      }, [checkcode]);


    async function confirmEmail(checkcode) {
        try {
          const data = await updateEmail(checkcode);
    
        } catch (error) {
          navigate("/", { replace: true })
        }
    }
    
  return (
    <BasicLayout
      title=""
      description=""
      image={backgroud}
    >
      <Card>
            <SoftBox p={3} mb={1} textAlign="center">
            <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
                Thank You!
            </SoftTypography>
            <SoftTypography>
                Your email has been verified with success.
            </SoftTypography>
            </SoftBox>
        <SoftBox p={3} mb={1} textAlign="center">
            <SoftTypography>
                You can now sign in to your account and enjoy math!
            </SoftTypography>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={() => { navigate("/sign-in", { replace: true })}} >
                Login Page
              </SoftButton>
            </SoftBox>
          </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default ConfirmEmail;
