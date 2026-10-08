// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import { useTranslation } from "react-i18next";

import ActionButton from "../ActionButton";
import { getAccent, SECTIONS } from "../../accent";

// "Active, Visual and Global", with the joining word of the language in use.
function formatList(items, language) {
  if (typeof Intl !== "undefined" && Intl.ListFormat) {
    return new Intl.ListFormat(language, { type: "conjunction" }).format(items);
  }
  return items.join(", ");
}

// One dimension: its two poles at the ends of a line and a marker where the
// answers landed, with a sentence about the side they lean to.
function DimensionScale({ result, poleName, intensity, summary, accent }) {
  // Kept off the very ends, so the marker is never cut by the line's edge.
  const position = Math.min(97, Math.max(3, 50 + result.lean * 50));

  return (
    <SoftBox>
      <SoftBox display="flex" justifyContent="space-between" mb={1.5}>
        {[result.left, result.right].map((pole) => (
          <SoftTypography
            key={pole}
            variant="button"
            fontWeight={result.pole === pole ? "bold" : "regular"}
            color={result.pole === pole ? "dark" : "text"}
          >
            {poleName(pole)}
          </SoftTypography>
        ))}
      </SoftBox>
      <SoftBox
        position="relative"
        height="0.5rem"
        borderRadius="md"
        sx={{ backgroundColor: ({ palette: { light } }) => light.main }}
      >
        <SoftBox
          position="absolute"
          top={0}
          bottom={0}
          borderRadius="md"
          sx={{
            left: `${Math.min(50, position)}%`,
            width: `${Math.abs(position - 50)}%`,
            background: accent.fill,
            opacity: 0.35,
          }}
        />
        <SoftBox
          position="absolute"
          top="-0.25rem"
          bottom="-0.25rem"
          left="50%"
          width="2px"
          sx={{ backgroundColor: ({ palette: { secondary } }) => secondary.main, opacity: 0.5 }}
        />
        <SoftBox
          position="absolute"
          top="50%"
          width="1.25rem"
          height="1.25rem"
          borderRadius="50%"
          sx={{
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            background: accent.fill,
            border: "3px solid #fff",
            boxShadow: "0 0.125rem 0.375rem rgba(20, 23, 39, 0.3)",
          }}
        />
      </SoftBox>
      <SoftTypography variant="body2" color="text" mt={1.5}>
        <SoftTypography component="span" variant="body2" fontWeight="bold" color="dark">
          {intensity}.
        </SoftTypography>{" "}
        {summary}
      </SoftTypography>
    </SoftBox>
  );
}

DimensionScale.propTypes = {
  result: PropTypes.shape({
    left: PropTypes.string.isRequired,
    right: PropTypes.string.isRequired,
    lean: PropTypes.number.isRequired,
    pole: PropTypes.string,
  }).isRequired,
  poleName: PropTypes.func.isRequired,
  intensity: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  accent: PropTypes.object.isRequired,
};

// Last step of the screen: the profile in one line, then one scale per
// dimension.
function Results({ questionnaire, results, section, onRetake, onChooseAnother }) {
  const { t, i18n } = useTranslation();
  const accent = getAccent(section);

  const poleName = (pole) => t(`${questionnaire.i18nKey}.poles.${pole}.name`);
  const preferences = results
    .filter((result) => result.pole)
    .map((result) => poleName(result.pole));

  return (
    <SoftBox maxWidth="40rem" mx="auto">
      <SoftTypography variant="button" fontWeight="medium" color="text">
        {t("learning_style_page.result_title", "Your learning profile")}
      </SoftTypography>
      <SoftTypography variant="h3" fontWeight="bold" mt={0.5} mb={5} sx={{ color: accent.text }}>
        {preferences.length
          ? formatList(preferences, i18n.language)
          : t("learning_style_page.result_balanced", "Balanced")}
      </SoftTypography>

      <SoftBox display="flex" flexDirection="column" gap={4}>
        {results.map((result) => (
          <DimensionScale
            key={result.id}
            result={result}
            poleName={poleName}
            intensity={t(`learning_style_page.intensity.${result.intensity}`)}
            summary={
              result.pole
                ? t(`${questionnaire.i18nKey}.poles.${result.pole}.summary`)
                : t("learning_style_page.balanced_summary", "You are comfortable with both.")
            }
            accent={accent}
          />
        ))}
      </SoftBox>

      <SoftTypography variant="body2" color="text" mt={5}>
        {t("learning_style_page.result_note", "These are preferences, not limits.")}
      </SoftTypography>
      <SoftBox display="flex" flexWrap="wrap" alignItems="center" gap={1} mt={2}>
        <ActionButton section={section} onClick={onRetake}>
          {t("learning_style_page.retake", "Retake questionnaire")}
        </ActionButton>
        <ActionButton section={section} variant="text" onClick={onChooseAnother}>
          {t("learning_style_page.choose_another", "Choose another questionnaire")}
        </ActionButton>
      </SoftBox>
    </SoftBox>
  );
}

Results.propTypes = {
  questionnaire: PropTypes.shape({ i18nKey: PropTypes.string.isRequired }).isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  section: PropTypes.oneOf(SECTIONS).isRequired,
  onRetake: PropTypes.func.isRequired,
  onChooseAnother: PropTypes.func.isRequired,
};

export default Results;
