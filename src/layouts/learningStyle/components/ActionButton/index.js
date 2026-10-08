// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftButton from "components/SoftButton";

import OlympicButton from "components/olympiads/OlympicButton";

import { SECTIONS } from "../../accent";

// The button of whichever section the screen is in: the Olympiads button in
// the Olympiads, the blue one in Higher Education.
function ActionButton({ section, variant = "contained", children, ...rest }) {
  if (section === "olympiads") {
    return (
      <OlympicButton variant={variant} {...rest}>
        {children}
      </OlympicButton>
    );
  }

  return (
    <SoftButton variant={variant === "contained" ? "gradient" : variant} color="info" {...rest}>
      {children}
    </SoftButton>
  );
}

ActionButton.propTypes = {
  section: PropTypes.oneOf(SECTIONS).isRequired,
  variant: PropTypes.oneOf(["contained", "text"]),
  children: PropTypes.node.isRequired,
};

export default ActionButton;
