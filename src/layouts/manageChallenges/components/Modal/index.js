import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import SoftButton from "components/SoftButton";

function WarningModal({open, onClose, text, onDo, onCancel}) {
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
      
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style}}>
            <SoftBox sx={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200"/>
            <SoftTypography variant="h4" mt={3}>{text}</SoftTypography>
            <SoftTypography variant="h6" fontWeight="light"> You will not be able to revert this operation.</SoftTypography>
           
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
                onClick={onDo}
            >
                Yes!
            </SoftButton>
            <SoftButton
                variant="gradient"
                color="info"
                sx={{ width: "30%" }}
                onClick={onCancel}
            >
                Cancel
            </SoftButton>
           
            </SoftBox>
            </SoftBox>
        </SoftBox>
    </Modal>

  );
}

WarningModal.propTypes = {
    open: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    onDo: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};


export default WarningModal;
