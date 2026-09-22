import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import SoftButton from "components/SoftButton";
import { useEffect, useRef, useState } from "react";
import { useApi } from "api";
import { Spinner } from "react-bootstrap";
import { Scrollbar } from "react-scrollbars-custom";
import OlympicChecklist from "components/olympiads/OlympicChecklist";

function ReviewerOlympicModal({ open, onClose, id, onDo, onCancel }) {
  const validationMessageRef = useRef();
  const [olympicOptions, setOlympicOptions] = useState([]);
  const [selectedOlympics, setSelectedOlympics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "50%",
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    p: 4,
    borderRadius: 6,
  };

  const [validationErrors, setValidationErrors] = useState({
    olympics: false,
  });

  const validateForm = () => {
    const errors = {
      olympics: selectedOlympics.length < 1,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    if (open) {
      setValidationErrors({ olympics: false });
      setErrorMessage(null);
      setSelectedOlympics([]);
      setOlympicOptions([]);
      setLoading(true);
      getReviewerOlympics();
    }
  }, [open]);

  async function getReviewerOlympics() {
    try {
      const reviewerOlympics = await api.get("olympicQuestion/getReviewerOlympics/" + id);
      const allOlympics = await api.get("olympic/getAll");
      setOlympicOptions(allOlympics.data.elements);
      setSelectedOlympics(reviewerOlympics.data.elements.olympicIds);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Could not load the olympiads.");
      setLoading(false);
    }
  }

  async function updateReviewerOlympics(postData) {
    try {
      await api.post("olympicQuestion/updateReviewerOlympics", postData);
      onDo();
    } catch (error) {
      setErrorMessage("Could not save the permissions.");
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      updateReviewerOlympics({ userId: id, olympics: selectedOlympics });
    } else {
      setErrorMessage("Please select at least 1 olympiad.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChangeOlympics = (olympics) => {
    setSelectedOlympics(olympics);
    setValidationErrors({ olympics: olympics.length < 1 });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <SoftBox sx={{ ...style }}>
        <Scrollbar noScrollX style={{ height: "100%" }}>
          {loading ? (
            <SoftBox
              sx={{
                display: "flex",
                height: "500px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="border" variant="primary" />
            </SoftBox>
          ) : (
            <SoftBox
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SoftBox
                ref={validationMessageRef}
                sx={{
                  width: "70%",
                  display: "flex",
                  mb: 2,
                  mr: 2,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SoftTypography fontWeight="bold" marginTop={2}>
                  {" "}
                  Reviewer Olympiads{" "}
                </SoftTypography>
                <SoftTypography
                  color={validationErrors.olympics ? "error" : "dark"}
                  variant="caption"
                  fontWeight="light"
                  mb={5}
                >
                  {" "}
                  Please select at least 1 olympiad{" "}
                </SoftTypography>
                {errorMessage && (
                  <SoftTypography variant="caption" color="error" fontWeight="light" mb={2}>
                    {errorMessage}
                  </SoftTypography>
                )}

                <OlympicChecklist
                  options={olympicOptions}
                  selected={selectedOlympics}
                  onChange={handleChangeOlympics}
                />
              </SoftBox>
              <SoftBox
                mt={4}
                display="flex"
                flexDirection="row"
                width="100%"
                justifyContent="space-around"
              >
                <SoftButton
                  variant="gradient"
                  color="success"
                  sx={{ width: "30%" }}
                  onClick={handleSave}
                >
                  Save
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
          )}
        </Scrollbar>
      </SoftBox>
    </Modal>
  );
}

ReviewerOlympicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onDo: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewerOlympicModal;
