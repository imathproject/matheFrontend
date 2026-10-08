// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";

// Colors
import { COLORS } from "components/olympiads/colors";

// The screen is the same in Higher Education and in the Olympiads; only the
// accent changes. `fill` paints bars and markers, `text` is the accent that is
// readable on white, and `soft` is the tint behind a selected option.
const accents = {
  higherEducation: {
    fill: `linear-gradient(310deg, ${colors.gradients.info.main}, ${colors.gradients.info.state})`,
    text: colors.info.main,
    soft: "#e9f5fb",
  },
  olympiads: {
    fill: COLORS.lightBrown,
    text: COLORS.brown,
    soft: "#fef4e4",
  },
};

export const SECTIONS = Object.keys(accents);

export function getAccent(section) {
  return accents[section] || accents.higherEducation;
}
