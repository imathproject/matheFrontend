
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Card from 'react-bootstrap/Card';
import EditView from "../../../SnaQuestion/components/Edit";
import { useApi } from 'api';
import Modal from '@mui/material/Modal';
import AddQuestion from "../AddQuestion";
import { Scrollbar } from 'react-scrollbars-custom';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'

function Question({ level, topic,subtopic, question, status, questionID, onDelete, answers, onEdit, extension, image}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [answerState, setAnswerState] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
    if(image != null) fetchImage(questionID, extension);
    setIsEditing(false);
    setAnswerState(false);
    const handleResize = () => {
    setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
   }, [questionID, image, extension]);
   
   const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
   const margin = windowWidth <= 1020 ? '0px' : '8px';
   const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

   const fetchImage = async (id, extension) => {
    try {
      const response = await api.post('question/downloadImage', {
        id: id,       
        file_ext: extension
      }, { responseType: 'blob' });

      const url = URL.createObjectURL(new Blob([response.data]));
      setImageSrc(url);
    } catch (err) {
      //handle Error
    }
  };

  const ManageQuestion  = () => {
    return(
      <SoftBox
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <SoftButton color="info" onClick={handleOpen}> Review </SoftButton>
    </SoftBox>
    )
  }

  const Answer = () => {
    var color= "#a5eea0"
    return(
      <SoftBox
      flexDirection="column"
      width="100%"
      display="flex"
      borderRadius="xl">
      {answers.map((item, index)=> {
        if(index != 0) color = "#fec4c1";
          return(
          <SoftBox
          key={index}
          mt={1}
          border={1}
          borderRadius={10}
          borderColor={color}
        >
          <SoftBox bgColor={color}  borderRadius={6}>
            <SoftTypography variant="button" fontWeight="bold"  color="#344767" m={1}>
              {index == 0 ? "Correct answer:" : "Incorrect answer:"}
            </SoftTypography>
          </SoftBox>
          <SoftTypography variant="button" fontWeight="regular" color="#344767" m={1}>
              <Latex>{item}</Latex>
          </SoftTypography>      
        </SoftBox>
        )
    })}
      </SoftBox>
    
    )
  }

  function handleSaveQuestion() {
    setOpen(false);
    setImageSrc(null);
    if (image != null) fetchImage(questionID, extension);
    onEdit(topic.id);
  }
  
  
  return (
    <div>
        
      <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <SoftBox sx={{ ...style}}>
           
                <SoftBox m={1} sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom: 1, borderColor: "#3447767", mb: 4}}>
                    <SoftTypography  variant="title" fontWeight="bold" >
                    Validate question
                    </SoftTypography>
                    <SoftButton variant="text" color="dark" onClick={handleClose}>
                      <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
                      <FontAwesomeIcon icon={faX} size="4x"/>
                    </SoftButton>
                </SoftBox>
                <Scrollbar noScrollX style={{ height: "80%" }}>
                <AddQuestion onSave={handleSaveQuestion} questionID={questionID}/>
                </Scrollbar>
            </SoftBox>
        </Modal>
    <Card  border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom, borderRadius: '4%'}}>
        <Card.Body style={{display: 'flex', flexDirection: flexDirection}}>
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
          borderColor:"rgb(52, 71, 103, 0.6)"
      },
    }}
  >
    <SoftBox m={2}>
        <SoftBox  mb={1} lineHeight={0}>
        <SoftTypography variant="h4" fontWeight="bold" color="info" >
          Q {questionID}
        </SoftTypography>
        </SoftBox>
      <SoftBox mb={1} lineHeight={0}>
        <SoftTypography variant="caption" color="info"  fontWeight="medium">
          Topic:&nbsp;&nbsp;&nbsp;
          <SoftTypography variant="caption" fontWeight="medium">
            {topic}
          </SoftTypography>
        </SoftTypography>
      </SoftBox>
      {subtopic && (
      <>
      <SoftBox mb={1} lineHeight={0}>
        <SoftTypography variant="caption" color="info"  fontWeight="medium">
          Subtopic:&nbsp;&nbsp;&nbsp;
          <SoftTypography variant="caption" fontWeight="medium">
            {subtopic}
          </SoftTypography>
        </SoftTypography>
      </SoftBox>
      </>
    )}
        <SoftBox mb={1} lineHeight={0}>
        <SoftTypography variant="caption" color="info" fontWeight="medium">
          Level:&nbsp;&nbsp;&nbsp;
          <SoftTypography variant="caption" fontWeight="medium">
            {level}
          </SoftTypography>
        </SoftTypography>
      </SoftBox>
  </SoftBox>
    
  <SoftBox mr={2}
  sx={{
      '@media (max-width: 1020px)': {
          mr:0
      },
    }}>
    <ManageQuestion/>
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
          ml:0,
          mr:0
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
      imageSrc && <img src={imageSrc} alt={image} width="25%"/>
    )}
  </div>
    <Button variant="contained" sx={{mt:3, mb:3}} color="info" onClick={() => setAnswerState(!answerState)}>
      {answerState ? "Hide Answers" : "Show Answers"}
    </Button>
    {answerState? <Answer/> : null}
  </SoftBox>
  </Card.Body>
    </Card> 
  </div>
  );
}

Question.propTypes = {
  level: PropTypes.number.isRequired,
  topic: PropTypes.string.isRequired,
  subtopic: PropTypes.string,
  question: PropTypes.string.isRequired,
  questionID: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  answers: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired, 
  extension: PropTypes.string,
  image: PropTypes.string
};

export default Question;
