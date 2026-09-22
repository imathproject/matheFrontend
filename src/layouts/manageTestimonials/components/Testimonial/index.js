import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import Card from "react-bootstrap/Card";
import EditView from "../Edit";
import ReactCountryFlag from "react-country-flag";
import Switch from "@mui/material/Switch";
import styled from "styled-components";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "api";
import Modal from "@mui/material/Modal";

const FlagBox = styled(SoftBox)`
  width: 80%;
  text-align: center;

  @media (max-width: 1070px) {
    width: 20%;
  }
`;

function Testimonial({
  title,
  validated,
  testimonial,
  onDelete,
  onEdit,
  name,
  testimonialID,
  country,
  countryAcronym,
  role,
  publicStatus,
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const statusIcon = [
    { id: 1, status: "Accepted", color: "#56a36b", textColor: "success" },
    { id: 0, status: "Not Validated", color: "#cc0900", textColor: "error" },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [answerState, setAnswerState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(publicStatus);
  const api = useApi();

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "60%",
    justifyContent: "center",
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    p: 4,
    borderRadius: 6,
  };

  useEffect(() => {
    setNewStatus(publicStatus);
    setIsEditing(false);
    setAnswerState(false);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [testimonialID]);

  const handleEditMaterial = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setIsEditing(!isEditing);
    onEdit();
  };
  const flexDirection = windowWidth <= 1020 ? "column" : "row";
  const margin = windowWidth <= 1020 ? "0px" : "8px";
  const marginBottom = windowWidth <= 1020 ? "20px" : "0px";

  async function handleDeleteMaterial() {
    try {
      const data = await api.get("testimonial/delete/" + testimonialID);
      setOpen(false);
      onDelete(testimonialID);
    } catch (error) {
      onDelete(testimonialID);
    }
  }

  async function handleUpdateStatus(event) {
    setNewStatus(event.target.checked);
    const postData = {
      testimonialID: testimonialID,
      status: event.target.checked ? 1 : 0,
    };
    try {
      const data = await api.post("testimonial/updateStatus", postData);
    } catch (error) {}
  }

  const ManageMaterial = () => {
    return (
      <SoftBox
        width="20%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={1}
        sx={{
          "@media (max-width: 1020px)": {
            width: "100%",
          },
        }}
      >
        {statusIcon.map((item) => {
          if (item.id == validated) {
            return (
              <SoftBox
                key={item.id}
                bgColor={item.textColor}
                borderRadius="lg"
                flexDirection="row"
                display="flex"
                justifyContent="center"
                width="100%"
                mb={2}
              >
                <SoftTypography variant="button" fontWeight="small" color="white" mt={1} mb={1}>
                  {item.status}
                </SoftTypography>
              </SoftBox>
            );
          }
        })}
        <SoftBox justifyContent="center" display="flex" mt={1} mb={2}>
          <SoftButton variant="text" color="info" onClick={handleOpen}>
            <FontAwesomeIcon icon={faTrash} size="xs" />
            &nbsp;delete
          </SoftButton>
          <SoftButton variant="text" color="dark" onClick={handleEditMaterial}>
            <FontAwesomeIcon icon={faPen} size="xs" />
            &nbsp;edit
          </SoftButton>
        </SoftBox>
      </SoftBox>
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color="#FFB200" />
            <SoftTypography variant="h4" mt={3}>
              {" "}
              Are you sure you want to delete the testimonial?{" "}
            </SoftTypography>
            <SoftTypography variant="h6" fontWeight="light">
              {" "}
              You won&apos;t be able to revert this!{" "}
            </SoftTypography>

            <SoftBox
              mt={4}
              display="flex"
              flexDirection="row"
              width="100%"
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
          <Card
            border="light"
            bg="light"
            style={{ margin: margin, marginBottom: marginBottom, borderRadius: "4%" }}
          >
            <Card.Body style={{ display: "flex", flexDirection: flexDirection }}>
              <SoftBox
                width="25%"
                display="flex"
                alignItems={{ xs: "center" }}
                justifyContent="center"
                flexDirection="column"
                sx={{
                  "@media (max-width: 1020px)": {
                    width: "100%",
                  },
                }}
              >
                <SoftBox
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SoftTypography
                    mr={2}
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: newStatus ? "#D3D3D3" : "#cc0900",
                    }}
                  >
                    Not Public
                  </SoftTypography>
                  <Switch
                    checked={newStatus}
                    color="secondary"
                    onChange={(e) => handleUpdateStatus(e)}
                  />
                  <SoftTypography
                    ml={2}
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: newStatus ? "#56a36b" : "#D3D3D3",
                    }}
                    disabled
                  >
                    Public
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox
                width="60%"
                display="flex"
                flexDirection="column"
                mx={2}
                sx={{
                  "@media (max-width: 1020px)": {
                    width: "100%",
                    m: 2,
                  },
                }}
              >
                <SoftBox
                  display="flex"
                  alignItems="center"
                  flexDirection="row"
                  mb={2}
                  sx={{
                    "@media (max-width: 1020px)": {
                      flexDirection: "column",
                      alignItems: "flex-start",
                    },
                  }}
                >
                  <ReactCountryFlag
                    countryCode={countryAcronym}
                    svg
                    style={{
                      width: "40px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  />
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="large" color="info">
                      {title}
                    </SoftTypography>
                    <SoftBox mb={1} lineHeight={0}>
                      <SoftTypography variant="caption" color="info" fontWeight="medium">
                        {name} - {role}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>

                <SoftBox mt="auto" lineHeight={0}>
                  <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      {testimonial}
                    </SoftTypography>
                  </div>
                </SoftBox>
              </SoftBox>

              <ManageMaterial />
            </Card.Body>
          </Card>
        </>
      ) : (
        <EditView id={testimonialID} onSave={handleSaveEdit} />
      )}
    </div>
  );
}

Testimonial.propTypes = {
  testimonial: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  countryAcronym: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  validated: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  testimonialID: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  noGutter: PropTypes.bool,
  publicStatus: PropTypes.number.isRequired,
};

export default Testimonial;
