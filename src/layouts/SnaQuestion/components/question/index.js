
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
 
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'

function Question({ level, topic, subtopic, question, status, questionID, onDelete, answers, onEdit, extension, image}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const statusIcon = ([
        {id:1, status: "Accepted", color:"#56a36b", textColor:"success"},
        {id:2, status: "Not Accepted", color:"#cc0900", textColor:"error"},
        {id:3, status: "In Progress", color:"info", textColor:"info"},
        {id:4, status: "Waiting for validation", color:"#FFB200", textColor:"warning"},
    ]);
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
      justifyContent:"center",
      bgcolor: '#FFFFFF',
      boxShadow: 24,
      p: 4,
      borderRadius: 6
    };

  useEffect(() => {
    setIsEditing(false);
    setAnswerState(false);
    setImageSrc(null);
    if(image != null) fetchImage(questionID, extension);
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
    onEdit(topic.id);
   }

   const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
   const margin = windowWidth <= 1020 ? '0px' : '8px';
   const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

  async function handleDeleteQuestion() {
    try {
      // const data = await api.get("question/delete/"+questionID);
      const data = await api.post("question/delete", {id: questionID, file_ext: extension});
      setOpen(false)
      onDelete(questionID); 
    } catch (error) {
      // Handle error
    }
  }

  const fetchImage = async (id, extension) => {
    try {
      const response = await api.post('question/downloadImage', {
        id: id,       
        file_ext: extension
      }, { responseType: 'blob' });

      const url = URL.createObjectURL(new Blob([response.data]));
      setImageSrc(url);
    } catch (err) {
      //Error handling
    }
  };

  const ManageQuestion  = () => {
    return(
      <SoftBox
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {statusIcon.map((item) =>{
        if(item.id == status){
          return(
            <SoftBox key={item.id} bgColor={item.color} borderRadius="lg" flexDirection="row" display="flex" justifyContent="center" width="50" mb={2}>
            <SoftTypography variant="button" fontWeight="bold" color="white" mt={1} mb={1}>
                    {item.status}
            </SoftTypography>
            </SoftBox>
          )
        }
      })}
       <SoftBox justifyContent="center" display="flex" mt={2} mb={2}>
       { status == 2 || status == 3 ?
        <SoftButton variant="text" color="info" onClick={() => {handleOpen()}}>
          <FontAwesomeIcon icon={faTrash} size="xs"/>&nbsp;delete
        </SoftButton> : null
      }
        { status == 2 || status == 3 ?
        <SoftButton variant="text" color="dark" onClick={handleEditQuestion}>
        <FontAwesomeIcon icon={faPen} size="xs"/>&nbsp;edit
        </SoftButton>
        :
        null
        }
      
    </SoftBox>
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
              {index == 0 ? "True answer:" : "False answer:"}
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
  
  return (
    <div>
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style}}>
            <SoftBox sx={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200"/>
            <SoftTypography variant="h4" mt={3}> Are you sure you want to delete the  question Nº{questionID}? </SoftTypography>
            <SoftTypography variant="h6" fontWeight="light"> You won&apos;t be able to revert this! </SoftTypography>
            
            <SoftBox
            mt={4}
            display="flex"
            width= "100%"
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
            <SoftButton
                variant="gradient"
                color="info"
                sx={{ width: "30%" }}
                onClick={handleClose}
            >
                Cancel
            </SoftButton>
           
            </SoftBox>
            </SoftBox>
           
        </SoftBox>
    </Modal>
        {!isEditing ? (
            <>
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
    </>
  ) : (
    <EditView id={questionID} onSave={handleSaveEdit}/>
  )}
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
