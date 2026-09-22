// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Video from "./components/video";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";

function Main() {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const materialsPerPage = 3;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = videos.slice(indexOfFirstMaterial, indexOfLastMaterial);
  var postData = {
    topic: null,
    subtopic: null,
    type: [1, 2],
  };
  useEffect(() => {
    getVideos();
  }, []);

  async function getVideos() {
    try {
      const data = await api.post("material/getAll", postData);
      setVideos(data.data.elements);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function filterVideos(filterData) {
    setLoading(true);
    try {
      const data = await api.post("material/getAll", filterData);
      setVideos(data.data.elements);
      setLoading(false);
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
    var data = {
      topic: topic,
      subtopic: subtopic,
      type: [1, 2],
    };

    if (topic == null) {
      data = {
        topic: null,
        subtopic: null,
        type: [1, 2],
      };
    }

    filterVideos(data);
  }

  const handleFilter = (topic, subtopic) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setPage(1);
    const data = {
      topic: topic,
      subtopic: subtopic,
      type: [1, 2],
    };

    filterVideos(data);
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
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
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : videos.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">
              No data recorded
            </SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => {
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
      {!loading && videos.length > 0 && (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            color="info"
            count={Math.ceil(videos.length / materialsPerPage)}
            page={page}
            onChange={handlePagination}
          />
        </Stack>
      )}
    </Card>
  );
}

export default Main;
