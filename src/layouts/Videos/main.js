// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Video from "./components/video";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftButton from "components/SoftButton";
import Modal from "@mui/material/Modal";
import AddVideo from "./components/AddVideo";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Scrollbar } from "react-scrollbars-custom";

//Fontawesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [validation, setValidation] = useState([]);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const api = useApi();
  const materialsPerPage = 3;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = videos.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const postData = {
    topic: null,
    subtopic: null,
    validate: null,
    type: [1, 2],
    keywords: null,
  };

  useEffect(() => {
    getMaterials(postData);
  }, []);

  async function getMaterials(postData) {
    try {
      const data = await api.post("material/getCollection", postData);
      setVideos(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function filterMaterials(filterData) {
    try {
      const data = await api.post("material/getCollection", filterData);
      setVideos(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  function handleDeleteVideo(id) {
    const updatedVideo = [...videos];
    const index = videos.findIndex((video) => video.id === id);
    updatedVideo.splice(index, 1);
    setVideos(updatedVideo);
  }

  function handleSaveVideo() {
    setOpen(false);
    var data = {
      topic: topic,
      subtopic: subtopic,
      validate: validation,
      type: [1, 2],
      keywords: null,
    };

    if (topic == null) {
      data = {
        topic: null,
        subtopic: null,
        level: null,
        validate: null,
        type: [1, 2],
        keywords: null,
      };
    }

    filterMaterials(data);
  }

  const handleFilter = (topic, subtopic, validation) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setValidation(validation);
    setPage(1);
    const data = {
      topic: topic,
      subtopic: subtopic,
      validate: validation,
      type: [1, 2],
      keywords: null,
    };

    filterMaterials(data);
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <SoftBox sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <SoftButton variant="gradient" color="info" size="medium" onClick={handleOpen}>
          Add Video&nbsp;
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </SoftButton>
      </SoftBox>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style, display: "flex", flexDirection: "column" }}>
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#3447767",
              mb: 4,
              flexShrink: 0,
            }}
          >
            <SoftTypography variant="title" fontWeight="bold">
              Video
            </SoftTypography>
            <SoftButton variant="text" color="dark" onClick={handleClose}>
              <SoftTypography mr={1} variant="title" fontWeight="bold">
                Close
              </SoftTypography>
              <FontAwesomeIcon icon={faX} size="4x" />
            </SoftButton>
          </SoftBox>
          <SoftBox sx={{ flex: 1, minHeight: 0 }}>
            <Scrollbar noScrollX style={{ height: "100%" }}>
              <AddVideo onSave={handleSaveVideo} />
            </Scrollbar>
          </SoftBox>
        </SoftBox>
      </Modal>

      <Grid
        alignItems="center"
        p={5}
        sx={{
          "@media (max-width: 600px)": {
            p: 2,
          },
        }}
      >
        <SearchBar onFilter={handleFilter} />
        {videos.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">
              No data recorded
            </SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => {
            // var subtopic = null;
            // if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (
              <Video
                key={index}
                videoID={key.id}
                description={key.description}
                title={key.title}
                author={key.author}
                status={key.validate}
                link={key.link}
                onEdit={handleSaveVideo}
                onDelete={handleDeleteVideo}
              />
            );
          })
        )}
      </Grid>
      {videos.length != 0 ? (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            color="info"
            count={Math.ceil(videos.length / materialsPerPage)}
            page={page}
            onChange={handlePagination}
          />
        </Stack>
      ) : null}
    </Card>
  );
}

export default Main;
