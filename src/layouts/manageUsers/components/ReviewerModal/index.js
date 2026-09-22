import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import SoftButton from "components/SoftButton";
import { useEffect, useRef, useState } from "react";
import { useApi } from "api";
import { Spinner } from "react-bootstrap";
import { Scrollbar } from "react-scrollbars-custom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

function ReviewerModal({ open, onClose, id, onDo, onCancel }) {
  const validationMessageRef = useRef();
  const [topicOptions, setTopicOptions] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

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
    justifyContent: "center",
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    p: 4,
    borderRadius: 6,
  };

  const [validationErrors, setValidationErrors] = useState({
    topics: false,
  });

  const validateForm = () => {
    const errors = {
      topics: selectedTopics.length < 1,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    if (open) {
      setValidationErrors({
        topics: false,
      });
      setErrorMessage(null);
      setSelectedTopics([]);
      setTopicOptions([]);
      setLoading(true);
      getReviwerTopics();
    }
  }, [open]);

  async function getReviwerTopics() {
    try {
      const reviewerTopics = await api.get("user/getReviewerTopics/" + id);
      const topicIds = reviewerTopics.data.elements.topicIds;
      const allTopics = await api.get("topic/getAll");
      const newTopics = allTopics.data.elements.map((item) => ({
        ...item,
        isChecked: topicIds.includes(item.id),
      }));
      setTopicOptions(newTopics);
      setSelectedTopics(topicIds);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  async function updateReviewersTopic(postData) {
    try {
      const data = await api.post("user/updateReviewerTopics", postData);
      onDo();
    } catch (error) {
      // Handle error
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      const postData = {
        userId: id,
        topics: selectedTopics,
      };

      updateReviewersTopic(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const changeCheckboxStatus = (e, id) => {
    const myTopics = [...topicOptions];
    const { checked } = e.target;
    myTopics.map((topic) => {
      if (topic.id === id) {
        topic.isChecked = checked;
        handleChangeKey(topic.id);
      }
      const isAllChildsChecked = myTopics.every((topic) => topic.isChecked === true);
      return topic;
    });
    if (myTopics.length >= 1) setValidationErrors({ ...validationErrors, topics: false });
    else setValidationErrors({ ...validationErrors, topics: true });
    setTopicOptions([...myTopics]);
  };

  const handleChangeKey = (topic) => {
    if (selectedTopics.includes(topic)) {
      const index = selectedTopics.indexOf(topic);
      selectedTopics.splice(index, 1);
    } else selectedTopics.push(topic);
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
            <>
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
            </>
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
                <SoftTypography
                  // color={keywordsError ? "error" : "info"}
                  fontWeight="bold"
                  marginTop={2}
                >
                  {" "}
                  Reviewer Topics{" "}
                </SoftTypography>
                <SoftTypography
                  color={validationErrors.topics ? "error" : "dark"}
                  variant="caption"
                  fontWeight="light"
                  mb={5}
                >
                  {" "}
                  Please select at least 1 topic{" "}
                </SoftTypography>

                <Container style={{ width: "100%", marginBottom: 5 }}>
                  <Row>
                    <Col>
                      {/* First Column */}
                      <Form>
                        {topicOptions.slice(0, Math.ceil(topicOptions.length / 2)).map((user) => (
                          <Row key={user.id}>
                            <Col style={{ width: "50%" }}>
                              <Form.Check
                                type="checkbox"
                                checked={user.isChecked}
                                value="child"
                                style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                                label={user.label}
                                onChange={(e) => changeCheckboxStatus(e, user.id)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </Form>
                    </Col>

                    <Col style={{ width: "50%" }}>
                      {/* Second Column */}
                      <Form>
                        {topicOptions.slice(Math.ceil(topicOptions.length / 2)).map((user) => (
                          <Row key={user.id}>
                            <Col>
                              <Form.Check
                                type="checkbox"
                                checked={user.isChecked}
                                value="child"
                                style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                                label={user.label}
                                onChange={(e) => changeCheckboxStatus(e, user.id)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </Form>
                    </Col>
                  </Row>
                </Container>
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

ReviewerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onDo: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewerModal;
