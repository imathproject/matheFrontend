import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OlympicQuestionCard from "components/olympiads/OlympicQuestionCard";
import OlympicFilters from "components/olympiads/OlympicFilters";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import { COLORS } from "components/olympiads/colors";
import OlympicPageCard from "components/olympiads/OlympicPageCard";
import OlympicEmptyState from "components/olympiads/OlympicEmptyState";
import OlympicButton from "components/olympiads/OlympicButton";

function Main({ canEdit }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const api = useApi();

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
      console.error("Invalid page number");
    }
  };

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function fetchQuestions(filterData) {
    try {
      setLoading(true);
      const params = {};
      if (filterData) {
        if (filterData.id_olympic_phase) params.id_olympic_phase = filterData.id_olympic_phase;
        if (filterData.id_olympic_level) params.id_olympic_level = filterData.id_olympic_level;
        if (filterData.id_olympic_year) params.id_olympic_year = filterData.id_olympic_year;
      }

      const endpoint = filterData && filterData.id_olympic
        ? `olympicQuestion/getEnriched/${filterData.id_olympic}`
        : 'olympicQuestion/getEnriched';

      const data = await api.get(endpoint, { params });
      setQuestions(data.data.elements || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const handleFilter = ({ olympic, level, phase, year }) => {
    setOlympic(olympic);
    setOlympicLevel(level);
    setOlympicYear(year);
    setOlympicPhase(phase);
    setPage(1);
    fetchQuestions({
      id_olympic: olympic?.id,
      id_olympic_level: level?.id,
      id_olympic_year: year?.id,
      id_olympic_phase: phase?.id,
    });
  };

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

  const pagination = !loading && questions.length > 0 && (
    <Stack mt={2} spacing={3} mb={2} alignItems="center">
      <Pagination
        sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: COLORS.lightBrown, color: COLORS.white } }}
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
        <OlympicButton onClick={handleGoToPage}>
          Go
        </OlympicButton>
      </Stack>
    </Stack>
  );

  return (
    <OlympicPageCard mobilePadding={2} footer={pagination}>
      <OlympicFilters enriched required={["olympic"]} onChange={handleFilter} />
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
        <OlympicEmptyState message="No data recorded" />
      ) : (
        currentMaterial.map((key, index) => (
          <OlympicQuestionCard
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
            showStatus={false}
            questionID={key.id}
            onDelete={handleDeleteQuestion}
            // The ids travel with the texts so an edit keeps them on the server.
            answers={key.alternatives ? key.alternatives.map(alt => ({ id: alt.id, text: alt.text })) : []}
            onEdit={handleSaveQuestion}
            canManage={canEdit}
            extension={key.file_ext}
            image={key.file_name}
            keywords={key.keywords || []}
            difficulty={key.difficulty ?? null}
          />
        ))
      )}
    </OlympicPageCard>
  );
}

Main.propTypes = {
  canEdit: PropTypes.bool,
};

Main.defaultProps = {
  canEdit: false,
};

export default Main;
