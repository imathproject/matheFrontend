import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftRadioButton from "../RadioButton";
import QuestionStatement from "components/olympiads/QuestionStatement";

function Question({ questionID, question, options, onClickAnswer, image, extension }) {
  const handleChangeAnswer = (originalIndex, answerText, optionObj) => {
    onClickAnswer(originalIndex, answerText, optionObj);
  };

  return (
    <SoftBox display="flex">
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftBox
          width="100%"
          display="flex"
          flexDirection="column"
          mb={2}
          bgColor="grey-100"
          borderRadius="lg"
          p={2}
          mt={2}
        >
          <QuestionStatement
            questionId={questionID}
            question={question}
            fileName={image}
            extension={extension}
          />
        </SoftBox>
        <SoftBox width="100%">
          <div style={{ padding: '1rem', overflowY: 'auto' }}>
            <SoftRadioButton key={questionID} onNewValueSelected={handleChangeAnswer} options={options} />
          </div>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

Question.propTypes = {
  questionID: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onClickAnswer: PropTypes.func.isRequired,
  image: PropTypes.string,
  extension: PropTypes.string
};

export default Question;
