import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { Button } from "react-bootstrap";
import { useApi } from "api";
import WarningModal from "./components/Modal";
import DraggableList from "react-draggable-list";
import TaskItem from "./components/TaskItem";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import SoftTypography from "components/SoftTypography";
import { Scrollbar } from "react-scrollbars-custom";
import AddPublication from "./components/AddPublication";
import EditPublication from "./components/EditPublication";
import { Modal } from "@mui/material";

const RoundButton = styled(Button)`
  background-color: ${({ color }) => color || "#2596be"};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid ${({ color }) => color || "#2596be"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 4px 8px ${({ color }) => color || "#2596be"};

  &:hover {
    transform: scale(1.05);
    background-color: ${({ color }) => color || "#2596be"};
    border: 2px solid ${({ color }) => color || "#2596be"};
  }
`;

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

function Main() {
  const [publications, setPublications] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [id, setId] = useState(null);
  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);
  const handleOpenAddModal = () => setAddModal(true);
  const handleCloseAddModal = () => setAddModal(false);
  const api = useApi();
  useEffect(() => {
    getPublications();
  }, []);

  async function getPublications() {
    try {
      const data = await api.get("publication/getAll");
      setPublications(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  const handleReorder = (newList) => {
    const updatedPublications = newList.map((task, index) => ({
      ...task,
      order: index,
    }));
    setPublications(updatedPublications);
    reorderPublications(updatedPublications);
  };

  async function reorderPublications(publications) {
    const postData = publications;
    try {
      const data = await api.post("publication/updateOrder", publications);
    } catch (error) {
      // Handle error
    }
  }

  const handleUpdateAfterDelete = (id) => {
    setPublications((prevPublications) =>
      prevPublications.filter((publication) => publication.id !== id)
    );
  };

  const handleAddNewPublication = () => {
    getPublications();
    handleCloseAddModal();
    handleCloseEditModal();
    setId(null);
  };

  const handleEdit = (id) => {
    setId(id);
    handleOpenEditModal();
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
        <RoundButton color="#2596be" onClick={handleOpenAddModal}>
          <FontAwesomeIcon icon={faPlus} color="white" />
        </RoundButton>
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
              borderColor: "#3447767",
              mb: 4,
            }}
          >
            <SoftTypography variant="title" fontWeight="bold">
              Publication
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseAddModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <AddPublication onSave={handleAddNewPublication} />
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
              borderColor: "#3447767",
              mb: 4,
            }}
          >
            <SoftTypography variant="title" fontWeight="bold">
              Edit Publication
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseEditModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <EditPublication onSave={handleAddNewPublication} id={id} />
          </Scrollbar>
        </SoftBox>
      </Modal>
      {/* <WarningModal
        open={openStatus}
        onClose={handleCloseStatus}
        text={modalText}
        onDo={updatedStatus}
        onCancel={handleCloseStatus}
      /> */}
      <SoftBox
        sx={{
          width: "80%",
          height: "100%",
        }}
      >
        <DraggableList
          itemKey="id"
          template={(props) => (
            <TaskItem {...props} onUpdate={handleUpdateAfterDelete} onEdit={handleEdit} />
          )}
          list={publications}
          onMoveEnd={(newList) => handleReorder(newList)}
          container={() => document.body}
        />
      </SoftBox>
    </Card>
  );
}

export default Main;
