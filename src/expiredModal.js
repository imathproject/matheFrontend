import React from 'react';
import Modal from '@mui/material/Modal';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import { useAuth } from 'authContext';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50%",
  height: "30%",
  bgcolor: '#FFFFFF',
  boxShadow: 24,
  borderRadius: 6
};

import matheLogo from "assets/images/matheLogo.png";

const ExpiredModal = () => {
  const { expiredModel } = useAuth();
  return (
    <Modal
            open={expiredModel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
              <SoftBox sx={{ ...style}}>
                <SoftBox m={1} sx={{with:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <SoftBox component="img" src={matheLogo} width="15%" m={4}/>
                    <SoftTypography  variant="title" fontWeight="bold" >
                      Your session has expired, you will be directed to the login page.
                    </SoftTypography>
                </SoftBox>
                </SoftBox>
        </Modal>
  );
};

export default ExpiredModal;
