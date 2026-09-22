import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { useApi } from "api";
import WarningModal from "./components/Modal";
import TaskItem from "./components/TaskItem";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import { Scrollbar } from "react-scrollbars-custom";
import AddPublication from "./components/AddPublication";
import EditPublication from "./components/EditPublication";
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

function Main() {
  const [newsList, setNewsList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);
  const handleOpenAddModal = () => setAddModal(true);
  const handleCloseAddModal = () => setAddModal(false);
  const api = useApi();

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const data = await api.get("news/getAll/admin");
      setNewsList(data.data.elements);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  const handleUpdateAfterDelete = (id) => {
    setNewsList((prev) => prev.filter((news) => news.id !== id));
  };

  const handleSave = () => {
    fetchNews();
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
      await api.delete("news/delete/" + selectedId);
      handleUpdateAfterDelete(selectedId);
      setDeleteModal(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting news:", error);
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
          Add News&nbsp;
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
              Add News
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseAddModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <AddPublication onSave={handleSave} />
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
              Edit News
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleCloseEditModal}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <EditPublication onSave={handleSave} id={selectedId} />
          </Scrollbar>
        </SoftBox>
      </Modal>

      <WarningModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        text="Are you sure you want to delete this news article?"
        onDo={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />

      <SoftBox
        sx={{
          width: "90%",
          height: "100%",
        }}
      >
        {newsList.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography fontWeight="bold" color="info">
              No news articles found
            </SoftTypography>
          </SoftBox>
        ) : (
          newsList.map((item) => (
            <TaskItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />
          ))
        )}
      </SoftBox>
    </Card>
  );
}

export default Main;
