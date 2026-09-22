import React, { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import SoftButton from "components/SoftButton";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useApi } from "api";
import SoftAutocomplete from "components/AutoComplete";
import SearchBar from "./components/SearchBar";
import WarningModal from "./components/Modal";
import ReviewerModal from "./components/ReviewerModal";
import ReviewerOlympicModal from "./components/ReviewerOlympicModal";
import UserCard from "./components/UserCard";
import SoftInput from "components/SoftInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUser,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

function Main() {
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState([]);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [banned, setBanned] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [permissionId, setPermissionId] = useState(null);
  const [university, setUniversity] = useState(null);
  const [typology, setTypology] = useState(null);
  const [value, setValue] = useState([1, 0]);
  const [oldRole, setOldRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  //Manage Pagination
  const [pageInput, setPageInput] = useState("");
  const usersPerPage = 10;
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUser = rows.slice(indexOfFirstUser, indexOfLastUser);

  //Manage Modals
  const [openStatus, setOpenStatus] = useState(false);
  const [openTypology, setOpenTypology] = useState(false);
  const [openReviewer, setOpenReviewer] = useState(false);
  const [openReviewerOlympic, setOpenReviewerOlympic] = useState(false);
  const [openUserCard, setOpenUserCard] = useState(false);

  const handleOpenStatus = () => setOpenStatus(true);
  const handleCloseStatus = () => setOpenStatus(false);
  const handleOpenTypology = () => setOpenTypology(true);
  const handleCloseTypology = () => setOpenTypology(false);
  const handleOpenReviewer = () => setOpenReviewer(true);
  const handleCloseReviewer = () => setOpenReviewer(false);
  const handleOpenReviewerOlympic = () => setOpenReviewerOlympic(true);
  const handleCloseReviewerOlympic = () => setOpenReviewerOlympic(false);
  const handleOpenUserCard = () => setOpenUserCard(true);
  const handleCloseUserCard = () => setOpenUserCard(false);

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
    fetchRoles();
    const postData = { typology: null, ban: value, university: null };
    fetchRows(postData);
  }, []);

  const handleChange = (id, name) => (event) => {
    const status = event.target.checked ? "reactivate" : "ban";
    const phrase = "Are you sure you want to " + status + " user " + name + "?";
    setUserId(id);
    setModalText(phrase);
    setBanned(!event.target.checked);
    handleOpenStatus();
  };

  const handleChangePermission = (permission, id, name, oldRole, email) => {
    const phrase =
      "Are you sure you want to change " + name + " 's permission to " + permission.label + "?";
    setOldRole(oldRole);
    setEmail(email);
    setName(name);
    setUserId(id);
    setPermissionId(permission.id);
    setModalText(phrase);
    handleOpenTypology();
  };

  async function updatedStatus() {
    try {
      const data = await api.post("user/updateStatus", { id: userId, ban: banned });
      const postData = { typology: typology, ban: value, university: university };
      fetchRows(postData);
      setModalText(null);
      setUserId(null);
      setBanned(null);
      handleCloseStatus();
    } catch (error) {
      // Handle error
    }
  }

  async function updateTypology() {
    try {
      const data = await api.post("user/updateTypology", {
        id: userId,
        typology: permissionId,
        oldRole: oldRole,
        email: email,
        name: name,
      });
      const postData = { typology: typology, ban: value, university: university };

      fetchRows(postData);
      setModalText(null);
      setOldRole(null);
      setEmail(null);
      setName(null);
      setUserId(null);
      setPermissionId(null);
      handleCloseTypology();
    } catch (error) {
      // Handle error
    }
  }

  const updateReviewerTopics = () => {
    const postData = { typology: typology, ban: value, university: university };
    handleCloseReviewer();
    fetchRows(postData);
  };

  const updateReviewerOlympics = () => {
    const postData = { typology: typology, ban: value, university: university };
    handleCloseReviewerOlympic();
    fetchRows(postData);
  };

  async function fetchRows(postData) {
    try {
      const data = await api.post("user/getUsers", postData);
      const rows = data.data.elements;
      setStatus(rows.map((row) => ({ id: row.id, checked: row.ban === 0 })));
      setRows(rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  }

  async function fetchRoles() {
    try {
      const data = await api.get("role/getAll");
      const roles = data.data.elements;
      setRoles(roles);
    } catch (error) {
      // Handle error
    }
  }

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  const handleFilter = (typology, value, university) => {
    setPage(1);
    setTypology(typology);
    setUniversity(university);
    setValue(value);
    const data = {
      typology: typology,
      ban: value,
      university: university,
    };
    fetchRows(data);
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (
      !isNaN(pageNumber) &&
      pageNumber > 0 &&
      pageNumber <= Math.ceil(rows.length / usersPerPage)
    ) {
      setPage(pageNumber);
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } else {
      // Handle invalid page number (optional)
      console.error("Invalid page number");
    }
  };

  const handleEditRevisorTopics = (id) => {
    setUserId(id);
    handleOpenReviewer();
  };

  const handleEditRevisorOlympics = (id) => {
    setUserId(id);
    handleOpenReviewerOlympic();
  };

  const handleUserCard = (id) => {
    setUserId(id);
    handleOpenUserCard();
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <WarningModal
        open={openStatus}
        onClose={handleCloseStatus}
        text={modalText}
        onDo={updatedStatus}
        onCancel={handleCloseStatus}
      />
      <WarningModal
        open={openTypology}
        onClose={handleCloseTypology}
        text={modalText}
        onDo={updateTypology}
        onCancel={handleCloseTypology}
      />
      <ReviewerModal
        open={openReviewer}
        onClose={handleCloseReviewer}
        id={userId}
        onDo={updateReviewerTopics}
        onCancel={handleCloseReviewer}
      />
      <ReviewerOlympicModal
        open={openReviewerOlympic}
        onClose={handleCloseReviewerOlympic}
        id={userId}
        onDo={updateReviewerOlympics}
        onCancel={handleCloseReviewerOlympic}
      />

      <UserCard open={openUserCard} onClose={handleCloseUserCard} id={userId} />

      <Grid alignItems="center" p={5} sx={{ "@media (max-width: 900px)": { p: 2 } }}>
        <SearchBar onFilter={handleFilter} />

        {currentUser.length > 0 ? (
          <SoftBox
            sx={{
              "@media (max-width: 900px)": {
                width: "100%",
                overflowX: "auto",
              },
            }}
          >
            <SoftBox
              sx={{
                minWidth: "800px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
                backgroundColor: "white",
              }}
            >
              <SoftBox
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  mb: 2,
                  boxShadow: "0px 4px 6px rgba(128, 128, 128, 0.3)",
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: "#344767",
                }}
              >
                <SoftBox width="5%">
                  <SoftTypography fontWeight="bold" color="light">
                    ID
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="20%">
                  <SoftTypography fontWeight="bold" color="light">
                    Name
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="15%">
                  <SoftTypography fontWeight="bold" color="light">
                    Email
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="5%">
                  <SoftTypography fontWeight="bold" color="light">
                    Type
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="30%" sx={{ display: "flex", justifyContent: "center" }}>
                  <SoftTypography fontWeight="bold" color="light">
                    Status
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="15%">
                  <SoftTypography fontWeight="bold" color="light">
                    Permissions
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="10%">
                  <SoftTypography fontWeight="bold" color="light"></SoftTypography>
                </SoftBox>
              </SoftBox>

              {loading ? (
                <CircularProgress color="info" />
              ) : (
                currentUser.map((key, index) => (
                  <SoftBox
                    key={index}
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      mb: 2,
                      boxShadow: "0px 4px 6px rgba(128, 128, 128, 0.3)",
                      borderRadius: 1,
                      p: 1,
                      backgroundColor: "white",
                      "&:hover": {
                        boxShadow: "0px 6px 8px rgba(128, 128, 128, 0.5)",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <SoftBox width="5%">
                      <SoftTypography variant="h6">{key.id}</SoftTypography>
                    </SoftBox>
                    <SoftBox width="20%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.name + " " + key.surname}
                      </SoftTypography>
                      <FontAwesomeIcon icon={faUser} onClick={() => handleUserCard(key.id)} />
                    </SoftBox>
                    <SoftBox width="15%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.email}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox width="5%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.role.description}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox
                      sx={{
                        width: "30%",
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
                          color: status.find((x) => x.id === key.id).checked
                            ? "#D3D3D3"
                            : "#cc0900",
                        }}
                      >
                        Banned
                      </SoftTypography>
                      <Switch
                        checked={status.find((x) => x.id === key.id).checked}
                        color="secondary"
                        onChange={handleChange(key.id, key.name + " " + key.surname)}
                      />
                      <SoftTypography
                        ml={2}
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: status.find((x) => x.id === key.id).checked
                            ? "#56a36b"
                            : "#D3D3D3",
                        }}
                        disabled
                      >
                        Active
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox
                      sx={{
                        display: "flex",
                        width: "15%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SoftAutocomplete
                        options={roles}
                        selected={{ id: key.role.id, label: key.role.description }}
                        onNewValueSelected={(e) =>
                          handleChangePermission(
                            e,
                            key.id,
                            key.name + " " + key.surname,
                            key.role.id,
                            key.email
                          )
                        }
                      />
                    </SoftBox>
                    <SoftBox
                      sx={{
                        display: "flex",
                        width: "10%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {(key.role.description === "Lecturer Reviewer" ||
                        key.platform__topics.length > 0) && (
                          <SoftButton iconOnly onClick={() => handleEditRevisorTopics(key.id)}>
                            <FontAwesomeIcon icon={faList} size="lg" />
                          </SoftButton>
                        )}
                      {key.role.description === "Lecturer Reviewer" && (
                        <SoftButton iconOnly onClick={() => handleEditRevisorOlympics(key.id)}>
                          <FontAwesomeIcon icon={faTrophy} size="lg" />
                        </SoftButton>
                      )}
                    </SoftBox>
                  </SoftBox>
                ))
              )}
            </SoftBox>
            <Stack mt={2} spacing={3} mb={2} alignItems="center">
              <Pagination
                color="info"
                variant="outlined"
                count={Math.ceil(rows.length / usersPerPage)}
                page={page}
                onChange={handlePagination}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <SoftInput
                  placeholder="Go to Page"
                  variant="outlined"
                  value={pageInput}
                  onChange={handlePageInputChange}
                />
                <SoftButton color="dark" onClick={handleGoToPage}>
                  Go
                </SoftButton>
              </Stack>
            </Stack>
          </SoftBox>
        ) : (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">
              No data recorded
            </SoftTypography>
          </SoftBox>
        )}
      </Grid>
    </Card>
  );
}

export default Main;
