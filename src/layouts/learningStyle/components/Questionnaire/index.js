import { useEffect, useRef, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import ButtonBase from "@mui/material/ButtonBase";
import { keyframes } from "@mui/material/styles";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

//Fontawesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

import ActionButton from "../ActionButton";
import { getAccent, SECTIONS } from "../../accent";

// Long enough to see which option was picked before the next question shows.
const ADVANCE_DELAY = 250;

const OPTIONS = ["a", "b"];

const questionIn = keyframes({
  from: { opacity: 0, transform: "translateY(0.5rem)" },
  to: { opacity: 1, transform: "none" },
});

// One question at a time. Picking an option moves on to the next question by
// itself; only the last one waits for the button, so the result is never one
// stray click away.
function Questionnaire({
  questionnaire,
  questionSet,
  answers,
  section,
  onAnswer,
  onFinish,
  onExit,
}) {
  const { t } = useTranslation();
  const accent = getAccent(section);
  const [index, setIndex] = useState(0);
  const questionRef = useRef(null);
  const advanceTimer = useRef(null);
  const firstQuestionShown = useRef(false);

  const total = questionSet.length;
  const question = questionSet[index];
  const answer = answers[question.id];
  const isLast = index === total - 1;
  const answered = questionSet.filter(({ id }) => answers[id]).length;
  const questionKey = `${questionnaire.i18nKey}.questions.q${question.id}`;

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // A new question replaces the buttons that had the focus, so the focus goes
  // to its text and the options come next for the keyboard.
  useEffect(() => {
    if (firstQuestionShown.current) {
      questionRef.current?.focus();
    }
    firstQuestionShown.current = true;
  }, [index]);

  const handleSelect = (option) => {
    onAnswer(question.id, option);
    clearTimeout(advanceTimer.current);
    if (!isLast) {
      advanceTimer.current = setTimeout(() => setIndex((current) => current + 1), ADVANCE_DELAY);
    }
  };

  const handleBack = () => {
    clearTimeout(advanceTimer.current);
    if (index === 0) {
      onExit();
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <SoftBox maxWidth="40rem" mx="auto">
      <SoftTypography variant="button" fontWeight="medium" color="text">
        {t("learning_style_page.progress", "Question {{current}} of {{total}}", {
          current: index + 1,
          total,
        })}
      </SoftTypography>
      <SoftBox
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        mt={1}
        mb={5}
        height="0.375rem"
        borderRadius="md"
        sx={{ backgroundColor: ({ palette: { light } }) => light.main, overflow: "hidden" }}
      >
        <SoftBox
          height="100%"
          borderRadius="md"
          sx={{
            width: `${(answered / total) * 100}%`,
            background: accent.fill,
            transition: "width 300ms ease",
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        />
      </SoftBox>

      <SoftBox
        key={question.id}
        minHeight={{ xs: 0, md: "16rem" }}
        sx={{
          animation: `${questionIn} 220ms ease`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <SoftTypography
          ref={questionRef}
          tabIndex={-1}
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{ outline: "none" }}
        >
          {t(`${questionKey}.text`)}
        </SoftTypography>
        <SoftBox display="flex" flexDirection="column" gap={1.5}>
          {OPTIONS.map((option) => {
            const selected = answer === option;

            return (
              <ButtonBase
                key={option}
                aria-pressed={selected}
                onClick={() => handleSelect(option)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  width: "100%",
                  px: 3,
                  py: 2.25,
                  textAlign: "left",
                  borderRadius: "0.75rem",
                  border: "2px solid",
                  borderColor: ({ palette: { light } }) => (selected ? accent.text : light.main),
                  backgroundColor: selected ? accent.soft : "transparent",
                  transition: "border-color 150ms ease, background-color 150ms ease",
                  "&:hover": { borderColor: accent.text, backgroundColor: accent.soft },
                  "&.Mui-focusVisible": {
                    outline: `3px solid ${accent.text}`,
                    outlineOffset: "2px",
                  },
                }}
              >
                <SoftTypography variant="body2" fontWeight="medium" color="dark">
                  {t(`${questionKey}.${option}`)}
                </SoftTypography>
                {/* The mark keeps its room when it is not there, so the text does not move. */}
                <SoftBox width="1rem" flexShrink={0} lineHeight={1} sx={{ color: accent.text }}>
                  {selected && <FontAwesomeIcon icon={faCheck} />}
                </SoftBox>
              </ButtonBase>
            );
          })}
        </SoftBox>
      </SoftBox>

      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <ActionButton section={section} variant="text" onClick={handleBack}>
          {t("learning_style_page.back", "Back")}
        </ActionButton>
        {isLast && (
          <ActionButton section={section} disabled={!answer} onClick={onFinish}>
            {t("learning_style_page.see_result", "See my result")}
          </ActionButton>
        )}
      </SoftBox>
    </SoftBox>
  );
}

Questionnaire.propTypes = {
  questionnaire: PropTypes.shape({ i18nKey: PropTypes.string.isRequired }).isRequired,
  questionSet: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })).isRequired,
  answers: PropTypes.object.isRequired,
  section: PropTypes.oneOf(SECTIONS).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
};

export default Questionnaire;
