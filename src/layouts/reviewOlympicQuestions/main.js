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
import COLORS from "components/olympiads/colors";

function Main() {
  const [questions, setQuestions] = useState([]);
  // The olympiads the caller may review; null until the server has answered.
  const [scope, setScope] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [olympic, setOlympic] = useState(null);
  const [olympicLevel, setOlympicLevel] = useState(null);
  const [olympicYear, setOlympicYear] = useState(null);
  const [olympicPhase, setOlympicPhase] = useState(null);

  const materialsPerPage = 4;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = questions.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const noScope = scope !== null && scope.length === 0;
  const api = useApi();

  useEffect(() => {
    fetchScope();
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
      console.error("Invalid page number");
    }
  };

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function fetchScope() {
    try {
      const data = await api.get("olympicQuestion/reviewScope");
      setScope(data.data.elements || []);
    } catch (error) {
      console.error("Error fetching the olympiads to review:", error);
    }
  }

  async function fetchQuestions(filterData) {
    try {
      // The server forces validate = 4 and the reviewer's own scope; it only
      // takes the olympiad/level/year/phase narrowing from here.
      const params = {};
      if (filterData) {
        if (filterData.id_olympic_phase) params.id_olympic_phase = filterData.id_olympic_phase;
        if (filterData.id_olympic_level) params.id_olympic_level = filterData.id_olympic_level;
        if (filterData.id_olympic_year) params.id_olympic_year = filterData.id_olympic_year;
      }

      const endpoint = filterData && filterData.id_olympic
        ? `olympicQuestion/getForValidation/${filterData.id_olympic}`
        : 'olympicQuestion/getForValidation';

      const data = await api.get(endpoint, { params });
      setQuestions(data.data.elements || []);
    } catch (error) {
      console.error("Error fetching validation questions:", error);
    }
  }

  function handleDeleteQuestion(id) {
    const updatedQuestions = [...questions];
    const index = questions.findIndex((question) => question.id === id);
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  }

  function handleSaveQuestion() {
    fetchQuestions({
      id_olympic: olympic?.id,
      id_olympic_level: olympicLevel?.id,
      id_olympic_year: olympicYear?.id,
      id_olympic_phase: olympicPhase?.id,
    });
  }

  const handleFilter = (olympics, level, year, phase) => {
    setOlympic(olympics);
    setOlympicLevel(level);
    setOlympicYear(year);
    setOlympicPhase(phase);
    setPage(1);
    fetchQuestions({
      id_olympic: olympics?.id,
      id_olympic_level: level?.id,
      id_olympic_year: year?.id,
      id_olympic_phase: phase?.id,
    });
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
        <SearchBar onFilter={handleFilter} olympicOptions={scope || []} />
        {questions.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography fontWeight="bold" sx={{ color: COLORS.brown }}>
              {noScope
                ? "You do not review any olympiad yet. Choose yours in Profile → Olympiads."
                : "No data waiting for validation"}
            </SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => (
            <Question
              key={key.id || index}
              question={key.question}
              olympicName={key.olympic?.name}
              levelName={key.olympic_level?.level}
              yearName={key.olympic_year?.year}
              phaseName={key.olympic_phase?.phase}
              olympicObj={key.olympic ? { id: key.olympic.id, label: key.olympic.name } : null}
              levelObj={key.olympic_level ? { id: key.olympic_level.id, label: key.olympic_level.level } : null}
              yearObj={key.olympic_year ? { id: key.olympic_year.id, label: key.olympic_year.year } : null}
              phaseObj={key.olympic_phase ? { id: key.olympic_phase.id, label: key.olympic_phase.phase } : null}
              status={key.validate}
              questionID={key.id}
              onDelete={handleDeleteQuestion}
              // The ids travel with the texts so a review keeps them on the server.
              answers={key.alternatives ? key.alternatives.map(alt => ({ id: alt.id, text: alt.text })) : []}
              onEdit={handleSaveQuestion}
              extension={key.file_ext}
              image={key.file_name}
              keywords={key.keywords || []}
              difficulty={key.difficulty ?? null}
            />
          ))
        )}
      </Grid>
      {questions.length !== 0 ? (
        <Stack mt={2} spacing={3} mb={2} alignItems="center">
          <Pagination
            sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: COLORS.primary, color: COLORS.white } }}
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
            <SoftButton sx={{ backgroundColor: COLORS.primary, color: "#FFFFFF" }} onClick={handleGoToPage}>
              Go
            </SoftButton>
          </Stack>
        </Stack>
      ) : null}
    </Card>
  );
}

export default Main;
