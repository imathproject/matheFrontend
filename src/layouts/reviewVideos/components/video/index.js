import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import 'katex/dist/katex.min.css';
import Card from 'react-bootstrap/Card';
import MovieClip from "examples/YoutubeVideo";
import Modal from '@mui/material/Modal';
import AddVideo from "../AddVideo";
import { Scrollbar } from 'react-scrollbars-custom';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX} from '@fortawesome/free-solid-svg-icons'

//Icons
import { useApi } from 'api';

function Video({ description, link,title, status, author, videoID, onDelete, onEdit}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [open, setOpen] = useState(false);
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
   }, [videoID]);
   

function handleSaveVideo() {
  setOpen(false);
  onEdit();
}

   const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
   const margin = windowWidth <= 1020 ? '0px' : '8px';
   const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

  const ManageVideo  = () => {
    return(
      <SoftBox
      width="20%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      mt={1}
      sx={{
        '@media (max-width: 1020px)': {
            width: "100%"
        },
      }}
    >
      <SoftButton color="info" onClick={handleOpen}> Review </SoftButton>
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
           
                <SoftBox m={1} sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom: 1, borderColor: "#3447767", mb: 4}}>
                    <SoftTypography  variant="title" fontWeight="bold" >
                    Validate video
                    </SoftTypography>
                    <SoftButton variant="text" color="dark" onClick={handleClose}>
                      <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
                      <FontAwesomeIcon icon={faX} size="4x"/>
                    </SoftButton>
                </SoftBox>
                <Scrollbar noScrollX style={{ height: "80%" }}>
                <AddVideo onSave={handleSaveVideo} videoID={videoID}/>
                </Scrollbar>
            </SoftBox>
        </Modal>
    <Card  border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom, borderRadius: '4%'}}>
        <Card.Body style={{display: 'flex', flexDirection: flexDirection}}>
       
        <SoftBox
          width="25%"
          display="flex"
          alignItems={{ xs: "flex-start"}}
          flexDirection="column"
          sx={{
            '@media (max-width: 1020px)': {
                width: "100%",
            },
          }}
        >
          <MovieClip id={videoID} videoId={link} />
        </SoftBox>
        <SoftBox
          width="60%"
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          mx={2}
          sx={{
            '@media (max-width: 1020px)': {
                width: "100%",
                mt: 2
            },
          }}
          
        >  
          <SoftBox lineHeight={0}>
          <SoftTypography variant="button" fontWeight="large" color="info">
          Video {videoID}: {title}
          </SoftTypography>
          </SoftBox>
          <SoftBox mb={3} lineHeight={0}>
          <SoftTypography variant="caption" color="info" fontWeight="medium">
            {author}
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1} lineHeight={0}>
          <SoftTypography variant="caption"   fontWeight="medium">
            {description}
          </SoftTypography>
        </SoftBox>
        </SoftBox>
        <ManageVideo/>
  </Card.Body>
    </Card>  
  </div>
  );
}

  Video.propTypes = {
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    videoID: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    author: PropTypes.bool.isRequired,
    noGutter: PropTypes.bool,
    onDelete: PropTypes.func,
    link: PropTypes.string,
    videoID: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired
  };

export default Video;
