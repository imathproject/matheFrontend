import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import { useApi } from "api";
import SoftButton from "components/SoftButton";
import { Autocomplete, Modal, TextField } from "@mui/material";
import COLORS from "components/olympiads/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faUpload } from "@fortawesome/free-solid-svg-icons";
import OlympicTagListField from "components/olympiads/OlympicTagListField";

// What a level / year / phase actually means for an olympiad.
const OLYMPIAD_FIELD_COPY = {
  levels: {
    title: "Levels",
    description:
      "The groups students compete in, usually by age or school year. A question belongs to exactly one level.",
    example: "e.g. Junior, Senior, Grade 10",
    fieldName: "Level",
  },
  years: {
    title: "Years",
    description:
      "The editions of the olympiad you will hold questions for — one entry per year the competition ran.",
    example: "e.g. 2024",
    fieldName: "Year",
  },
  phases: {
    title: "Phases",
    description: "The rounds each edition is played in, from the first qualifier to the final.",
    example: "e.g. Qualifier, Regional, Final",
    fieldName: "Phase",
  },
};

// Each list has its own endpoints — olympic/<name>/getAll, /add, /update and
// /delete — which also carry the value under that same <name>.
const TAG_ENDPOINTS = { levels: "level", years: "year", phases: "phase" };
const TAG_FIELDS = Object.keys(TAG_ENDPOINTS);

const CONFIRM_SHEET = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "60%",
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 4,
  borderRadius: 6,
};

/**
 * The olympiad form, both for creating one and for editing an existing one.
 *
 * `mode` picks what Save does. "create" posts a new olympiad, then uploads its
 * logo and adds its levels / years / phases under the id the server hands back.
 * "edit" updates `olympic` and replays what was done to the three lists on
 * screen: removals, additions and renames all wait for Save.
 *
 * `onSave` is called once everything is through — and in "edit" also after the
 * olympiad has been deleted — so the listing can close its sheet and refetch.
 */
