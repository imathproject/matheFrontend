import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import OlympicButton from "components/olympiads/OlympicButton";
import OlympicFilters from "components/olympiads/OlympicFilters";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { MuiFileInput } from "mui-file-input";
import { useApi } from "api";
import COLORS from "components/olympiads/colors";

// The image is stored as `olympic<id>.<ext>`, a name the server builds once the
// question has an id, so only the extension has to travel with the payload.
const fileExtensionOf = (file) => {
  if (!file) return null;
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(dot + 1) : null;
};

const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  pdf: "application/pdf",
};

const mimeTypeOf = (extension) =>
  MIME_TYPES[String(extension).toLowerCase()] || "application/octet-stream";

// A question needs at most seven alternatives: one true and six false.
const MAX_ALTERNATIVES = 7;

/**
 * The olympic question form, in both the shapes the screens ask for.
 *
 * `mode` picks the endpoint: "create" posts a new question and then uploads its
 * file under the id the server hands back, "edit" updates an existing one and
 * only touches the file when the reader replaced it.
 *
 * `layout` picks the shell: "split" is the two-column card the listings swap
 * themselves for in place, "stacked" is the single column the modals use.
 *
 * `actions` is a function of `submit`, so each screen keeps its own buttons —
 * they are where the screens genuinely differ (an author submits for review, a
 * reviewer validates or refuses), and folding them into a config object would
 * have lost that. `submit(validate)` checks every field first;
 * `submit(validate, { require: "filters" })` checks only the four dropdowns,
 * and `{ require: "none" }` checks nothing, which is what the two draft-saving
 * buttons did before they moved here.
 */
