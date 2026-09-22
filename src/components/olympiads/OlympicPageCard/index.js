import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

/**
 * The sheet every olympic screen is drawn inside: a full-height card whose
 * content sits in a padded, centered Grid.
 *
 * `header` and `footer` render inside the card but outside the padded Grid —
 * that is where the questions list keeps its Add button and its pagination,
 * both of which sit tighter against the card's edges than its content does.
 *
 * `center` swaps the Grid for a plain centered row, the shape the assessment
 * screen uses while a test is being generated.
 */
function OlympicPageCard({
  children,
  header,
  footer,
  padding = 5,
  mobilePadding,
  center = false,
  sx,
}) {
  return (
    <Card
      sx={{
        minHeight: "80vh",
        mt: 5,
        display: "flex",
        ...(center ? { justifyContent: "center" } : { flexDirection: "column" }),
        ...sx,
      }}
    >
      {header}
      {center ? (
        children
      ) : (
        <Grid
          alignItems="center"
          p={padding}
          sx={
            mobilePadding === undefined
              ? undefined
              : { "@media (max-width: 600px)": { p: mobilePadding } }
          }
        >
          {children}
        </Grid>
      )}
      {footer}
    </Card>
  );
}

OlympicPageCard.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  padding: PropTypes.number,
  mobilePadding: PropTypes.number,
  center: PropTypes.bool,
  sx: PropTypes.object,
};

export default OlympicPageCard;
