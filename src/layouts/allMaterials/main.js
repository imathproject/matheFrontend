// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Material from "./components/Material";
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
  const [materials, setMaterials] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const materialsPerPage = 3;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const api = useApi();
  const postData = {
    topic: null,
    subtopic: null,
    type: [3],
  };

  useEffect(() => {
    getMaterials(postData);
  }, []);

  async function getMaterials(postData) {
    try {
      const data = await api.post("material/getAll", postData);
      setMaterials(data.data.elements);
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

  async function filterMaterials(filterData) {
    setLoading(true);
    try {
      const data = await api.post("material/getAll", filterData);
      setMaterials(data.data.elements);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  function handleDeleteMaterial(id) {
    const updatedMaterial = [...materials];
    const index = materials.findIndex((material) => material.id === id);
    updatedMaterial.splice(index, 1);
    setMaterials(updatedMaterial);
  }

  function handleSaveMaterial() {
    var data = {
      topic: topic,
      subtopic: subtopic,
      type: [3],
    };

    if (topic == null) {
      data = {
        topic: null,
        subtopic: null,
        type: [3],
      };
    }

    filterMaterials(data);
  }

  const handleFilter = (topic, subtopic) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setPage(1);

    const data = {
      topic: topic,
      subtopic: subtopic,
      type: [3],
    };

    filterMaterials(data);
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
        ) : materials.length === 0 ? (
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
              <Material
                key={index}
                materialId={key.id}
                description={key.description}
                title={key.title}
                author={key.author}
                status={key.validate}
                file_ext={key.file_ext}
                onEdit={handleSaveMaterial}
                onDelete={handleDeleteMaterial}
                name={key.file_name}
              />
            );
          })
        )}
      </Grid>
      {!loading && materials.length > 0 && (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            color="info"
            count={Math.ceil(materials.length / materialsPerPage)}
            page={page}
            onChange={handlePagination}
          />
        </Stack>
      )}
    </Card>
  );
}

export default Main;
