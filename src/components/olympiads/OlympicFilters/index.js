import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAutocomplete from "components/AutoComplete";
import { COLORS } from "components/olympiads/colors";
import useOlympicFilters from "components/olympiads/useOlympicFilters";
import { useTranslation } from "react-i18next";

const FIELDS = [
  { key: "olympic", i18nKey: "olympiad", fallback: "Olympiad" },
  { key: "level", i18nKey: "level", fallback: "Level" },
  { key: "phase", i18nKey: "phase", fallback: "Phase" },
  { key: "year", i18nKey: "year", fallback: "Year" },
];

// How the four fields are distributed across flex rows.
const ROWS = {
  row: [FIELDS],
  column: [FIELDS],
  grid: [FIELDS.slice(0, 2), FIELDS.slice(2)],
};

/**
 * The olympiad / level / phase / year filter block.
 *
 * `layout` covers the three shapes the screens ask for: "row" lines all four
 * up, "column" stacks them (the edit form's narrow sidebar), "grid" is the
 * two-by-two the assessment screen uses.
 *
 * `footer` renders inside the last field's column, under its input — that is
 * where the assessment keeps its Start button.
 *
 * `onChange` receives the whole selection as an object. It used to be four
 * positional arguments in an order that did not match the on-screen order of
 * the dropdowns, which is a bug waiting to be written.
 */
function OlympicFilters({
  onChange,
  layout = "row",
  enriched = false,
  restrictToAvailable = false,
  required = [],
  errors = {},
  initialValue,
  footer,
  emptyNotice = false,
}) {
  const { t } = useTranslation();
  const { value, options, select, hasNoQuestions } = useOlympicFilters({
    enriched,
    restrictToAvailable,
    initialValue,
    onChange,
  });

  const isColumn = layout === "column";
  const rows = ROWS[layout] || ROWS.row;
  const lastKey = FIELDS[FIELDS.length - 1].key;

  return (
    <SoftBox display="flex" mb={2} mr={1} flexDirection="column" alignItems="flex-start">
      {rows.map((fields, rowIndex) => (
        <SoftBox
          key={rowIndex}
          width="100%"
          display="flex"
          flexDirection={isColumn ? "column" : "row"}
          mb={layout === "grid" ? 0 : 3}
          sx={{
            "@media (max-width: 600px)": {
              flexDirection: "column",
            },
          }}
        >
          {fields.map((field, index) => (
            <SoftBox
              key={field.key}
              width={isColumn ? "100%" : "50%"}
              ml={index > 0 && !isColumn ? 1 : 0}
              mb={isColumn ? 2 : 0}
              display="flex"
              flexDirection="column"
              sx={{
                "@media (max-width: 600px)": {
                  width: "100%",
                  ml: 0,
                  mb: 2,
                },
              }}
            >
              <SoftTypography
                sx={{ color: errors[field.key] ? COLORS.error : COLORS.brown }}
                fontWeight="bold"
                marginTop={layout === "grid" ? 0 : 2}
              >
                {t(`olympic_assessment_page.${field.i18nKey}`, field.fallback)}
                {required.includes(field.key) ? "*" : ""}
              </SoftTypography>
              <SoftAutocomplete
                onNewValueSelected={(option) => select(field.key, option)}
                options={options[field.key]}
                selected={value[field.key]}
              />
              {field.key === lastKey ? footer : null}
            </SoftBox>
          ))}
        </SoftBox>
      ))}

      {emptyNotice && hasNoQuestions && (
        <SoftBox width="100%" mt={1}>
          <SoftTypography variant="button" fontWeight="light" sx={{ color: COLORS.error }}>
            {t(
              "olympic_assessment_page.no_questions_for_olympiad",
              "This olympiad has no validated questions yet, so no test can be generated."
            )}
          </SoftTypography>
        </SoftBox>
      )}
    </SoftBox>
  );
}

OlympicFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(["row", "column", "grid"]),
  enriched: PropTypes.bool,
  restrictToAvailable: PropTypes.bool,
  required: PropTypes.arrayOf(PropTypes.oneOf(["olympic", "level", "phase", "year"])),
  errors: PropTypes.object,
  initialValue: PropTypes.object,
  footer: PropTypes.node,
  emptyNotice: PropTypes.bool,
};

export default OlympicFilters;
