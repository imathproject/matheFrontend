
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import 'katex/dist/katex.min.css';
import Card from 'react-bootstrap/Card';
import EditView from "../Edit";
import FileDownloadButton from "services/downloadFile";

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import { useApi } from 'api';
import Modal from '@mui/material/Modal';

function Material({ description, file_ext, title, status, author, materialId, onDelete, onEdit, name}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const statusIcon = ([
      {id:1, status: "Accepted", color:"#56a36b", textColor:"success"},
      {id:2, status: "Not Accepted", color:"#cc0900", textColor:"error"},
      {id:3, status: "In Progress", color:"info", textColor:"info"},
      {id:4, status: "Waiting for validation", color:"#FFB200", textColor:"warning"},
  ]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
    const handleResize = () => {
    setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
   }, [materialId]);
   

   const handleEditMaterial = () => {
       setIsEditing(!isEditing);
   };

   const handleSaveEdit = () => {
    setIsEditing(!isEditing);
    onEdit();
};
   const flexDirection = windowWidth <= 1020 ? 'column' : 'row';
   const margin = windowWidth <= 1020 ? '0px' : '8px';
   const marginBottom = windowWidth <= 1020 ? '20px' : '0px';

  async function handleDeleteMaterial() {
    try {
      const data = await api.post("material/deleteMaterial", {id: materialId, file_ext: file_ext});
      setOpen(false)
      onDelete(materialId); 
    } catch (error) {
      onDelete(materialId)
    }
  }

  const ManageMaterial  = () => {
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
      {statusIcon.map((item) =>{
        if(item.id == status){
          return(
            <SoftBox key={item.id} bgColor={item.color} borderRadius="lg"flexDirection="row" display="flex" justifyContent="center" width="50" mb={2}>
            <SoftTypography variant="button" fontWeight="bold" color="white" mt={1} mb={1}>
                    {item.status}
            </SoftTypography>
            </SoftBox>
          )
        }
      })}
       <SoftBox justifyContent="center" display="flex" mt={1} mb={2}>
       { status == 2 || status == 3 ?
        <SoftButton variant="text" color="info" onClick={handleOpen}>
          <FontAwesomeIcon icon={faTrash} size="xs"/>&nbsp;delete
        </SoftButton> : null}
        { status == 2 || status == 3 ?
        <SoftButton variant="text" color="dark" onClick={handleEditMaterial}>
        <FontAwesomeIcon icon={faPen} size="xs"/>&nbsp;edit
        </SoftButton>
        :
        null
        }
      
    </SoftBox>
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
            <SoftTypography variant="h4" mt={3}> Are you sure you want to delete the material Nº{materialId}? </SoftTypography>
            <SoftTypography variant="h6" fontWeight="light"> You won&apos;t be able to revert this! </SoftTypography>
            
            <SoftBox
            mt={4}
            display="flex"
            flexDirection="row"
            width= "100%"
            justifyContent="space-around"
            >
            <SoftButton
                variant="gradient"
                color="error"
                sx={{ width: "30%" }}
                onClick={handleDeleteMaterial}
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
          alignItems={{ xs: "center"}}
          justifyContent="center"
          flexDirection="column"
          sx={{
            '@media (max-width: 1020px)': {
                width: "100%",
            },
          }}
        >
           
              <FileDownloadButton id={materialId} fileExtension={file_ext} name={name}/>
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
                m: 2
            },
          }}
          
        >  
          <SoftBox lineHeight={0}>
          <SoftTypography variant="button" fontWeight="large" color="info">
            Material {materialId}: {title}
          </SoftTypography>
          </SoftBox>
          <SoftBox mb={3} lineHeight={0}>
          <SoftTypography variant="caption" color="info" fontWeight="medium">
            {author}
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1} lineHeight={0}>
        <div style={{ padding: '1rem', overflowY: 'auto', width: '100%' }}>
          <SoftTypography variant="caption"   fontWeight="medium">
            {description}
          </SoftTypography>
        </div>
        </SoftBox>
    
        </SoftBox>
        <ManageMaterial/>
  </Card.Body>
    </Card>  
    </>
  ) : (
    <EditView id={materialId} onSave={handleSaveEdit}/>
  )}
  </div>
  );
}

Material.propTypes = {
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    materialId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    author: PropTypes.bool.isRequired,
    noGutter: PropTypes.bool,
    onDelete: PropTypes.func,
    file_ext: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
  };

export default Material;
