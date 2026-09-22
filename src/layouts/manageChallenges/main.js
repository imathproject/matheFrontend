import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import { useApi } from "api";
import WarningModal from "./components/Modal";
import ChallengeItem from "./components/ChallengeItem";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import { Scrollbar } from "react-scrollbars-custom";
import AddChallenge from "./components/AddChallenge";
import EditChallenge from "./components/EditChallenge";
import { Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 4,
  borderRadius: 6,
};

function Main({ onViewResults }) {
  const [challengeList, setChallengeList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);
  const handleOpenAddModal = () => setAddModal(true);
  const handleCloseAddModal = () => setAddModal(false);
  const api = useApi();

  const selectedChallenge = challengeList.find((c) => c.id === selectedId);
  const isFinished = selectedChallenge?.status === "finished";

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const data = await api.get("challenge/getAll");
      setChallengeList(data.data.elements);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  }

  const handleUpdateAfterDelete = (id) => {
    setChallengeList((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleSave = () => {
    fetchChallenges();
    handleCloseAddModal();
    handleCloseEditModal();
    setSelectedId(null);
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    handleOpenEditModal();
  };

  const handleDeleteConfirm = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete("challenge/delete/" + selectedId);
      handleUpdateAfterDelete(selectedId);
      setDeleteModal(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put("challenge/updateStatus", { id, status });
      fetchChallenges();
    } catch (error) {
      console.error("Error updating challenge status:", error);
    }
  };

  const handleStart = (id) => {
    handleStatusUpdate(id, "started");
  };

  const handlePause = (id) => {
    handleStatusUpdate(id, "paused");
  };

  const handleFinishConfirm = (id) => {
    setSelectedId(id);
    setFinishModal(true);
  };

  const handleFinish = async () => {
    try {
      await api.put("challenge/updateStatus", { id: selectedId, status: "finished" });
      fetchChallenges();
      setFinishModal(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Error finishing challenge:", error);
    }
  };

  return (
    <Card
      sx={{
        minHeight: "80vh",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SoftBox sx={{ display: "flex", justifyContent: "flex-end", width: "100%", p: 2 }}>
        <SoftButton
          variant="gradient"
          color="info"
          size="medium"
          onClick={handleOpenAddModal}
        >
          Add Challenge&nbsp;
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </SoftButton>
      </SoftBox>

      <Modal
        open={addModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox
            m={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#344767",
              mb: 4,
            }}
          >
            <SoftTypography variant="title" fontWeight="bold">
              Add Challenge
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseAddModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <AddChallenge onSave={handleSave} />
          </Scrollbar>
        </SoftBox>
      </Modal>

      <Modal
        open={editModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox
            m={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#344767",
              mb: 4,
            }}
          >
            <SoftTypography variant="title" fontWeight="bold">
              {isFinished ? "Verify Challenge Information" : "Edit Challenge"}
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseEditModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <EditChallenge onSave={handleSave} id={selectedId} />
          </Scrollbar>
        </SoftBox>
      </Modal>

      <WarningModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        text="Are you sure you want to delete this challenge?"
        onDo={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />

      <WarningModal
        open={finishModal}
        onClose={() => setFinishModal(false)}
        text="Are you sure you want to finish this challenge? Students will be able to see their results."
        onDo={handleFinish}
        onCancel={() => setFinishModal(false)}
      />

      <SoftBox
        sx={{
          width: "90%",
          height: "100%",
        }}
      >
        {challengeList.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography fontWeight="bold" color="info">
              No challenges found
            </SoftTypography>
          </SoftBox>
        ) : (
          challengeList.map((item) => (
            <ChallengeItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onViewResults={onViewResults}
              onStart={handleStart}
              onPause={handlePause}
              onFinish={handleFinishConfirm}
            />
          ))
        )}
      </SoftBox>
    </Card>
  );
}

Main.propTypes = {
  onViewResults: PropTypes.func.isRequired,
};

export default Main;
