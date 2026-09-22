import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Question from "./components/question";
import SearchBar from "./components/SearchBar";
import CircularProgress from "@mui/material/CircularProgress";
import SoftTypography from "components/SoftTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useApi } from "api";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

function Main() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectSubtopic] = useState(null);
  const [pageInput, setPageInput] = useState("");
  const materialsPerPage = 4;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = questions.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const api = useApi();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (
      !isNaN(pageNumber) &&
      pageNumber > 0 &&
      pageNumber <= Math.ceil(questions.length / materialsPerPage)
    ) {
      setPage(pageNumber);
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } else {
      // Handle invalid page number (optional)
      console.error("Invalid page number");
    }
  };

  async function fetchQuestions() {
    try {
      const data = await api.get("question/getAll");
      const questions = data.data.elements;
      setQuestions(questions);
      setLoading(false);
    } catch (error) {
      setLoading(true);
    }
  }

  async function filterQuestions(topic, subtopic) {
    try {
      if (subtopic === null) {
        try {
          const data = await api.get("question/getByTopic/" + topic);
          setQuestions(data.data.elements);
        } catch (error) {
        }
      } else {
        try {
          const data = await api.get("question/getBySubtopic/" + subtopic);
          setQuestions(data.data.elements);
        } catch (error) {
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const handleFilter = (topic, subtopic) => {
    setPage(1);
    setLoading(true);
    setSelectedTopic(topic);
    setSelectSubtopic(subtopic);
    filterQuestions(topic, subtopic);
  };

  const handleSaveQuestion = () => {
    if (selectedTopic == null) {
      fetchQuestions();
    } else {
      filterQuestions(selectedTopic, selectedSubtopic);
    }
  };

  function handleDeleteQuestion(id) {
    const updatedQuestions = [...questions];
    const index = questions.findIndex((question) => question.id === id);
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
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
        ) : questions.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">
              No data recorded
            </SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => {
            var subtopic = null;
            if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (
              <Question
                key={index}
                level={key.newLevel}
                topic={key.platform__topic.name}
                subtopic={subtopic}
                question={key.question}
                status={key.validate}
                questionID={key.id}
                validate={key.validate}
                answers={[key.answer1, key.answer2, key.answer3, key.answer4]}
                image={key.file_name}
                extension={key.file_ext}
                onEdit={handleSaveQuestion}
                onDelete={handleDeleteQuestion}
              />
            );
          })
        )}
      </Grid>
      {!loading && questions.length > 0 && (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            color="info"
            count={Math.ceil(questions.length / materialsPerPage)}
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
            <SoftButton color="info" onClick={handleGoToPage}>
              Go
            </SoftButton>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}

export default Main;
