import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import COLORS from "components/olympiads/colors";

// The same 1 to 5 scale the regular questions use, easiest first.
export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5];

/**
 * The difficulty of an olympic question, as given by whoever writes it.
 *
 * The value is an integer from `DIFFICULTY_LEVELS` or `null` for "not set"
 * (`value` in, `onChange(value)` out). A slider always holds a value, so the
 * levels are exclusive toggles instead: clicking the selected one again hands
 * back `null`, which is how the field is cleared.
 */
function OlympicDifficultyField({ value, onChange, error }) {
  const { t } = useTranslation();
  const label = t("olympic_questions_page.difficulty", "Difficulty");

  return (
    <SoftBox width="100%" mb={3} sx={{ minWidth: 0 }}>
      <SoftTypography sx={{ color: error ? COLORS.error : COLORS.brown }} fontWeight="bold">
        {label}
      </SoftTypography>
      <SoftTypography variant="caption" color="text" sx={{ display: "block", mb: 1 }}>
        {t(
          "olympic_questions_page.difficulty_hint",
          "Optional. Click the selected value again to clear it."
        )}
      </SoftTypography>
      <SoftBox display="flex" alignItems="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
        <SoftTypography variant="caption" color="text">
          {t("olympic_questions_page.difficulty_easier", "Easier")}
        </SoftTypography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={value}
          // With `exclusive`, MUI hands back null when the selected level is
          // clicked again.
          onChange={(event, next) => onChange(next)}
          aria-label={label}
        >
          {DIFFICULTY_LEVELS.map((level) => (
            <ToggleButton
              key={level}
              value={level}
              aria-label={String(level)}
              sx={{
                minWidth: "40px",
                fontWeight: "bold",
                color: COLORS.brown,
                borderColor: error ? COLORS.error : COLORS.primary,
                "&:hover": { backgroundColor: COLORS.primary, color: COLORS.white },
                "&.Mui-selected, &.Mui-selected:hover": {
                  backgroundColor: COLORS.primaryDark,
                  color: COLORS.white,
                },
              }}
            >
              {level}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <SoftTypography variant="caption" color="text">
          {t("olympic_questions_page.difficulty_hardest", "Most difficult")}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

OlympicDifficultyField.propTypes = {
  /** The selected level, or null when no difficulty is set. */
  value: PropTypes.oneOf(DIFFICULTY_LEVELS),
  /** Called with the new level, or with null when the selection is cleared. */
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
};

OlympicDifficultyField.defaultProps = {
  value: null,
  error: false,
};

export default OlympicDifficultyField;
