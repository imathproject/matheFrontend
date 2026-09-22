import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import { useEffect, useState } from "react";
import QuestionCard from "../QuestionCard";
import { useApi } from 'api';

//Fontawesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown, faFaceSmileBeam, faFaceLaughBeam } from '@fortawesome/free-solid-svg-icons'
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";


function TestReview({ answers, ids }) {
  const [questions, setQuestions] = useState([]);
  const [performanceMessage, setPerformanceMessage] = useState("");
  const [performanceIcon, setPerformanceIcon] = useState();
  const [average, setAverage] = useState();
  const api = useApi();
  const { t } = useTranslation();
  useEffect(() => {
    console.log(answers);
    console.log(ids);
    calculateAverage();
    getQuestionData();
  }, [answers]);

  const calculateAverage = () => {
    const correctAnswersCount = answers.filter(item => item.idAnswer == 0).length;
    const percentageCorrectAnswers = (correctAnswersCount / answers.length) * 100;
    setAverage(percentageCorrectAnswers);
    console.log("Percentage of correct answers:", percentageCorrectAnswers);

    // Determine performance message based on the percentage
    if (percentageCorrectAnswers < 55) {
      setPerformanceMessage(t("challenge.message_1", "Your performance is not good, and it would be advisable to go back to the theory."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceFrown} color="#0578b7" size="3x" />);
    } else if (percentageCorrectAnswers >= 55 && percentageCorrectAnswers <= 80) {
      setPerformanceMessage(t("challenge.message_2", "Your performance is good, but you still have room for improvement."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceSmileBeam} color="#0578b7" size="3x" />);
    } else {
      setPerformanceMessage(t("challenge.message_3", "Congratulations, your performance is excellent."));
      setPerformanceIcon(<FontAwesomeIcon icon={faFaceLaughBeam} color="#0578b7" size="3x" />);
    }
  };

  async function getQuestionData() {
    const postData = { ids: ids };
    try {
      const data = await api.post("question/getByIds", postData);
      setQuestions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

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
            <SoftTypography variant="a" color="primary" fontWeight="bold">
              {t("challenge.average", "Your challenge average was")} {average}%
            </SoftTypography>
            <SoftTypography>
              {performanceMessage}
            </SoftTypography>
          </SoftBox>

        </SoftBox>

        <SoftButton variant="gradient" color="info" sx={{ widht: "50px", height: "50%" }} onClick={() => window.location.reload()} >
          {t("challenge.new_test", "New test")}
          <FontAwesomeIcon icon={faArrowsRotate} size="2x" />
        </SoftButton>
      </SoftBox>
      {questions.map((key, index) => {
        var a = answers[index].answer;
        const q = key.question;
        const r = key.answer1;

        const processedQuestion = q.replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        const processedAnswer = a.replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        const processedRight = r.replace(/\\\[/g, '$').replace(/\\\]/g, '$');
        return (
          <QuestionCard key={index} question={processedQuestion} right={processedRight} answer={processedAnswer} keys={key.platform__keywords} />
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
  noGutter: PropTypes.bool,
};

export default TestReview;
