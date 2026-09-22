// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Testimonial from "./components/Testimonial";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
function Main() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const materialsPerPage = 3;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = testimonials.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const api = useApi();
  const postData = {
    topic: null,
    subtopic: null,
    type: [3],
  };

  useEffect(() => {
    getTestimonials();
  }, []);

  async function getTestimonials() {
    try {
      const data = await api.get("testimonial/getAll");
      setTestimonials(data.data.elements);
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

  function handleDeleteMaterial(id) {
    const updatedMaterial = [...testimonials];
    const index = testimonials.findIndex((material) => material.id === id);
    updatedMaterial.splice(index, 1);
    setTestimonials(updatedMaterial);
  }

  function handleSaveTestimonial() {
    filterTestimonials();
  }

  const handleFilter = () => {
    filterTestimonials();
  };

  async function filterTestimonials() {
    setLoading(true);
    try {
      const data = await api.get("testimonial/getAll");
      setTestimonials(data.data.elements);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

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
        ) : testimonials.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">
              No data recorded
            </SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => {
            return (
              <Testimonial
                key={index}
                testimonial={key.testimonial}
                title={key.title}
                name={key.user_final.name + " " + key.user_final.surname}
                country={key.user_final.country.name}
                countryAcronym={key.user_final.country.alpha_2}
                role={key.user_final.role.description}
                validated={key.validated}
                testimonialID={key.id}
                publicStatus={key.public}
                onEdit={handleSaveTestimonial}
                onDelete={handleDeleteMaterial}
              />
            );
          })
        )}
      </Grid>
      {!loading && testimonials.length > 0 && (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            color="info"
            count={Math.ceil(testimonials.length / materialsPerPage)}
            page={page}
            onChange={handlePagination}
          />
        </Stack>
      )}
    </Card>
  );
}

export default Main;
