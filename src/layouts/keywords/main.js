import React, { useState, useEffect } from "react";
import Table from "examples/Tables/Table";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleExclamation, faPen } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Grid, Stack, Pagination } from "@mui/material";
import { useApi } from "api";
import SoftBox from "components/SoftBox";
import authorsTableData from "./data/authorsTableData";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import Modal from "@mui/material/Modal";

function Main() {
  const [rows, setRows] = useState([]);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [saveModal, setSaveModal] = useState(false);
  const handleSaveModalOpen = () => setSaveModal(true);
  const handleSaveModalClose = () => {
    handleFilter(topic, subtopic);
    setId(null);
    setKeyword("");
    setSaveModal(false);
  };
  const [idDelete, setIdDelete] = useState(null);
  const [labelDelete, setLabelDelete] = useState(null);
  const [keywordObjects, setKeywordObjects] = useState([]);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [id, setId] = useState(null);
  const [keyword, setKeyword] = useState("");

  const api = useApi();
  const { columns } = authorsTableData;

  async function handleDeleteKeyword() {
    try {
      const data = await api.get("keyword/delete/" + idDelete);
      fetchFilterRows(topic, subtopic);
      handleClose();
    } catch (error) {}
    setIdDelete(null);
    setLabelDelete(null);
  }

  useEffect(() => {
    handleRows();
  }, [data]);

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

  async function fetchFilterRows(topic, subtopic) {
    let url = "keyword/getKeysEditByTopic/" + topic;
    if (subtopic !== null) url = "keyword/getKeysEditBySubtopic/" + subtopic;
    try {
      const data = await api.get(url);
      const rows = data.data.elements;
      const newKeywordObjects = rows.map((key) => ({ id: key.id, label: key.label }));
      setKeywordObjects(newKeywordObjects);
      setData(data.data.elements);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleRows = () => {
    const transformedRows = data.map((key, index) => ({
      ID: key.id,
      Topic: key.platform__topic.name,
      Subtopic: key.platform__subtopic ? key.platform__subtopic.name : "No subtopic",
      Keyword: (
        <SoftTypography variant="button" fontWeight="medium" key={index} sx={{ width: "100%" }}>
          {key.label}
        </SoftTypography>
      ),
      Edit: (
        <SoftButton
          variant="text"
          color="info"
          onClick={() => {
            handleEdit(key.id);
          }}
        >
          <FontAwesomeIcon icon={faPen} size="xs" />
        </SoftButton>
      ),
      Manage: (
        <SoftButton
          variant="text"
          color="info"
          onClick={() => {
            handleOpen();
            setIdDelete(key.id);
            setLabelDelete(key.label);
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </SoftButton>
      ),
    }));
    setRows(transformedRows);
  };

  const handleKeywordChange = (value, id) => {
    setKeywordObjects((prevKeywordObjects) => {
      const updatedKeywordObjects = prevKeywordObjects.map((keywordObj) =>
        keywordObj.id === id ? { ...keywordObj, label: value } : keywordObj
      );
      return updatedKeywordObjects;
    });
  };

  const handleFilter = (topic, subtopic) => {
    setTopic(topic);
    setSubtopic(subtopic);
    fetchFilterRows(topic, subtopic);
  };

  const handleEdit = (id) => {
    const keyword = keywordObjects.find((obj) => obj.id === id).label;
    setId(id);
    setKeyword(keyword);
    handleSaveModalOpen();
  };

  async function save() {
    let error = false;
    let lastValues = keywordObjects;

    keywordObjects.forEach((obj) => {
      if (!obj.label.trim()) {
        error = true;
        setErrorMessage("There are empty fields");
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
      }
    });

    if (!error) {
      lastValues.forEach((obj) => {
        obj.name = obj.label;
        delete obj.label;
      });
      const postData = {
        id: id,
        name: keyword,
      };

      try {
        const data = await api.post("keyword/update", postData);
        setErrorMessage(null);
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        handleFilter(topic, subtopic);
        handleSaveModalClose();
      } catch (error) {
        // Handle error
      }
    }
  }
  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Modal
        open={saveModal}
        onClose={handleSaveModalClose}
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
            <SoftTypography variant="h4" mt={3}>
              Edit the keyword above
            </SoftTypography>
            <SoftInput
              defaultValue={keyword}
              sx={{ width: "100%" }}
              error={keyword.trim() === ""}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <SoftBox
              mt={4}
              display="flex"
              flexDirection="row"
              width="100%"
              justifyContent="space-around"
            >
              <SoftButton variant="gradient" color="success" sx={{ width: "30%" }} onClick={save}>
                Save
              </SoftButton>
              <SoftButton
                variant="gradient"
                color="info"
                sx={{ width: "30%" }}
                onClick={handleSaveModalClose}
              >
                Cancel
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Modal>
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
              Are you sure you want to delete the &quot;{labelDelete}&quot; keyword?{" "}
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
                onClick={handleDeleteKeyword}
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
      <Grid alignItems="center" p={5} sx={{ "@media (max-width: 600px)": { p: 2 } }}>
        <SoftTypography variant="h6" fontWeight="light">
          Please select a topic to filter the keywords
        </SoftTypography>
        <SearchBar onFilter={handleFilter} onAdd={() => fetchFilterRows(topic, subtopic)} />
        {rows.length > 0 && (
          <>
            {errorMessage && (
              <SoftTypography mb={2} color="error" variant="h6" fontWeight="light">
                {" "}
                Please fill in all the parameters
              </SoftTypography>
            )}

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
            <SoftBox
              borderRadius="lg"
              sx={{ display: "flex", width: "100%", background: "rgb(5, 120, 183, 0.2)" }}
            >
              <SoftTypography m={2} variant="h6" fontWeight="bold">
                Total keywords:
              </SoftTypography>
              <SoftTypography variant="h6" my={2}>
                {data.length}
              </SoftTypography>
            </SoftBox>

            <SoftBox sx={{ display: "flex", width: "100%", justifyContent: "flex-end", mt: 2 }}>
              <SoftButton variant="gradient" color="info" sx={{ width: "10%" }} onClick={save}>
                Save
              </SoftButton>
            </SoftBox>
          </>
        )}
      </Grid>
    </Card>
  );
}

export default Main;
