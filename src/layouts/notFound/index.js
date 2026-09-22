import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useAuth } from "authContext";

// Every role mounts its own route table, so an address that role has no entry for
// used to match nothing at all and leave the page blank. It lands here instead.
function NotFound() {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!userId;

  const content = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        mt: 5,
      }}
    >
      <Card sx={{ width: "40%", minWidth: 300, padding: 2, textAlign: "center", boxShadow: 3 }}>
        <CardContent>
          <FontAwesomeIcon icon={faCompass} size="2x" color="#8392ab" />
          <SoftTypography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
            {t("not_found.title", "Page not found")}
          </SoftTypography>
          <SoftTypography variant="body2" sx={{ mt: 2 }}>
            {t(
              "not_found.description",
              "This page does not exist, or your account does not have access to it."
            )}
          </SoftTypography>
          <SoftBox mt={3}>
            <SoftButton
              variant="gradient"
              color="info"
              onClick={() => navigate(isLoggedIn ? "/choose-platform" : "/homePage")}
            >
              {t("not_found.back", "Back to MathE")}
            </SoftButton>
          </SoftBox>
        </CardContent>
      </Card>
    </Box>
  );

  // The dashboard shell only makes sense next to the sidenav, which App only
  // renders once someone is signed in.
  return isLoggedIn ? <DashboardLayout>{content}</DashboardLayout> : content;
}

export default NotFound;
