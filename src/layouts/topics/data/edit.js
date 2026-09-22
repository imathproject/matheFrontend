import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useApi } from 'api';
import SoftInput from "components/SoftInput";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation} from '@fortawesome/free-solid-svg-icons'

function Edit({data, onUpdate}) {
    const [topic, setTopic] = useState({id: data.id, name: data.label});
    const [subtopics, setSubtopics] = useState(data.platform__subtopics);
    const api = useApi();
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
    }, []);

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

    const updateSubtopicName = (id, newName) => {
        const updatedSubtopics = subtopics.map(subtopic => {
            if (subtopic.id === id) {
                return { ...subtopic, name: newName };
            }
            return subtopic; 
        });
        setSubtopics(updatedSubtopics); 
    };

        async function save() {
        if (!topic.name.trim()) {
            setError(true);
            return;
        }
    
        const subtopicErrors = subtopics.map(subtopic => !subtopic.name.trim());
        if (subtopicErrors.includes(true)) {
            setError(true);
            return;
        }
    
        const postData ={
            id: topic.id,
            name: topic.name,
            subtopics: subtopics
        };
        try {
            const data = await api.post("topic/updateTopAndSub", postData);
            onUpdate();
        } catch (error) {
            // Handle error
        }
    }
    
    async function deleteTopic() {
        try {
        const data = await api.get("topic/delete/"+topic.id);
        onUpdate();
        } catch (error) {
            // Handle error
        }
    }

  return (
    <SoftBox sx={{width:"98%", display:"flex", flexDirection:"column", justifyContent:"space-around"}}>
        <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style}}>
            <SoftBox sx={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200"/>
            <SoftTypography variant="h4" mt={3}> Are you sure you want to delete the {data.label} topic? </SoftTypography>
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
                onClick={deleteTopic}
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
         {error && <SoftTypography mb={2} color="error" variant="caption"> Please fill in all the parameters</SoftTypography>}
    <SoftTypography fontWeight="bold" color="info"> Topic </SoftTypography>
    <SoftInput  placeholder="Topic" defaultValue={data.label} sx={{width:"60%"}}
    onChange={(e) => {
     setTopic({id:topic.id, name: e.target.value});
    }}/>

      {data.platform__subtopics.length > 0 ? <SoftTypography mt={3} fontWeight="bold" color="info"> Subtopics </SoftTypography> : null}
      {data.platform__subtopics ? 
        data.platform__subtopics.map((key, index) => (
            <SoftInput 
              key={index}
              placeholder="Topic" 
              defaultValue={key.name} 
              sx={{mb: 2, width:"60%"}} 
              onChange={(e) => {
                const newSubtopicName = e.target.value;
                const subtopicId = data.platform__subtopics[index].id;
                updateSubtopicName(subtopicId, newSubtopicName);
            }}
            /> 
        ))
        : null
      }
        <SoftBox
          mt={4}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <SoftButton
            variant="gradient"
            color="error"
            sx={{ width: "10%" }}
            onClick={handleOpen}
          >
            Delete
          </SoftButton>
          <SoftButton
            variant="gradient"
            color="success"
            sx={{ width: "10%" }}
            onClick={save}
          >
            Save
          </SoftButton>
        </SoftBox>
    
    </SoftBox>
  );
}
  
Edit.propTypes = {
    data: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired
};
  export default Edit