// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";

// Images
import back3 from "assets/images/background3.jpg";

import { SECTIONS } from "../../accent";

// The banner at the top of the screen: the Olympiads one in the Olympiads and
// the blue one of the Higher Education screens everywhere else.
function Header({ section }) {
  const { t } = useTranslation();
  const title = t("learning_style_page.title", "Learning Style");

  if (section === "olympiads") {
    return <OlympicPageHeader title={title} />;
  }

  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="9.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${back3})`,
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
        <Grid container alignItems="center" justifyContent="center">
          <Grid item mb={1} mt={1}>
            <SoftBox justifyContent="center" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="bold" color="info">
                {title}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
  );
}

Header.propTypes = {
  section: PropTypes.oneOf(SECTIONS).isRequired,
};

export default Header;
