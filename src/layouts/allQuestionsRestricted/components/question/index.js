
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Card from 'react-bootstrap/Card';
import { useApi } from 'api';


function Question({ level, topic,subtopic, question, status, questionID, answers, image, extension}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const api = useApi();
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    
  useEffect(() => {
    if(image != null) fetchImage(questionID, extension)
    const handleResize = () => {
    setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
   }, [questionID]);

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
      setError('Failed to fetch image');
    }
  };
  
  return (  
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
  </SoftBox>
  </Card.Body>
    </Card> 
  );
}

Question.propTypes = {
  level: PropTypes.number.isRequired,
  topic: PropTypes.string.isRequired,
  subtopic: PropTypes.string,
  question: PropTypes.string.isRequired,
  questionID: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  answers: PropTypes.array.isRequired,
  image: PropTypes.string,
  extension: PropTypes.string
};

export default Question;
