import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX, faCirclePlus, faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import IconButton from '@mui/material/IconButton';
import { useState, useSyncExternalStore } from "react";
import Modal from '@mui/material/Modal';
import { useApi } from 'api';

function Subtopic({topic, id, subtopic, deleteSub, onDeleteSubtopic }) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState("");
  const [subtopicArray, setSubtopicArray] = useState(subtopic);
  const [open, setOpen] = useState(false);
  const [deleteSubtopic, setDeleteSubtopic] = useState(null);
  const [deleteLabel, setDeleteLabel] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  async function deleteS(idSub) {
    try {
      const data = await api.get("subtopic/delete/"+idSub);
      setDeleteSubtopic(null);
      setDeleteLabel(null);
    } catch (error) {
      // Handle error
    }
  }

  async function addS(postData) {
    try {
      const data = await api.post("subtopic/add", postData);
      onDeleteSubtopic();
    } catch (error) {
      // Handle error
    }
  }

  const handleSubtopicDelete = async () => {
    await deleteS(deleteSubtopic);
    onDeleteSubtopic();
  };


  const handleAddSubtopic = () => {
    if (newSubtopic) {

     const postData = {
      topic: topic,
      name: newSubtopic
     }
      addS(postData);
    }
  };

  return (
    <SoftBox display="flex" flexDirection="column" alignItems="flex-start">
       <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style}}>
            <SoftBox sx={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200"/>
            <SoftTypography variant="h4" mt={3}> Are you sure you want to delete the &quot;{deleteLabel}&quot; subtopic? </SoftTypography>
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
                onClick={handleSubtopicDelete}
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
      {subtopicArray.map((key, index) => (
        <SoftBox key={index} flexDirection="row">
          {deleteSub ? (
            <IconButton size="small" onClick={() => {handleOpen(); setDeleteSubtopic(id[index]), setDeleteLabel(key.name)}} >  
              <FontAwesomeIcon color="#CC0900" icon={faX} size="xs" />
            </IconButton>
          ) : null}
          <SoftTypography variant="caption" fontWeight="medium">
            {key.name}&nbsp;&nbsp;&nbsp; 
          </SoftTypography>
          <SoftTypography variant="caption" color="dark" fontWeight="bold">
            ({key.SubquestionCount})&nbsp;&nbsp;&nbsp; 
          </SoftTypography>
        </SoftBox>
      ))}
      {showAddInput && (
        <SoftBox display="flex" flexDirection="row">
          <SoftInput onChange={(e) => setNewSubtopic(e.target.value)}/>
          <SoftButton sx={{ml: 2, background: "#56a36b", color:"#fff"}} onClick={handleAddSubtopic}>Add</SoftButton>
        </SoftBox>
      )}
      {!showAddInput && (
       <IconButton size="small" onClick={() => setShowAddInput(true)}>
          <FontAwesomeIcon icon={faCirclePlus} size="xs" color="#56a36b"/>
        </IconButton>
      )}
    </SoftBox>
  );
}
  
Subtopic.propTypes = {
    topic: PropTypes.number.isRequired,
    id: PropTypes.array.isRequired,
    subtopic: PropTypes.array.isRequired,
    deleteSub: PropTypes.bool.isRequired,
    onDeleteSubtopic: PropTypes.func.isRequired
};
  export default Subtopic