function OlympicQuestionForm({
  mode = "edit",
  layout = "split",
  id,
  onSave,
  actions,
  extraPayload,
  initialQuestion,
  initialAnswers,
  initialOlympic,
  initialLevel,
  initialYear,
  initialPhase,
  initialExtension,
  initialImage,
}) {
  const formRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [olympics, setOlympics] = useState(initialOlympic || null);
  const [level, setLevel] = useState(initialLevel || null);
  const [year, setYear] = useState(initialYear || null);
  const [phase, setPhase] = useState(initialPhase || null);
  const [question, setQuestion] = useState(initialQuestion || "");
  const [file, setFile] = useState(null);
  const [oldFile, setOldFile] = useState(null);
  const [alternatives, setAlternatives] = useState(
    initialAnswers && initialAnswers.length > 0 ? initialAnswers : ["", ""]
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    olympics: false,
    level: false,
    phase: false,
    year: false,
    question: false,
    alternatives: false,
  });
  const api = useApi();

  useEffect(() => {
    if (mode === "edit" && initialImage && initialExtension) {
      fetchFile(id, initialExtension, initialImage);
      setOldFile("olympic" + id + "." + initialExtension);
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  async function fetchFile(questionId, file_ext, name) {
    try {
      const response = await api.post(
        "olympicQuestion/downloadImage",
        { id: questionId },
        { responseType: "arraybuffer" }
      );
      if (!response.data) {
        throw new Error("No data received from the API");
      }

      const fileType = mimeTypeOf(file_ext);
      const fileObj = new File([new Blob([response.data], { type: fileType })], name, {
        type: fileType,
      });

      setShowImage(fileType.startsWith("image/") ? URL.createObjectURL(fileObj) : null);
      setFile(fileObj);
      setFileChanged(false);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  const handleAddAlternative = () => {
    if (alternatives.length < MAX_ALTERNATIVES) {
      setAlternatives([...alternatives, ""]);
    }
  };

  const handleRemoveAlternative = (index) => {
    if (alternatives.length > 1) {
      const newAlts = [...alternatives];
      newAlts.splice(index, 1);
      setAlternatives(newAlts);
    }
  };

  const handleAlternativeChange = (index, value) => {
    const newAlts = [...alternatives];
    newAlts[index] = value;
    setAlternatives(newAlts);
    setValidationErrors({ ...validationErrors, alternatives: false });
  };

  function handleChangeFile(e) {
    if (e && e.type && e.type.startsWith("image/")) {
      setShowImage(URL.createObjectURL(e));
    } else {
      setShowImage(null);
    }
    setFile(e);
    setFileChanged(true);
  }

  const handleFilter = ({ olympic, level, phase, year }) => {
    setOlympics(olympic);
    setLevel(level);
    setYear(year);
    setPhase(phase);

    setValidationErrors({
      ...validationErrors,
      olympics: olympic === null,
      level: level === null,
      year: year === null,
      phase: phase === null,
    });
  };

  const check = (require) => {
    if (require === "none") return true;

    const errors = {
      olympics: olympics === null,
      level: level === null,
      year: year === null,
      phase: phase === null,
    };
    if (require === "all") {
      errors.question = question.trim() === "";
      errors.alternatives = alternatives.some((a) => a.trim() === "");
    }
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const uploadFile = async (questionId, extension) => {
    const renamedFile = new File([file], "olympic" + questionId + "." + extension, {
      type: file.type,
    });
    const formData = new FormData();
    formData.append("file", renamedFile);
    await api.post("question/uploadImage", formData);
  };

  const persist = async (validate) => {
    const payload = {
      id_olympic: olympics?.id,
      id_olympic_level: level?.id,
      id_olympic_phase: phase?.id,
      id_olympic_year: year?.id,
      question: question,
      alternatives: alternatives,
      validate: validate,
      ...extraPayload,
    };

    if (mode === "create") {
      const extension = fileExtensionOf(file);
      payload.active = 0;
      payload.file_ext = extension;

      const data = await api.post("olympicquestion/add", payload);
      // The file can only be named once the server has issued the id.
      if (file && extension) await uploadFile(data.data.element, extension);
      return;
    }

    payload.id = id;
    payload.oldFile = oldFile;
    // Left out entirely when untouched, so the server keeps the image it has.
    if (fileChanged) payload.file_ext = fileExtensionOf(file);

    await api.put(`olympicQuestion/update/${id}`, payload);
    if (fileChanged && file && payload.file_ext) await uploadFile(id, payload.file_ext);
  };

  const submit = async (validate, { require = "all" } = {}) => {
    if (!check(require)) {
      setErrorMessage("Please complete all required fields.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setErrorMessage(null);
    try {
      await persist(validate);
      // Reported once the question and its file are both through, so a listing
      // that refetches on save never reads the row back without its image.
      onSave();
    } catch (error) {
      console.error("Error saving question:", error);
      // The server says why it refused, e.g. a reviewer outside their olympiads.
      setErrorMessage(error.response?.data?.message || "Could not save the question.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filters = (
    <OlympicFilters
      enriched
      layout={layout === "split" ? "column" : "row"}
      required={["olympic", "level", "phase", "year"]}
      errors={{
        olympic: validationErrors.olympics,
        level: validationErrors.level,
        year: validationErrors.year,
        phase: validationErrors.phase,
      }}
      initialValue={{ olympic: olympics, level, phase, year }}
      onChange={handleFilter}
    />
  );

  const fields = (
    <>
      <SoftTypography
        sx={{ color: validationErrors.question ? COLORS.error : COLORS.brown }}
        fontWeight="bold"
      >
        Question*
      </SoftTypography>
      <SoftInput
        placeholder="Type here..."
        value={question}
        multiline
        sx={{ border: validationErrors.question ? "1px solid red" : "1px solid #ced4da" }}
        rows={12}
        onChange={(e) => {
          setQuestion(e.target.value);
          setValidationErrors({ ...validationErrors, question: e.target.value === "" });
        }}
      />
      <Accordion style={{ marginBottom: "50px", width: "100%" }}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <SoftTypography color="dark" ml={2}>
              Question preview
            </SoftTypography>
          </Accordion.Header>
          <Accordion.Body>
            <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
              <SoftTypography variant="h6" fontWeight="regular">
                <Latex displayMode>{question}</Latex>
              </SoftTypography>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold">
        Question resources
      </SoftTypography>
      <SoftBox width="100%" mr={1}>
        <MuiFileInput
          value={file}
          fullWidth
          hideSizeText
          sx={{ mb: 2, borderRadius: 2 }}
          onChange={handleChangeFile}
        />
      </SoftBox>
      <SoftBox
        mx={1}
        mb={1}
        sx={{ width: "100%", display: "flex", justifyContent: "center", alignContents: "center" }}
      >
        {file && showImage && <img src={showImage} width="50%" style={{ borderRadius: "10px" }} />}
      </SoftBox>

      <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold">
        Alternatives
      </SoftTypography>

      {alternatives.map((alt, index) => (
        <div key={index} style={{ marginBottom: "20px", width: "100%" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
            <SoftTypography
              sx={{ color: index === 0 ? "#56a36b" : "#cc0900" }}
              fontWeight="bold"
            >
              {index === 0 ? "True answer*:" : `False answer ${index}*:`}
            </SoftTypography>
            {alternatives.length > 1 && (
              <OlympicButton
                variant="text"
                tone="danger"
                onClick={() => handleRemoveAlternative(index)}
              >
                Remove
              </OlympicButton>
            )}
          </SoftBox>
          <SoftInput
            placeholder="Type here..."
            value={alt}
            multiline
            sx={{
              border:
                validationErrors.alternatives && alt.trim() === ""
                  ? "1px solid red"
                  : "1px solid #ced4da",
            }}
            rows={4}
            onChange={(e) => handleAlternativeChange(index, e.target.value)}
          />
          <Accordion style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <SoftTypography color="dark" ml={2}>
                  Answer preview
                </SoftTypography>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
                  <SoftTypography variant="h6" fontWeight="regular">
                    <Latex displayMode>{alt}</Latex>
                  </SoftTypography>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))}

      {alternatives.length < MAX_ALTERNATIVES && (
        <OlympicButton variant="outlined" onClick={handleAddAlternative} sx={{ mb: 4, mt: 2 }}>
          + Add Alternative
        </OlympicButton>
      )}

      <SoftBox
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={2}
        sx={{ width: "100%" }}
      >
        {actions(submit)}
      </SoftBox>
    </>
  );

  const banner = errorMessage && (
    <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <SoftTypography variant="h6" color="error" fontWeight="light">
        {errorMessage}
      </SoftTypography>
    </SoftBox>
  );

  if (layout === "stacked") {
    return (
      <div ref={formRef}>
        <SoftBox width="98%">
          {banner}
          {filters}
          {fields}
        </SoftBox>
      </div>
    );
  }

  const flexDirection = windowWidth <= 1020 ? "column" : "row";
  const margin = windowWidth <= 1020 ? "0px" : "8px";
  const marginBottom = windowWidth <= 1020 ? "20px" : "0px";

  return (
    <Card
      ref={formRef}
      border="light"
      bg="light"
      style={{ margin: margin, marginBottom: marginBottom, borderRadius: "4%" }}
    >
      {banner}
      <Card.Body style={{ display: "flex", flexDirection: flexDirection }}>
        <SoftBox
          width="25%"
          display="flex"
          borderRight={1}
          borderColor="rgb(52, 71, 103, 0.6)"
          flexDirection="column"
          justifyContent="space-between"
          mb={2}
          sx={{
            "@media (max-width: 1020px)": {
              width: "100%",
              borderRight: 0,
              borderBottom: 1,
              borderColor: "rgb(52, 71, 103, 0.6)",
            },
          }}
        >
          <SoftBox m={2}>
            <SoftBox mb={1} lineHeight={0}>
              <SoftTypography variant="h4" fontWeight="bold" sx={{ color: COLORS.brown }}>
                Q {id}
              </SoftTypography>
            </SoftBox>
            {filters}
          </SoftBox>
        </SoftBox>
        <SoftBox
          width="75%"
          display="flex"
          justifyContent="space-around"
          alignItems="flex-start"
          flexDirection="column"
          m={2}
          sx={{
            "@media (max-width: 1020px)": {
              width: "100%",
              ml: 0,
              mr: 0,
            },
          }}
        >
          {fields}
        </SoftBox>
      </Card.Body>
    </Card>
  );
}

OlympicQuestionForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  layout: PropTypes.oneOf(["split", "stacked"]),
  // Required in "edit" mode; a question being created has no id yet.
  id: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  actions: PropTypes.func.isRequired,
  extraPayload: PropTypes.object,
  initialQuestion: PropTypes.string,
  initialAnswers: PropTypes.array,
  initialOlympic: PropTypes.object,
  initialLevel: PropTypes.object,
  initialYear: PropTypes.object,
  initialPhase: PropTypes.object,
  initialExtension: PropTypes.string,
  initialImage: PropTypes.string,
};

export default OlympicQuestionForm;
