import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import OlympicButton from "components/olympiads/OlympicButton";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Card from 'react-bootstrap/Card';
import { useApi } from 'api';
import Modal from '@mui/material/Modal';
import OlympicQuestionForm from "components/olympiads/OlympicQuestionForm";
import { Scrollbar } from 'react-scrollbars-custom';
import COLORS from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

function Question({ question, status, questionID, onDelete, answers, onEdit, extension, image, olympicName, levelName, yearName, phaseName, olympicObj, levelObj, yearObj, phaseObj, keywords, difficulty }) {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [answerState, setAnswerState] = useState(false);
  const api = useApi();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "90%",
    bgcolor: '#FFFFFF',
    boxShadow: 24,
    p: 4,
    borderRadius: 6
  };

  useEffect(() => {
    setImageSrc(null);
    if (image != null) fetchImage(questionID, extension);
    setAnswerState(false);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [questionID, image]);

  const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
  const margin = windowWidth <= 1020 ? '0px' : '8px';
  const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

  const fetchImage = async (id, extension) => {
    try {
      const response = await api.post('olympicQuestion/downloadImage', {
        id: id
      }, { responseType: 'blob' });

      const url = URL.createObjectURL(new Blob([response.data]));
      setImageSrc(url);
    } catch (err) {
      //handle Error
    }
  };

  const ManageQuestion = () => {
    return (
      <SoftBox
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <OlympicButton onClick={handleOpen}> Review </OlympicButton>
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

  function handleSaveQuestion() {
    setOpen(false);
    onEdit();
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox m={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: 1, borderColor: "#3447767", mb: 4 }}>
            <SoftTypography variant="title" fontWeight="bold" >
              Validate Olympic Question
            </SoftTypography>
            <OlympicButton variant="text" tone="neutral" color="dark" onClick={handleClose}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </OlympicButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <OlympicQuestionForm
              mode="edit"
              layout="stacked"
              id={questionID}
              onSave={handleSaveQuestion}
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
              actions={(submit) => (
                <>
                  <SoftButton
                    variant="gradient"
                    color="success"
                    sx={{ width: "15%" }}
                    onClick={() => submit(1)}
                  >
                    Validate
                  </SoftButton>
                  <SoftBox width="100%" display="flex" flexDirection="row" justifyContent="flex-end">
                    <OlympicButton sx={{ width: "15%", mr: 2 }} onClick={() => submit(4)}>
                      Save
                    </OlympicButton>
                    <SoftButton
                      variant="gradient"
                      color="error"
                      sx={{ width: "15%" }}
                      onClick={() => submit(2)}
                    >
                      Refuse
                    </SoftButton>
                  </SoftBox>
                </>
              )}
            />
          </Scrollbar>
        </SoftBox>
      </Modal>
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
                <SoftTypography variant="h4" fontWeight="bold" sx={{ color: COLORS.primaryDark }} >
                  Q {questionID}
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1} lineHeight={0}>
                <SoftTypography variant="caption" sx={{ color: COLORS.primaryDark }} fontWeight="medium">
                  Olympiad:&nbsp;&nbsp;&nbsp;
                  <SoftTypography variant="caption" fontWeight="medium">
                    {olympicName}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1} lineHeight={0}>
                <SoftTypography variant="caption" sx={{ color: COLORS.primaryDark }} fontWeight="medium">
                  Level:&nbsp;&nbsp;&nbsp;
                  <SoftTypography variant="caption" fontWeight="medium">
                    {levelName}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1} lineHeight={0}>
                <SoftTypography variant="caption" sx={{ color: COLORS.primaryDark }} fontWeight="medium">
                  Phase:&nbsp;&nbsp;&nbsp;
                  <SoftTypography variant="caption" fontWeight="medium">
                    {phaseName}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1} lineHeight={0}>
                <SoftTypography variant="caption" sx={{ color: COLORS.primaryDark }} fontWeight="medium">
                  Year:&nbsp;&nbsp;&nbsp;
                  <SoftTypography variant="caption" fontWeight="medium">
                    {yearName}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1} lineHeight={0}>
                <SoftTypography variant="caption" sx={{ color: COLORS.primaryDark }} fontWeight="medium">
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
            <div style={{ padding: '1rem', overflowY: 'auto', width: '100%' }}>
              <SoftTypography
                variant="h6"
                fontWeight="regular">
                <Latex displayMode>{question}</Latex>
              </SoftTypography>
            </div>
            <div style={{ padding: '1rem', overflowY: 'auto', width: '100%' }}>
              {imageSrc && extension === 'pdf' ? (
                <a href={imageSrc} download={image}>Download file</a>
              ) : (
                imageSrc && <img src={imageSrc} alt={image} width="25%" />
              )}
            </div>
            <Button sx={{ mt: 3, mb: 3, p: 1.5, backgroundColor: COLORS.lightBrown, color: COLORS.white, "&:hover": { backgroundColor: COLORS.lightBrown, color: COLORS.white } }} onClick={() => setAnswerState(!answerState)}>
              {answerState ? "Hide Answers" : "Show Answers"}
            </Button>
            {answerState ? <Answer /> : null}
          </SoftBox>
        </Card.Body>
      </Card>
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  questionID: PropTypes.number.isRequired,
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
  olympicName: PropTypes.string,
  levelName: PropTypes.string,
  yearName: PropTypes.number,
  phaseName: PropTypes.string,
  olympicObj: PropTypes.object,
  levelObj: PropTypes.object,
  yearObj: PropTypes.object,
  phaseObj: PropTypes.object,
  keywords: PropTypes.array,
  // 1 to 5, or null when the question has no difficulty set.
  difficulty: PropTypes.number,
};

Question.defaultProps = {
  keywords: [],
  difficulty: null,
};

export default Question;
