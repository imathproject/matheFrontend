// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Question from "./components/question";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import "./css/index.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
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
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const materialsPerPage = 4;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = questions.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const api = useApi();

  const postData = {
    topic: null,
    subtopic: null,
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function fetchQuestions() {
    try {
      const data = await api.post("question/questionsValidation", postData);
      const questions = data.data.elements;
      setQuestions(questions);
    } catch (error) {
      // Handle error
    }
  }

  async function filterQuestions(filterData) {
    try {
      const data = await api.post("question/questionsValidation", filterData);
      setQuestions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  function handleDeleteQuestion(id) {
    const updatedQuestions = [...questions];
    const index = questions.findIndex((question) => question.id === id);
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  }

  function handleSaveQuestion() {
    setOpen(false);
    const data = {
      topic: topic,
      subtopic: subtopic,
    };

    filterQuestions(data);
  }

  const handleFilter = (topic, subtopic) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setPage(1);
    const data = {
      topic: topic,
      subtopic: subtopic,
    };

    filterQuestions(data);
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
        {questions.length === 0 ? (
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
                onDelete={handleDeleteQuestion}
                answers={[key.answer1, key.answer2, key.answer3, key.answer4]}
                extension={key.file_ext}
                image={key.file_name}
                onEdit={handleSaveQuestion}
              />
            );
          })
        )}
      </Grid>
      {questions.length != 0 ? (
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
      ) : null}
    </Card>
  );
}

export default Main;
