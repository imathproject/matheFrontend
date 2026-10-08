import { useMemo, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import Header from "./components/Header";
import ModelSelector from "./components/ModelSelector";
import Questionnaire from "./components/Questionnaire";
import Results from "./components/Results";
import { SECTIONS } from "./accent";
import models from "./models";
import { calculateResults, getQuestionSet } from "./scoring";

// The Learning Style screen, shared by Higher Education and the Olympiads:
// choose a questionnaire, answer it, see the profile. `section` only decides
// the colors.
//
// TODO: nothing is saved yet. The answers live in this component until there
// is an endpoint to send them to, so the result is gone once the screen is left.
function LearningStyle({ section = "higherEducation" }) {
  const [model, setModel] = useState(null);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const questionnaire = model ? model.questionnaire : null;
  const questionSet = useMemo(
    () => (questionnaire ? getQuestionSet(questionnaire) : []),
    [questionnaire]
  );

  const restart = (nextModel) => {
    setAnswers({});
    setFinished(false);
    setModel(nextModel);
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((current) => ({ ...current, [questionId]: option }));
  };

  let content;
  if (!model) {
    content = <ModelSelector models={models} section={section} onSelect={restart} />;
  } else if (finished) {
    content = (
      <Results
        questionnaire={questionnaire}
        results={calculateResults(questionnaire, questionSet, answers)}
        section={section}
        onRetake={() => restart(model)}
        onChooseAnother={() => restart(null)}
      />
    );
  } else {
    content = (
      <Questionnaire
        questionnaire={questionnaire}
        questionSet={questionSet}
        answers={answers}
        section={section}
        onAnswer={handleAnswer}
        onFinish={() => setFinished(true)}
        onExit={() => restart(null)}
      />
    );
  }

  return (
    <DashboardLayout>
      <Header section={section} />
      <Card sx={{ minHeight: "80vh", mt: 5 }}>
        <SoftBox p={{ xs: 3, md: 5 }}>{content}</SoftBox>
      </Card>
    </DashboardLayout>
  );
}

LearningStyle.propTypes = {
  section: PropTypes.oneOf(SECTIONS),
};

export default LearningStyle;
