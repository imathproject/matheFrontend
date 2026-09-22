// @mui material components
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Colors
import { COLORS } from "components/olympiads/colors";

// Images
import profileBack from "assets/images/olympicProfileBack.jpg";

/**
 * Hero banner shared by the olympic screens. Callers pass an already
 * translated `title`, so a screen decides its own i18n key. Without a
 * `title` only a shorter banner is drawn, with no title card over it.
 */
function OlympicPageHeader({ title }) {
  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight={title ? "9.75rem" : "5.75rem"}
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient } }) =>
            `${linearGradient(
              rgba(COLORS.darkOrange, 0.6),
              rgba(COLORS.lightBrown, 0.6)
            )}, url(${profileBack})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      {title && (
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
                <SoftTypography variant="h5" fontWeight="bold" sx={{ color: COLORS.brown }}>
                  {title}
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </Card>
      )}
    </SoftBox>
  );
}

OlympicPageHeader.propTypes = {
  title: PropTypes.node,
};

OlympicPageHeader.defaultProps = {
  title: null,
};

export default OlympicPageHeader;
