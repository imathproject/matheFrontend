// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import ButtonBase from "@mui/material/ButtonBase";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import { useTranslation } from "react-i18next";

import { getAccent, SECTIONS } from "../../accent";
import { getQuestionSet } from "../../scoring";

// A tile is its picture: out of focus until the pointer or the keyboard lands
// on it. A model that is still to come stays out of focus and cannot be opened.
function ModelTile({ model, description, comingSoon, accent, onSelect }) {
  const available = Boolean(model.questionnaire);

  return (
    <ButtonBase
      disabled={!available}
      onClick={() => onSelect(model)}
      sx={{
        position: "relative",
        display: "block",
        width: "100%",
        height: { xs: "14rem", md: "19rem" },
        borderRadius: "1rem",
        overflow: "hidden",
        isolation: "isolate",
        textAlign: "left",
        boxShadow: "0 0.25rem 0.75rem rgba(20, 23, 39, 0.12)",
        transition: "transform 250ms ease, box-shadow 250ms ease",
        "& .model-image": {
          position: "absolute",
          // Wider than the tile, so the blur has no soft edge to show.
          inset: "-1rem",
          zIndex: -2,
          backgroundImage: `url(${model.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) saturate(0.7)",
          transition: "filter 350ms ease",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(20, 23, 39, 0.85), rgba(20, 23, 39, 0.3) 60%, rgba(20, 23, 39, 0.15))",
        },
        "&:hover, &.Mui-focusVisible": {
          transform: "translateY(-0.25rem)",
          boxShadow: "0 1rem 2rem rgba(20, 23, 39, 0.25)",
          "& .model-image": { filter: "none" },
        },
        "&.Mui-focusVisible": {
          outline: `3px solid ${accent.text}`,
          outlineOffset: "3px",
        },
        "&.Mui-disabled .model-image": {
          filter: "blur(6px) grayscale(1)",
        },
        // Nothing hovers on a touch screen, so there the picture starts sharp.
        "@media (hover: none)": {
          "&:not(.Mui-disabled) .model-image": { filter: "none" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "& .model-image": { transition: "none" },
          "&:hover, &.Mui-focusVisible": { transform: "none" },
        },
      }}
    >
      <SoftBox className="model-image" />
      {!available && (
        <SoftBox
          position="absolute"
          top="1rem"
          right="1rem"
          px={1.5}
          py={0.5}
          borderRadius="md"
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.92)", lineHeight: 1 }}
        >
          <SoftTypography variant="caption" fontWeight="bold" color="dark">
            {comingSoon}
          </SoftTypography>
        </SoftBox>
      )}
      <SoftBox position="absolute" left={0} right={0} bottom={0} p={3}>
        <SoftTypography variant="h4" fontWeight="bold" color="white">
          {model.name}
        </SoftTypography>
        <SoftTypography variant="body2" color="white" opacity={0.9}>
          {description}
        </SoftTypography>
      </SoftBox>
    </ButtonBase>
  );
}

ModelTile.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    questionnaire: PropTypes.object,
  }).isRequired,
  description: PropTypes.string.isRequired,
  comingSoon: PropTypes.string.isRequired,
  accent: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// First step of the screen: which questionnaire to answer.
function ModelSelector({ models, section, onSelect }) {
  const { t } = useTranslation();
  const accent = getAccent(section);

  return (
    <SoftBox>
      <SoftTypography variant="h4" fontWeight="bold">
        {t("learning_style_page.choose_title", "Choose a questionnaire")}
      </SoftTypography>
      <SoftTypography variant="body2" color="text" mb={4}>
        {t(
          "learning_style_page.choose_hint",
          "Answer a few quick questions and see how you prefer to learn."
        )}
      </SoftTypography>
      <SoftBox
        display="grid"
        gap={3}
        sx={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))" }}
      >
        {models.map((model) => (
          <ModelTile
            key={model.id}
            model={model}
            description={t(`learning_style_page.models.${model.id}.description`, {
              total: model.questionnaire ? getQuestionSet(model.questionnaire).length : 0,
            })}
            comingSoon={t("learning_style_page.coming_soon", "Coming soon")}
            accent={accent}
            onSelect={onSelect}
          />
        ))}
      </SoftBox>
    </SoftBox>
  );
}

ModelSelector.propTypes = {
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  section: PropTypes.oneOf(SECTIONS).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ModelSelector;
