import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { COLORS } from "components/olympiads/colors";

/**
 * Centered "nothing to show here" panel: a headline, an optional line of
 * detail, and an optional call to action underneath.
 */
function OlympicEmptyState({ message, description, action }) {
  return (
    <SoftBox align="center" m={2} p={5}>
      <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold" mb={1}>
        {message}
      </SoftTypography>
      {description && (
        <SoftTypography variant="button" fontWeight="light" color="text">
          {description}
        </SoftTypography>
      )}
      {action && (
        <SoftBox mt={4} display="flex" justifyContent="center">
          {action}
        </SoftBox>
      )}
    </SoftBox>
  );
}

OlympicEmptyState.propTypes = {
  message: PropTypes.node.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
};

export default OlympicEmptyState;
