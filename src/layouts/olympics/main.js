/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Button, MenuItem, Select, FormControl, IconButton } from "@mui/material";

import Table from "examples/Tables/Table";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Data
import authorsTableData from "./data/authorsTableData";
import colors from "components/olympiads/colors";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faPlus, faPen, faTrash, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Scrollbar } from 'react-scrollbars-custom';
import Modal from '@mui/material/Modal';
import SoftButton from "components/SoftButton";
import OlympicButton from "components/olympiads/OlympicButton";
import OlympicForm from "components/olympiads/OlympicForm";

//API
import { useApi } from 'api';

function Main() {
  const { columns } = authorsTableData;
  const [rows, setRows] = useState([]);
  const api = useApi();
  const [editValues, setEditValues] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleDeleteOpen = (id, label) => {
    setDeleteTarget({ id, label });
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete("olympic/delete/" + deleteTarget.id);
      handleDeleteClose();
      fetchRows();
    } catch (error) {
      console.error(error);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "80%",
    bgcolor: '#FFFFFF',
    boxShadow: 24,
    p: 4,
    borderRadius: 6
  };

  useEffect(() => {
    fetchRows();
  }, []);

  async function fetchRows() {
    try {
      const data = await api.get("olympic/getAllEnriched");
      const olympics = data.data.elements;
      const transformedRows = olympics.map((item) => ({
        Olympic: (
          <SoftBox display="flex" flexDirection="column">
            <SoftTypography variant="caption" fontWeight="medium" color="text">
              {item.label}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary">
              {item.language}
            </SoftTypography>
          </SoftBox>
        ),
        Questions: item.questionCount,
        Manage: (
          <IconButton
            size="small"
            sx={{
              color: `${colors.lightBrown} !important`,
              "&:hover": {
                color: `${colors.brown} !important`,
                transform: "scale(1.15)",
              },
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => {
              setEditValues(item);
              handleOpen();
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
        ),
        Delete: (
          <IconButton
            size="small"
            sx={{
              color: `${colors.lightBrown} !important`,
              "&:hover": {
                color: `${colors.brown} !important`,
                transform: "scale(1.15)",
              },
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => {
              handleDeleteOpen(item.id, item.label);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
        ),
      }));
      setRows(transformedRows);
    } catch (error) {
      // Handle error
    }
  }

  const handleAddSave = () => {
    setAddOpen(false);
    fetchRows();
  };

  const handleEdit = () => {
    setOpen(false);
    fetchRows();
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <SoftBox sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <SoftButton
          sx={{ color: "#FFFFFF !important", backgroundColor: colors.lightBrown + "!important" }}
          size="medium"
          onClick={handleAddOpen}
        >
          Add Olympiad &nbsp;
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </SoftButton>
      </SoftBox>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox m={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: 1, borderColor: colors.brown, mb: 4 }}>
            <SoftTypography variant="title" fontWeight="bold" sx={{ color: colors.brown }}>
              Edit Olympiad
            </SoftTypography>
            <OlympicButton variant="text" tone="neutral" color="dark" onClick={handleClose}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </OlympicButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <OlympicForm mode="edit" olympic={editValues} onSave={handleEdit} />
          </Scrollbar>
        </SoftBox>
      </Modal>

      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <SoftBox sx={{ ...style }}>
          <SoftBox m={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: 1, borderColor: colors.brown, mb: 4 }}>
            <SoftTypography variant="title" fontWeight="bold" sx={{ color: colors.brown }}>
              Add Olympiad
            </SoftTypography>
            <OlympicButton variant="text" tone="neutral" color="dark" onClick={handleAddClose}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </OlympicButton>
          </SoftBox>
          <Scrollbar noScrollX style={{ height: "80%" }}>
            <OlympicForm mode="create" onSave={handleAddSave} />
          </Scrollbar>
        </SoftBox>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-confirmation"
      >
        <SoftBox sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: "90%", sm: "50%", md: "40%" },
          bgcolor: "#FFFFFF",
          boxShadow: 24,
          p: 4,
          borderRadius: 6
        }}>
          <SoftBox sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color={colors.lightBrown} style={{ marginBottom: "20px" }} />
            <SoftTypography variant="h4" mt={3} sx={{ color: colors.brown, fontWeight: "bold", mb: 2, textAlign: "center" }}>
              Delete Olympiad
            </SoftTypography>
            <SoftTypography variant="body2" sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}>
              Are you sure you want to delete <strong>{deleteTarget?.label}</strong>? This action cannot be undone.
            </SoftTypography>
            <SoftBox display="flex" flexDirection="row" width="100%" justifyContent="space-around" gap={2}>
              <SoftButton variant="gradient" color="error" sx={{ width: "45%" }} onClick={handleDeleteConfirm}>
                Yes, delete it!
              </SoftButton>
              <SoftButton
                variant="contained"
                sx={{
                  width: "45%",
                  color: "#FFFFFF",
                  backgroundColor: `${colors.lightBrown} !important`,
                  "&:hover": { backgroundColor: `${colors.brown} !important` },
                  "&:focus:not(:hover)": { backgroundColor: `${colors.lightBrown} !important` }
                }}
                onClick={handleDeleteClose}
              >
                Cancel
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Modal>

      <Grid alignItems="center" p={5} sx={{
        '@media (max-width: 600px)': {
          p: 2,
        },
      }}>
        <SoftBox>
          <SoftBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <Table columns={columns} rows={rows} />
          </SoftBox>
        </SoftBox>
      </Grid>
    </Card>
  );
}

export default Main;
