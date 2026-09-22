import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import { useEffect, useState } from "react";
import QuestionCard from "../QuestionCard";

//Fontawesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faFaceSmileBeam, faFaceLaughBeam } from '@fortawesome/free-solid-svg-icons'
import SoftTypography from "components/SoftTypography";
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { COLORS } from "components/olympiads/colors";
import OlympicButton from "components/olympiads/OlympicButton";
import { useTranslation } from "react-i18next";

function TestReview({ answers, ids, questions: initialQuestions }) {
  const [questions, setQuestions] = useState([]);
  const [performanceMessage, setPerformanceMessage] = useState("");
  const [performanceIcon, setPerformanceIcon] = useState();
  const [average, setAverage] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    setQuestions(initialQuestions || []);
    calculateAverage();
  }, [answers]);

  const calculateAverage = () => {
    const correctAnswersCount = answers.filter(item => item.encodedAnswer === 1).length;
    const percentageCorrectAnswers = (correctAnswersCount / answers.length) * 100;
    setAverage(percentageCorrectAnswers);

    // Determine performance message based on the percentage
    if (percentageCorrectAnswers < 55) {
      setPerformanceMessage(t("olympic_assessment_page.message_1", "Your performance is not good, and it would be advisable to go back to the theory."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceFrown} color={COLORS.primary} size="3x" />);
    } else if (percentageCorrectAnswers >= 55 && percentageCorrectAnswers <= 80) {
      setPerformanceMessage(t("olympic_assessment_page.message_2", "Your performance is good, but you still have room for improvement."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceSmileBeam} color={COLORS.primary} size="3x" />);
    } else {
      setPerformanceMessage(t("olympic_assessment_page.message_3", "Congratulations, your performance is excellent."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceLaughBeam} color={COLORS.primary} size="3x" />);
    }
  };

  return (
    <SoftBox>
      <SoftBox display="flex" flexDirection="row" justifyContent="space-between" mb={4} mt={2}
        sx={{
          '@media (max-width: 700px)': {
            flexDirection: "column"
          },
        }}>
        <SoftBox display="flex" flexDirection="row">
          <SoftBox mr={2}>
            {performanceIcon}
          </SoftBox>
          <SoftBox>
            <SoftTypography variant="a" fontWeight="bold" sx={{ color: COLORS.brown }}>
              {t("olympic_assessment_page.average", "Your assessment average was")} {average}%
            </SoftTypography>
            <SoftTypography>
              {performanceMessage}
            </SoftTypography>
          </SoftBox>

        </SoftBox>

        <OlympicButton
          sx={{ width: "150px", height: "50%" }}
          onClick={() => window.location.reload()}
        >
          {t("olympic_assessment_page.new_test", "New test")} &nbsp;
          <FontAwesomeIcon icon={faArrowsRotate} size="2x" />
        </OlympicButton>
      </SoftBox>
      {questions.map((key, index) => {
        const a = answers[index]?.answer;
        const q = key.question;
        const r = answers[index]?.correctText || "";

        const processedQuestion = q.replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        const processedAnswer = (a || "").replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        const processedRight = r.replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        return (
          <QuestionCard key={index} question={processedQuestion} right={processedRight} answer={processedAnswer} />
        );
      })}
    </SoftBox>
  );
}

TestReview.defaultProps = {
  noGutter: false,
};

TestReview.propTypes = {
  answers: PropTypes.arrayOf(Object).isRequired,
  ids: PropTypes.array.isRequired,
  questions: PropTypes.array,
  noGutter: PropTypes.bool,
};

export default TestReview;
