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
import SearchBar from "./components/SearchBar";
import WarningModal from "./components/Modal";
import SoftInput from "components/SoftInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./components/EditModal";
import styled from "styled-components";
import AddUniversityModal from "./components/AddUniversityModal";
import UserCard from "./components/UserCard";

function Main() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const [openStatus, setOpenStatus] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [validated, setValidated] = useState([]);
  const [page, setPage] = useState(1);
  const [countryId, setCountryId] = useState(null);
  const [universityId, setUniversityId] = useState(null);
  const [banned, setBanned] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [statusPhrase, setstatusphrase] = useState(null);
  const [country, setCountry] = useState(null);
  const [pageInput, setPageInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [openUserCard, setOpenUserCard] = useState(false);
  const handleOpenStatus = () => setOpenStatus(true);
  const handleCloseStatus = () => setOpenStatus(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleOpenUserCard = () => setOpenUserCard(true);
  const handleCloseUserCard = () => setOpenUserCard(false);

  const usersPerPage = 10;
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUser = rows.slice(indexOfFirstUser, indexOfLastUser);

  const CardBody = styled(Card)`
    dispay: flex;
    width: 50px;
    height: 50px;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    border-radius: 100%;
    margin: 10px;
    background-color: #344767;
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    &:hover {
      transform: scale(1.1);
    }
  `;

  useEffect(() => {
    fetchAllUniversities();
  }, []);

  const handleChange = (id, name) => (event) => {
    const status = event.target.checked ? "reactivate" : "invalidate";
    const phrase = "Are you sure you want to " + status + " " + name + " university?";
    setCountryId(id);
    setModalText(phrase);
    setBanned(event.target.checked);
    handleOpenStatus();
  };

  const handleEditUniversity = (id) => {
    setUniversityId(id);
    handleOpenEditModal();
  };

  const handleDeleteUniversity = (id, name) => {
    const phrase = "Are you sure you want to delete " + name + " university?";
    setModalText(phrase);
    setUniversityId(id);
    handleOpenDeleteModal();
  };

  async function updatedStatus() {
    try {
      const data = await api.post("university/updateStatus", { id: countryId, status: banned });
      if (country != null) fetchRows({ country: country, validated: validated });
      else fetchAllUniversities();
      setModalText(null);
      setCountryId(null);
      setBanned(null);
      setstatusphrase(null);
      handleCloseStatus();
    } catch (error) {
      // Handle error
    }
  }

  async function fetchRows(postData) {
    try {
      const data = await api.post("university/getByCountry", postData);
      const rows = data.data.elements;
      setStatus(rows.map((row) => ({ id: row.id, checked: row.validated === 1 })));
      setRows(rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  }

  async function fetchAllUniversities() {
    try {
      const data = await api.get("university/getAllInfo");
      const rows = data.data.elements;
      setStatus(rows.map((row) => ({ id: row.id, checked: row.validated === 1 })));
      setRows(rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  }

  const handleUserCard = (id) => {
    setUserId(id);
    handleOpenUserCard();
  };

  async function deleteUniversity() {
    try {
      const data = await api.get("university/delete/" + universityId);
      if (country != null) fetchRows({ country: country, validated: validated });
      else fetchAllUniversities();
      handleCloseDeleteModal();
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  }

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  const handleFilter = (country, validated) => {
    setPage(1);
    setCountry(country);
    setValidated(validated);
    const postData = { country: country, validated: validated };
    fetchRows(postData);
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
      console.error("Invalid page number");
    }
  };

  const updatedUniversity = () => {
    if (country != null || validated != null) fetchRows({ country: country, validated: validated });
    else fetchAllUniversities();
    handleCloseEditModal();
  };

  const addUniversity = () => {
    fetchAllUniversities();
    handleCloseAddModal();
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
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        text={modalText}
        onDo={() => deleteUniversity()}
        onCancel={handleCloseDeleteModal}
      />

      <EditModal
        open={openEditModal}
        onClose={handleOpenEditModal}
        id={universityId}
        onDo={updatedUniversity}
        onCancel={handleCloseEditModal}
      />

      <AddUniversityModal
        open={openAddModal}
        onDo={addUniversity}
        onCancel={handleCloseAddModal}
        onClose={handleCloseAddModal}
      />

      <UserCard open={openUserCard} onClose={handleCloseUserCard} id={userId} />

      <Grid alignItems="center" p={5} sx={{ "@media (max-width: 900px)": { p: 2 } }}>
        <SearchBar onFilter={handleFilter} />
        <SoftBox
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <CardBody>
            <FontAwesomeIcon icon={faPlus} size="lg" onClick={() => handleOpenAddModal()} />
          </CardBody>
        </SoftBox>

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
                <SoftBox width="10%">
                  <SoftTypography fontWeight="bold" color="light">
                    Country
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="10%">
                  <SoftTypography fontWeight="bold" color="light">
                    Latitude
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="10%">
                  <SoftTypography fontWeight="bold" color="light">
                    Longitude
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="30%" sx={{ display: "flex", justifyContent: "center" }}>
                  <SoftTypography fontWeight="bold" color="light">
                    Status
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="5%" sx={{ display: "flex", justifyContent: "center" }}>
                  <SoftTypography fontWeight="bold" color="light"></SoftTypography>
                </SoftBox>
                <SoftBox width="5%" sx={{ display: "flex", justifyContent: "center" }}>
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
                      <SoftTypography variant="h6" fontWeight="bold">
                        {key.id}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox width="20%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.name}
                      </SoftTypography>
                      {key.suggested_by != null ? (
                        <FontAwesomeIcon
                          icon={faUser}
                          onClick={() => handleUserCard(key.suggested_by)}
                        />
                      ) : null}
                    </SoftBox>
                    <SoftBox width="10%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.country}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox width="10%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.latitude}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox width="10%">
                      <SoftTypography variant="h6" fontWeight="light">
                        {key.longitude}
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
                        onChange={handleChange(key.id, key.name)}
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
                        width: "5%",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SoftButton iconOnly onClick={() => handleEditUniversity(key.id)}>
                        <FontAwesomeIcon icon={faPen} size="lg" />
                      </SoftButton>
                    </SoftBox>
                    <SoftBox
                      sx={{
                        width: "5%",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "right",
                      }}
                    >
                      <SoftButton iconOnly onClick={() => handleDeleteUniversity(key.id, key.name)}>
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                      </SoftButton>
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
                <SoftButton onClick={handleGoToPage}>Go</SoftButton>
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