function OlympicForm({ mode = "create", olympic = {}, onSave }) {
  const formRef = useRef();
  const fileInputRef = useRef(null);
  const [olympicName, setOlympicName] = useState(olympic.label || "");
  const [olympicLanguage, setOlympicLanguage] = useState(olympic.language || "");
  const [olympicLink, setOlympicLink] = useState(olympic.link || "");

  const [file, setFile] = useState(null);
  const [showImage, setShowImage] = useState(null);
  // The logo the olympiad already has, shown until a new file is picked.
  const [savedImage, setSavedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

  const [tags, setTags] = useState({ levels: [], years: [], phases: [] });
  const [newTags, setNewTags] = useState({ levels: "", years: "", phases: "" });
  // Saved entries removed on screen; the server only deletes them on Save.
  const [removedTags, setRemovedTags] = useState({ levels: [], years: [], phases: [] });
  // What the confirmation dialog is asking about, as { label, confirm }.
  const [pendingDelete, setPendingDelete] = useState(null);

  const [dbLanguages, setDbLanguages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDbLanguages() {
      try {
        const response = await api.get("olympic/getAll");
        if (isMounted && response.data && response.data.elements) {
          const langs = response.data.elements
            .map((item) => item.language)
            .filter((lang) => lang && lang.trim() !== "");
          const uniqueLangs = Array.from(new Set(langs));
          setDbLanguages(uniqueLangs);
        }
      } catch (error) {
        console.error("Failed to load languages from database:", error);
      }
    }
    loadDbLanguages();
    return () => {
      isMounted = false;
    };
  }, [api]);

  // In "edit", what the olympiad already has: its three lists and its logo.
  // Each request stands alone, so one failing leaves the rest usable.
  useEffect(() => {
    if (!olympic.id) return undefined;
    let isMounted = true;
    let logoUrl = null;

    TAG_FIELDS.forEach(async (field) => {
      try {
        const response = await api.get(`olympic/${TAG_ENDPOINTS[field]}/getAll/${olympic.id}`);
        const items = response.data.elements.map((e) => ({
          id: e.id,
          label: e.label,
          edited: e.label,
        }));
        if (isMounted) setTags((current) => ({ ...current, [field]: items }));
      } catch (error) {
        console.error(`Failed to load the olympiad's ${field}:`, error);
      }
    });

    if (olympic.imageUrl) {
      (async () => {
        try {
          const parts = olympic.imageUrl.split(".");
          const response = await api.post(
            "info/olympics/downloadImage",
            { id: parts.slice(0, -1).join("."), file_ext: parts[parts.length - 1] },
            { responseType: "blob" }
          );
          if (!isMounted) return;
          logoUrl = URL.createObjectURL(new Blob([response.data]));
          setSavedImage(logoUrl);
        } catch (error) {
          console.error("Failed to load existing image:", error);
        }
      })();
    }

    return () => {
      isMounted = false;
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [olympic.id, olympic.imageUrl]);

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    link: false,
    language: false,
  });

  function handleChangeFile(e) {
    if (e == null) {
      setShowImage(null);
    } else {
      const file = e;
      if (file && file.type.startsWith("image/")) {
        setShowImage(URL.createObjectURL(file));
      } else {
        setShowImage(null);
      }
    }
    setFile(e);
  }

  const removeTag = (field, item) => {
    setTags((current) => ({
      ...current,
      [field]: current[field].filter((i) => i.id !== item.id),
    }));
    if (!item.isNew) {
      setRemovedTags((current) => ({ ...current, [field]: [...current[field], item.id] }));
    }
  };

  // Adding, renaming and removing an entry is the same operation for all three
  // fields; the list it acts on is the only difference.
  const tagHandlers = (field) => ({
    items: tags[field],
    onItemsChange: (items) => setTags((current) => ({ ...current, [field]: items })),
    newValue: newTags[field],
    onNewValueChange: (value) => setNewTags((current) => ({ ...current, [field]: value })),
    onAdd: () => {
      const value = newTags[field].trim();
      const item = {
        id: `new-${Date.now()}-${Math.random()}`,
        label: value,
        edited: value,
        isNew: true,
      };
      setTags((current) => ({ ...current, [field]: [...current[field], item] }));
      setNewTags((current) => ({ ...current, [field]: "" }));
    },
    // `label` keeps what the server holds, which is how Save spots a rename.
    onUpdate: (item) =>
      setTags((current) => ({
        ...current,
        [field]: current[field].map((i) =>
          i.id === item.id ? { ...i, edited: item.edited.trim() } : i
        ),
      })),
    // An entry that was never saved simply goes; a saved one is asked about
    // first, since Save deletes it on the server along with every question
    // filed under it.
    onDelete: (item) =>
      item.isNew
        ? removeTag(field, item)
        : setPendingDelete({
            label: `the "${item.edited}" ${OLYMPIAD_FIELD_COPY[field].fieldName.toLowerCase()}`,
            confirm: () => removeTag(field, item),
          }),
  });

  const confirmDelete = () => {
    pendingDelete.confirm();
    setPendingDelete(null);
  };

  const validateForm = () => {
    const errors = {
      name: olympicName.trim() === "",
      link: olympicLink.trim() === "",
      language: olympicLanguage.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  // The logo is stored as olympic<id>.<extension>, a name that only exists once
  // the olympiad has an id; it is returned so the record can point at it.
  const uploadLogo = async (id) => {
    const splitFile = file.name.split(".");
    const fileName = `olympic${id}.${splitFile[splitFile.length - 1]}`;
    const formData = new FormData();
    formData.append("file", new File([file], fileName, { type: file.type }));
    await api.post("olympic/uploadImage", formData);
    return fileName;
  };

  const saveTags = async (id) => {
    // Removals are sent first, so a name removed and added back is never on the
    // server twice at once.
    await Promise.all(
      TAG_FIELDS.flatMap((field) =>
        removedTags[field].map((tagId) =>
          api.delete(`olympic/${TAG_ENDPOINTS[field]}/delete/${tagId}`)
        )
      )
    );
    await Promise.all(
      TAG_FIELDS.flatMap((field) => {
        const name = TAG_ENDPOINTS[field];
        return tags[field].map((item) => {
          const value = item.edited.trim();
          if (!value) return null;
          if (item.isNew) return api.post(`olympic/${name}/add`, { id_olympic: id, [name]: value });
          if (value !== item.label) {
            return api.put(`olympic/${name}/update`, { id: item.id, [name]: value });
          }
          return null;
        });
      })
    );
  };

  const persist = async () => {
    const fields = { name: olympicName, active: 1, language: olympicLanguage, link: olympicLink };
    let { id } = olympic;
    if (mode === "create") {
      const response = await api.post("olympic/add", { ...fields, imageUrl: null });
      id = response.data.element.id;
    }

    let imageUrl = olympic.imageUrl || null;
    if (file) {
      try {
        imageUrl = await uploadLogo(id);
      } catch (error) {
        // In "create" the olympiad exists by now, and failing the whole save
        // would only invite a second one on retry: it is kept, without a logo.
        if (mode === "edit") throw error;
        console.error("Error uploading logo image:", error);
      }
    }
    // "create" has sent the fields already and only comes back for the logo.
    if (mode === "edit" || imageUrl) {
      await api.put("olympic/update", { id, ...fields, imageUrl });
    }

    await saveTags(id);
  };

  const saveOlympic = async () => {
    if (!validateForm()) {
      setErrorMessage("Please complete all required fields.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setErrorMessage(null);
    try {
      await persist();
      onSave();
    } catch (error) {
      console.error("Error saving Olympiad:", error);
      setErrorMessage("Failed to save Olympiad. Please try again.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const deleteOlympic = async () => {
    try {
      await api.delete("olympic/delete/" + olympic.id);
      onSave();
    } catch (error) {
      console.error("Error deleting Olympiad:", error);
      setErrorMessage("Failed to delete Olympiad. Please try again.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={formRef}>
      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        aria-labelledby="delete-confirmation"
      >
        <SoftBox sx={CONFIRM_SHEET}>
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faCircleExclamation} size="4x" color={COLORS.lightBrown} />
            <SoftTypography variant="h4" mt={3}>
              Are you sure you want to delete {pendingDelete?.label}?
            </SoftTypography>
            <SoftTypography variant="h6" fontWeight="light">
              You won&apos;t be able to revert this!
            </SoftTypography>
            <SoftBox
              mt={4}
              display="flex"
              flexDirection="row"
              width="100%"
              justifyContent="space-around"
            >
              <SoftButton
                variant="gradient"
                color="error"
                sx={{ width: "30%" }}
                onClick={confirmDelete}
              >
                Yes, delete it!
              </SoftButton>
              <SoftButton
                variant="contained"
                color="dark"
                sx={{
                  width: "30%",
                  color: "#FFFFFF",
                  backgroundColor: COLORS.lightBrown,
                  "&:hover": { backgroundColor: COLORS.brown },
                }}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Modal>

      <SoftBox width="98%" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {errorMessage && (
          <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <SoftTypography variant="h6" color="error" fontWeight="light">
              {errorMessage}
            </SoftTypography>
          </SoftBox>
        )}

        {/* Olympic Name */}
        <SoftBox>
          <SoftTypography sx={{ color: COLORS.brown, mb: 1 }} fontWeight="bold">
            Olympiad Name *
          </SoftTypography>
          <SoftInput
            placeholder="Type new olympiad name..."
            value={olympicName}
            sx={{ border: validationErrors.name ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setOlympicName(e.target.value);
              setValidationErrors({ ...validationErrors, name: false });
            }}
          />
        </SoftBox>

        {/* Olympic Language */}
        <SoftBox>
          <SoftTypography sx={{ color: COLORS.brown, mb: 1 }} fontWeight="bold">
            Language *
          </SoftTypography>
          <Autocomplete
            freeSolo
            options={dbLanguages}
            value={olympicLanguage}
            onChange={(event, newValue) => {
              setOlympicLanguage(newValue || "");
              setValidationErrors({ ...validationErrors, language: false });
            }}
            onInputChange={(event, newInputValue) => {
              setOlympicLanguage(newInputValue || "");
              setValidationErrors({ ...validationErrors, language: false });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search or type a language..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    padding: "0 9px",
                    border: validationErrors.language ? "1px solid red" : "1px solid #ced4da",
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            )}
          />
        </SoftBox>

        {/* Olympic Link */}
        <SoftBox>
          <SoftTypography sx={{ color: COLORS.brown, mb: 1 }} fontWeight="bold">
            External Link *
          </SoftTypography>
          <SoftInput
            placeholder="Type external link (e.g. https://obmep.org.br)..."
            value={olympicLink}
            sx={{ border: validationErrors.link ? "1px solid red" : "1px solid #ced4da" }}
            onChange={(e) => {
              setOlympicLink(e.target.value);
              setValidationErrors({ ...validationErrors, link: false });
            }}
          />
        </SoftBox>

        {/* Olympic Logo/Image resource */}
        <SoftBox>
          <SoftTypography sx={{ color: COLORS.brown, mb: 1 }} fontWeight="bold">
            Olympiad Logo / Image (Optional)
          </SoftTypography>
          <SoftBox
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            sx={{
              border: `2px dashed ${COLORS.lightBrown}`,
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fcf8f2",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: COLORS.brown,
                backgroundColor: "#f7eee3",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
              mb: 2,
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  handleChangeFile(selectedFile);
                }
              }}
            />
            <FontAwesomeIcon
              icon={faUpload}
              size="2x"
              style={{ color: COLORS.lightBrown, marginBottom: "8px" }}
            />
            <SoftTypography
              variant="button"
              fontWeight="medium"
              color="text"
              sx={{ wordBreak: "break-all", px: 2 }}
            >
              {file ? file.name : "Click here to upload Olympiad Logo/Image"}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary" mt={0.5}>
              Supports PNG, JPG, JPEG, GIF
            </SoftTypography>
            {file && (
              <SoftButton
                size="small"
                variant="text"
                color="error"
                sx={{ mt: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Clear selected file
              </SoftButton>
            )}
          </SoftBox>
        </SoftBox>

        {/* Preview image: the new file if one was picked, else the saved logo */}
        {(showImage || savedImage) && (
          <SoftBox
            mx={1}
            mb={1}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContents: "center",
            }}
          >
            <img
              src={showImage || savedImage}
              width="30%"
              style={{ borderRadius: "10px", objectFit: "contain", maxHeight: "150px" }}
              alt="Logo Preview"
            />
          </SoftBox>
        )}

        {TAG_FIELDS.map((field) => (
          <OlympicTagListField
            key={field}
            {...OLYMPIAD_FIELD_COPY[field]}
            {...tagHandlers(field)}
          />
        ))}

        {/* Actions */}
        <SoftBox
          display="flex"
          flexDirection="row"
          justifyContent={mode === "edit" ? "space-between" : "flex-end"}
          mt={3}
        >
          {mode === "edit" && (
            <SoftButton
              variant="gradient"
              color="error"
              onClick={() =>
                setPendingDelete({
                  label: `the "${olympic.label}" olympiad`,
                  confirm: deleteOlympic,
                })
              }
            >
              Delete Olympiad
            </SoftButton>
          )}
          <SoftButton
            variant="contained"
            sx={{
              color: "#FFFFFF",
              backgroundColor: COLORS.lightBrown,
              "&:hover": { backgroundColor: COLORS.brown },
              "&:focus:not(:hover)": { backgroundColor: COLORS.lightBrown },
            }}
            onClick={saveOlympic}
          >
            {mode === "edit" ? "Save Olympiad" : "Create Olympiad"}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
}

export default OlympicForm;

OlympicForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  // Required in "edit": the row being edited, as olympic/getAllEnriched lists it.
  olympic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    language: PropTypes.string,
    link: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};
