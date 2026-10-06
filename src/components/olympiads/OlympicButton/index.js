import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import { COLORS } from "components/olympiads/colors";

// How each palette lands on each SoftButton variant. "contained" fills; the
// other two keep the surface clear and tint the label instead, which is what
// the inline delete/edit actions looked like before they moved here.
//
// `danger` follows the same shape with the error red in place of the brand
// orange, and hovers to `brown` — the palette's darker red — the way the brand
// tones hover to their own darker step.
const PALETTES = {
  brand: {
    contained: {
      background: COLORS.lightBrown,
      color: COLORS.white,
      "&:hover": { background: COLORS.primaryDark },
      "&:disabled": { background: COLORS.lightBrown, color: COLORS.white },
    },
    text: {
      background: "transparent",
      color: COLORS.lightBrown,
      "&:hover": { background: "transparent", color: COLORS.brown },
    },
    outlined: {
      background: "transparent",
      color: COLORS.lightBrown,
      borderColor: COLORS.lightBrown,
      "&:hover": {
        background: "transparent",
        color: COLORS.primaryDark,
        borderColor: COLORS.primaryDark,
      },
    },
  },
  danger: {
    contained: {
      background: COLORS.error,
      color: COLORS.white,
      "&:hover": { background: COLORS.brown },
      "&:disabled": { background: COLORS.error, color: COLORS.white },
    },
    text: {
      background: "transparent",
      color: COLORS.error,
      "&:hover": { background: "transparent", color: COLORS.brown },
    },
    outlined: {
      background: "transparent",
      color: COLORS.error,
      borderColor: COLORS.error,
      "&:hover": {
        background: "transparent",
        color: COLORS.brown,
        borderColor: COLORS.brown,
      },
    },
  },
};

/**
 * The call-to-action button of the olympic screens.
 *
 * It replaces the `linear-gradient(230deg, #f0a844 0%, #f0a844 100%)` literal
 * that was pasted onto every one of them — a gradient with the same colour at
 * both stops, i.e. a flat fill sitting one hex off the brand token.
 *
 * `tone="neutral"` opts out of the palettes and leaves SoftButton's own styling
 * alone: that is the shape a Cancel sitting next to a destructive action wants.
 * `tone="danger"` is the destructive action itself.
 *
 * A neutral button defaults to `color="dark"`: SoftButton's own default is
 * white, which draws an outlined or text button white on white.
 */
function OlympicButton({ children, variant = "contained", tone = "brand", color, sx, ...rest }) {
  const palette = PALETTES[tone];
  const toneSx = palette ? palette[variant] || palette.contained : null;
  const colorProps = color || tone === "neutral" ? { color: color || "dark" } : {};

  return (
    <SoftButton variant={variant} sx={{ ...toneSx, ...sx }} {...colorProps} {...rest}>
      {children}
    </SoftButton>
  );
}

OlympicButton.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  tone: PropTypes.oneOf(["brand", "danger", "neutral"]),
  color: PropTypes.string,
  sx: PropTypes.object,
};

export default OlympicButton;
