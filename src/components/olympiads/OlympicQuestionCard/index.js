import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import OlympicButton from "components/olympiads/OlympicButton";
import OlympicStatusBadge from "components/olympiads/OlympicStatusBadge";
import OlympicQuestionForm from "components/olympiads/OlympicQuestionForm";
import QuestionStatement from "components/olympiads/QuestionStatement";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Card from 'react-bootstrap/Card';
import { useApi } from 'api';
import Modal from '@mui/material/Modal';
import COLORS from "components/olympiads/colors";
import { useTranslation } from "react-i18next";
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

/**
 * One question in an olympic listing: its metadata and status down the left,
 * the statement and its answers on the right, and the edit form in its place
 * once the reader opens it.
 *
 * `canManage` decides whether delete and edit are offered, and the rule behind
 * it belongs to the screen, not here — the admin listing grants it by role,
 * while the author's own listing grants it only for a question that has not
 * been approved yet. The server enforces its own owner check either way.
 */
function OlympicQuestionCard({ question, status, questionID, onDelete, answers, onEdit, extension, image, olympicName, levelName, yearName, phaseName, olympicObj, levelObj, yearObj, phaseObj, canManage, keywords, difficulty, showStatus = true }) {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // A question that was never put through the validation flow arrives with
  // validate = 0 (or null); it still belongs in this list, with its own badge.
  const statusValue = Number(status) || 0;
  const [answerState, setAnswerState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const api = useApi();

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "60%",
    bgcolor: '#FFFFFF',
    boxShadow: 24,
    p: 4,
    borderRadius: 6
  };

  useEffect(() => {
    setIsEditing(false);
    setAnswerState(false);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [questionID, image]);


  const handleEditQuestion = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setIsEditing(!isEditing);
    onEdit(questionID);
  }

  const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
  const margin = windowWidth <= 1020 ? '0px' : '8px';
  const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

  async function handleDeleteQuestion() {
    try {
      handleClose();
      await api.delete(`olympicQuestion/delete/${questionID}`);
      onDelete(questionID);
    } catch (error) {
      // Handle error
    }
  }

  const ManageQuestion = () => {
    return (
      <SoftBox
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {showStatus && <OlympicStatusBadge status={statusValue} />}
        <SoftBox justifyContent="center" display="flex" mt={showStatus ? 2 : 0} mb={2}>
          {canManage ?
            <OlympicButton variant="text" onClick={() => { handleOpen() }}>
              <FontAwesomeIcon icon={faTrash} size="xs" />&nbsp;delete
            </OlympicButton> : null
          }
          {canManage ?
            <OlympicButton variant="text" onClick={handleEditQuestion}>
              <FontAwesomeIcon icon={faPen} size="xs" />&nbsp;edit
            </OlympicButton>
            :
            null
          }
        </SoftBox>
      </SoftBox>
    )
  }

  const Answer = () => {
    var color = "#a5eea0"
    return (
      <SoftBox
        flexDirection="column"
        width="100%"
        display="flex"
        borderRadius="xl">
        {answers.map((item, index) => {
          if (index != 0) color = "#fec4c1";
          return (
            <SoftBox
              key={item.id ?? index}
              mt={1}
              border={1}
              borderRadius={10}
              borderColor={color}
            >
              <SoftBox bgColor={color} borderRadius={6}>
                <SoftTypography variant="button" fontWeight="bold" color="#344767" m={1}>
                  {index == 0 ? "True answer:" : "False answer:"}
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="button" fontWeight="regular" color="#344767" m={1}>
                <Latex>{item.text || ""}</Latex>
              </SoftTypography>
            </SoftBox>
          )
        })}
      </SoftBox>

    )
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="olympic-question-delete-title"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200" />
            <SoftTypography id="olympic-question-delete-title" variant="h4" mt={3}> Are you sure you want to delete the  question Nº{questionID}? </SoftTypography>
            <SoftTypography variant="h6" fontWeight="light"> You won&apos;t be able to revert this! </SoftTypography>

            <SoftBox
              mt={4}
              display="flex"
              width="100%"
              flexDirection="row"
              justifyContent="space-around"
            >
              <SoftButton
                variant="gradient"
                color="error"
                sx={{ width: "30%" }}
                onClick={handleDeleteQuestion}
              >
                Yes, delete it!
              </SoftButton>
              <OlympicButton
                variant="outlined"
                tone="neutral"
                sx={{ width: "30%" }}
                onClick={handleClose}
              >
                Cancel
              </OlympicButton>

            </SoftBox>
          </SoftBox>

        </SoftBox>
      </Modal>
      {!isEditing ? (
        <Card border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom, borderRadius: '4%' }}>
          <Card.Body style={{ display: 'flex', flexDirection: flexDirection }}>
            <SoftBox
              width="25%"
              display="flex"
              borderRight={1}
              borderColor="rgb(52, 71, 103, 0.6)"
              flexDirection="column"
              justifyContent="space-between"
              mb={2}
              sx={{
                '@media (max-width: 1020px)': {
                  width: "100%",
                  borderRight: 0,
                  borderBottom: 1,
                  borderColor: "rgb(52, 71, 103, 0.6)"
                },
              }}
            >
              <SoftBox m={2}>
                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="h4" fontWeight="bold" sx={{ color: COLORS.brown }} >
                    Q {questionID}
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="caption" sx={{ color: COLORS.brown }} fontWeight="medium">
                    Olympic:&nbsp;&nbsp;&nbsp;
                    <SoftTypography variant="caption" fontWeight="medium">
                      {olympicName}
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>

                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="caption" sx={{ color: COLORS.brown }} fontWeight="medium">
                    Level:&nbsp;&nbsp;&nbsp;
                    <SoftTypography variant="caption" fontWeight="medium">
                      {levelName}
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>

                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="caption" sx={{ color: COLORS.brown }} fontWeight="medium">
                    Year:&nbsp;&nbsp;&nbsp;
                    <SoftTypography variant="caption" fontWeight="medium">
                      {yearName}
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>

                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="caption" sx={{ color: COLORS.brown }} fontWeight="medium">
                    Phase:&nbsp;&nbsp;&nbsp;
                    <SoftTypography variant="caption" fontWeight="medium">
                      {phaseName}
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>

                <SoftBox mb={1} lineHeight={0}>
                  <SoftTypography variant="caption" sx={{ color: COLORS.brown }} fontWeight="medium">
                    {t("olympic_questions_page.difficulty", "Difficulty")}:&nbsp;&nbsp;&nbsp;
                    <SoftTypography variant="caption" fontWeight="medium">
                      {difficulty ?? "—"}
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>
              </SoftBox>

              <SoftBox mr={2}
                sx={{
                  '@media (max-width: 1020px)': {
                    mr: 0
                  },
                }}>
                <ManageQuestion />
              </SoftBox>
            </SoftBox>
            <SoftBox
              width="75%"
              display="flex"
              justifyContent="space-around"
              alignItems="flex-start"
              flexDirection="column"
              m={2}
              sx={{
                '@media (max-width: 1020px)': {
                  width: "100%",
                  ml: 0,
                  mr: 0
                },
              }}
            >
              <QuestionStatement
                questionId={questionID}
                question={question}
                fileName={image}
                extension={extension}
              />
              <Button variant="contained" sx={{ mt: 3, mb: 3 }} color="warning" onClick={() => setAnswerState(!answerState)}>
                {answerState ? "Hide Answers" : "Show Answers"}
              </Button>
              {answerState ? <Answer /> : null}
            </SoftBox>
          </Card.Body>
        </Card>
      ) : (
        <OlympicQuestionForm
          mode="edit"
          layout="split"
          id={questionID}
          onSave={handleSaveEdit}
          initialQuestion={question}
          initialAnswers={answers}
          initialOlympic={olympicObj}
          initialLevel={levelObj}
          initialYear={yearObj}
          initialPhase={phaseObj}
          initialExtension={extension}
          initialImage={image}
          initialKeywords={keywords}
          initialDifficulty={difficulty}
          actions={(submit) =>
            statusValue === 1 ? (
              // Editing an approved question re-approves it. Sending it back
              // through the queue would silently pull a live question out of
              // the tests, which is what used to happen here.
              <SoftButton
                variant="gradient"
                color="success"
                sx={{ width: "10%" }}
                onClick={() => submit(1)}
              >
                Save
              </SoftButton>
            ) : (
              <>
                <SoftButton
                  variant="gradient"
                  color="success"
                  sx={{ width: "10%" }}
                  onClick={() => submit(3, { require: "none" })}
                >
                  Save
                </SoftButton>
                <OlympicButton sx={{ width: "10%" }} onClick={() => submit(4)}>
                  Submit
                </OlympicButton>
              </>
            )
          }
        />
      )}
    </div>
  );
}

OlympicQuestionCard.propTypes = {
  olympicName: PropTypes.string,
  levelName: PropTypes.string,
  yearName: PropTypes.string,
  phaseName: PropTypes.string,
  olympicObj: PropTypes.object,
  levelObj: PropTypes.object,
  yearObj: PropTypes.object,
  phaseObj: PropTypes.object,
  question: PropTypes.string.isRequired,
  questionID: PropTypes.number.isRequired,
  status: PropTypes.number,
  onDelete: PropTypes.func,
  // `{ id, text }` rows, the true answer first. The id is what lets the form
  // save an alternative without the server issuing it a new one.
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  extension: PropTypes.string,
  image: PropTypes.string,
  canManage: PropTypes.bool,
  keywords: PropTypes.array,
  // 1 to 5, or null when the question has no difficulty set.
  difficulty: PropTypes.number,
  showStatus: PropTypes.bool,
};

OlympicQuestionCard.defaultProps = {
  canManage: false,
  keywords: [],
  difficulty: null,
  showStatus: true,
};

export default OlympicQuestionCard;
