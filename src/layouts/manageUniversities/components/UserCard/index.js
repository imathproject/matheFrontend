import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import { useEffect, useRef, useState } from "react";
import { useApi } from "api";
import { Spinner } from "react-bootstrap";
import { Scrollbar } from "react-scrollbars-custom";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftAvatar from "components/SoftAvatar";
import back2 from "assets/images/backgroud2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faOrcid } from "@fortawesome/free-brands-svg-icons";
import { faSquare, faX } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import SoftButton from "components/SoftButton";
import DownloadTeacherAbility from "services/downloadTeacherAbility";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "70%",
  justifyContent: "center",
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 4,
  borderRadius: 6,
  "@media (max-width: 1250px)": {
    width: "60%",
  },
  "@media (max-width: 750px)": {
    width: "90%",
  },
};

function UserCard({ open, onClose, id }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const api = useApi();

  useEffect(() => {
    getUserInformation();
  }, [id]);

  async function getTeacherAbility() {
    try {
      const file = await api.get("user/getTeacherAbility/" + id, {
        responseType: "blob", // important
      });
      setFile(file);
    } catch (error) {
      setFile(null);
      // Handle error
    }
  }

  async function getUserInformation() {
    try {
      const data = await api.get("user/getUser/" + id);
      setUser(data.data.elements[0]);
      await getTeacherAbility();
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

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
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  mb: 1,
                }}
              >
                <SoftButton variant="text" color="dark" onClick={onClose}>
                  {/* <SoftTypography mr={1} variant="title" fontWeight="bold">
                    Close
                  </SoftTypography> */}
                  <FontAwesomeIcon icon={faX} size="4x" />
                </SoftButton>
              </SoftBox>
              <SoftBox position="relative" width="100%">
                <SoftBox
                  display="flex"
                  alignItems="center"
                  position="relative"
                  minHeight="6.50rem"
                  borderRadius="xl"
                  sx={{
                    backgroundImage: ({
                      functions: { rgba, linearGradient },
                      palette: { gradients },
                    }) =>
                      `${linearGradient(
                        rgba(gradients.info.main, 0.6),
                        rgba(gradients.info.state, 0.6)
                      )}, url(${back2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                  }}
                />
                <Card
                  sx={{
                    backdropFilter: `saturate(200%) blur(30px)`,
                    backgroundColor: ({ functions: { rgba }, palette: { white } }) =>
                      rgba(white.main, 0.8),
                    boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
                    position: "relative",
                    mt: -13.2,
                    py: 2,
                    px: 2,
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      <SoftAvatar
                        src={null}
                        alt="profile-image"
                        variant="rounded"
                        size="xl"
                        shadow="sm"
                      />
                    </Grid>
                    <Grid item>
                      <SoftBox height="100%" mt={0.5} lineHeight={1}>
                        <SoftTypography variant="h5" fontWeight="medium">
                          {user.name} {user.surname}
                        </SoftTypography>
                        <SoftTypography variant="button" color="text" fontWeight="medium">
                          {user.role.description}
                        </SoftTypography>
                      </SoftBox>
                    </Grid>
                  </Grid>
                </Card>
              </SoftBox>

              <SoftBox
                sx={{ width: "100%", display: "flex", mt: 2, mx: 2, flexDirection: "column" }}
              >
                <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 3 }}>
                  <SoftTypography fontWeight="bold">Email</SoftTypography>
                  <SoftTypography fontWeight="light">{user.email}</SoftTypography>
                </SoftBox>

                <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 3 }}>
                  <SoftTypography fontWeight="bold">Country</SoftTypography>
                  <SoftTypography fontWeight="light">{user.country.label}</SoftTypography>
                </SoftBox>

                <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 3 }}>
                  <SoftTypography fontWeight="bold">Course</SoftTypography>
                  <SoftTypography fontWeight="light">{user.platform__course.label}</SoftTypography>
                </SoftBox>

                <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 3 }}>
                  <SoftTypography fontWeight="bold">University</SoftTypography>
                  <SoftTypography fontWeight="light">
                    {user.platform__university.label}
                  </SoftTypography>
                </SoftBox>

                <SoftBox
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    mt: 3,
                  }}
                >
                  {user.orcid != null && user.orcid != "" && (
                    <Link to={"https://orcid.org/" + user.orcid} target="_blank">
                      <FontAwesomeIcon icon={faOrcid} size="2x" color="#a6ce39" />
                    </Link>
                  )}
                  {user.scopus != null && user.scopus != "" && (
                    <Link
                      to={"https://www.scopus.com/authid/detail.uri?authorId=" + user.scopus}
                      target="_blank"
                    >
                      <div className="icon-container">
                        <FontAwesomeIcon
                          icon={faSquare}
                          color="rgba(254,130,0,255)"
                          size="2x"
                          className="square-icon"
                        />
                        <span className="icon-text">SC</span>
                      </div>
                    </Link>
                  )}

                  {file && (
                    <DownloadTeacherAbility file={file} name={user.name + "_" + user.surname} />
                  )}
                </SoftBox>
              </SoftBox>
            </SoftBox>
          )}
        </Scrollbar>
      </SoftBox>
    </Modal>
  );
}

UserCard.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserCard;
