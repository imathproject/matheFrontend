import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { useApi } from "api";

import OlympicQuestionCard from "components/olympiads/OlympicQuestionCard";
import OlympicQuestionForm from "components/olympiads/OlympicQuestionForm";
import OlympicFilters from "components/olympiads/OlympicFilters";
import OlympicStatusFilter from "components/olympiads/OlympicStatusFilter";
import OlympicPageCard from "components/olympiads/OlympicPageCard";
import OlympicEmptyState from "components/olympiads/OlympicEmptyState";
import OlympicPagination from "components/olympiads/OlympicPagination";
import OlympicButton from "components/olympiads/OlympicButton";
import OlympicModal from "components/olympiads/OlympicModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const [open, setOpen] = useState(false);
  const [olympic, setOlympic] = useState(null);
  const [olympicLevel, setOlympicLevel] = useState(null);
  const [olympicYear, setOlympicYear] = useState(null);
  const [olympicPhase, setOlympicPhase] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [validation, setValidation] = useState([1, 2, 3, 4]);
  const [page, setPage] = useState(1);
  const materialsPerPage = 4;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  // The olympiad narrowing is done by the server; the validation states are a
  // client-side cut of what came back, so the pagination counts the filtered
  // list rather than the fetched one.
  const filteredQuestions = questions.filter((question) =>
    validation.includes(Number(question.validate))
  );
  const currentMaterial = filteredQuestions.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const api = useApi();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };

  async function fetchQuestions(filterData) {
    try {
      const params = {};
      if (filterData) {
        if (filterData.id_olympic_phase) params.id_olympic_phase = filterData.id_olympic_phase;
        if (filterData.id_olympic_level) params.id_olympic_level = filterData.id_olympic_level;
        if (filterData.id_olympic_year) params.id_olympic_year = filterData.id_olympic_year;
      }

      const url =
        filterData && filterData.id_olympic
          ? `olympicQuestion/getMine/${filterData.id_olympic}`
          : `olympicQuestion/getMine`;

      const data = await api.get(url, { params });
      setQuestions(data.data.elements || []);
    } catch (error) {
      console.error(error);
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
    fetchQuestions({
      id_olympic: olympic?.id,
      id_olympic_level: olympicLevel?.id,
      id_olympic_year: olympicYear?.id,
      id_olympic_phase: olympicPhase?.id,
    });
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

  // Nothing to re-fetch: the states are filtered out of the list already in
  // hand, so this only rewinds to the first page of the new cut.
  const handleValidationFilter = (states) => {
    setValidation(states);
    setPage(1);
  };

  return (
    <>
      <OlympicPageCard
        mobilePadding={2}
        header={
          <SoftBox sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <OlympicButton size="medium" onClick={handleOpen}>
              Add Question &nbsp;
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </OlympicButton>
          </SoftBox>
        }
        footer={
          <OlympicPagination
            count={Math.ceil(filteredQuestions.length / materialsPerPage)}
            page={page}
            onChange={handlePagination}
          />
        }
      >
        <OlympicFilters required={["olympic"]} onChange={handleFilter} />
        <OlympicStatusFilter value={validation} onChange={handleValidationFilter} />
        {filteredQuestions.length === 0 ? (
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
              levelObj={
                key.olympic_level
                  ? { id: key.olympic_level.id, label: key.olympic_level.level }
                  : null
              }
              yearObj={
                key.olympic_year ? { id: key.olympic_year.id, label: key.olympic_year.year } : null
              }
              phaseObj={
                key.olympic_phase
                  ? { id: key.olympic_phase.id, label: key.olympic_phase.phase }
                  : null
              }
              status={key.validate}
              questionID={key.id}
              onDelete={handleDeleteQuestion}
              answers={key.alternatives ? key.alternatives.map((alt) => alt.text) : []}
              onEdit={handleSaveQuestion}
              // The author owns a question until it is judged: a draft or a
              // rejected one is still theirs to fix or remove, an approved or
              // pending one is not.
              canManage={[2, 3].includes(Number(key.validate))}
              extension={key.file_ext}
              image={key.file_name}
            />
          ))
        )}
      </OlympicPageCard>

      <OlympicModal open={open} onClose={handleClose} title="Question">
        <OlympicQuestionForm
          mode="create"
          layout="stacked"
          onSave={handleSaveQuestion}
          actions={(submit) => (
            <>
              {/* A draft only has to know which olympiad it belongs to; the
                  statement and the alternatives can still be empty. */}
              <SoftButton
                variant="gradient"
                color="success"
                sx={{ width: "10%" }}
                onClick={() => submit(3, { require: "filters" })}
              >
                Save
              </SoftButton>
              <OlympicButton sx={{ width: "10%" }} onClick={() => submit(4)}>
                Submit
              </OlympicButton>
            </>
          )}
        />
      </OlympicModal>
    </>
  );
}

export default Main;
