import { useState } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faCheck, faXmark, faPen } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "components/olympiads/colors";

/**
 * The Levels / Years / Phases editor of an olympiad.
 *
 * These three fields used to be three unlabelled lists of text boxes, each with
 * an always-visible tick button that did nothing until the text had been
 * changed. Nothing on screen said what a "level" or a "phase" was, adding a
 * duplicate silently did nothing, and there was no way to tell an entry that had
 * been saved from one still being typed.
 *
 * Here every entry is a finished chip until you ask to edit it, the field says
 * in one line what it is for and what a typical value looks like, and the
 * refusals (empty, duplicate) say so instead of failing quietly.
 */

// `label` is what the server holds and `edited` is what is on screen, so the
// text a user sees — and compares against for duplicates — is always `edited`.
const displayValue = (item) => (item.edited !== undefined ? item.edited : item.label);

const sameLabel = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

function OlympicTagListField({
  title,
  description,
  example,
  fieldName,
  items,
  onItemsChange,
  newValue,
  onNewValueChange,
  onAdd,
  onUpdate,
  onDelete,
}) {
  // Which chip is currently open for renaming, and what the two inputs have
  // refused so far. Errors are cleared as soon as the offending text changes.
  const [editingId, setEditingId] = useState(null);
  const [editingSnapshot, setEditingSnapshot] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");

  const duplicateOf = (value, exceptId) =>
    items.some((item) => item.id !== exceptId && sameLabel(displayValue(item), value));

  const handleAdd = () => {
    const value = (newValue || "").trim();
    if (!value) {
      setAddError(`Type a ${fieldName.toLowerCase()} before adding it.`);
      return;
    }
    if (duplicateOf(value, null)) {
      setAddError(`"${value}" has already been added.`);
      return;
    }
    setAddError("");
    onAdd();
  };

  const startEditing = (item) => {
    setEditError("");
    setEditingSnapshot(displayValue(item));
    setEditingId(item.id);
  };

  // Leaving edit mode restores the text the chip had when editing started, so an
  // abandoned rename is not carried into the save.
  const cancelEditing = (item) => {
    onItemsChange(items.map((i) => (i.id === item.id ? { ...i, edited: editingSnapshot } : i)));
    setEditError("");
    setEditingId(null);
  };

  const commitEditing = (item) => {
    const value = (displayValue(item) || "").trim();
    if (!value) {
      setEditError(`A ${fieldName.toLowerCase()} cannot be empty.`);
      return;
    }
    if (duplicateOf(value, item.id)) {
      setEditError(`"${value}" has already been added.`);
      return;
    }
    setEditError("");
    setEditingId(null);
    onUpdate({ ...item, edited: value });
  };

  const handleEditedChange = (item, value) => {
    setEditError("");
    onItemsChange(items.map((i) => (i.id === item.id ? { ...i, edited: value } : i)));
  };

  return (
    <SoftBox mt={2}>
      <SoftTypography fontWeight="bold" sx={{ color: COLORS.brown }}>
        {title}
      </SoftTypography>
      <SoftTypography variant="caption" color="text" sx={{ display: "block", mb: 1.5 }}>
        {description}
      </SoftTypography>

      {items.length === 0 ? (
        <SoftTypography
          variant="caption"
          color="secondary"
          sx={{ display: "block", fontStyle: "italic", mb: 1 }}
        >
          {`No ${title.toLowerCase()} yet — add the first one below.`}
        </SoftTypography>
      ) : (
        <SoftBox display="flex" flexDirection="column" mb={1}>
          {items.map((item) =>
            editingId === item.id ? (
              <SoftBox key={item.id} display="flex" alignItems="center" mb={1}>
                <SoftInput
                  autoFocus
                  value={displayValue(item)}
                  sx={{ width: "50%", mr: 1 }}
                  onChange={(e) => handleEditedChange(item, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitEditing(item);
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEditing(item);
                    }
                  }}
                />
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    sx={{ color: COLORS.lightBrown, mr: 0.5, "&:hover": { color: COLORS.brown } }}
                    onClick={() => commitEditing(item)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    sx={{ color: COLORS.brown, "&:hover": { color: COLORS.darkOrange } }}
                    onClick={() => cancelEditing(item)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </IconButton>
                </Tooltip>
              </SoftBox>
            ) : (
              <SoftBox
                key={item.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                px={2}
                py={1}
                sx={{
                  width: "50%",
                  backgroundColor: "#fcf8f2",
                  border: `1px solid ${COLORS.lightBrown}`,
                  borderRadius: "8px",
                }}
              >
                <SoftTypography variant="button" fontWeight="medium" sx={{ color: COLORS.brown }}>
                  {displayValue(item)}
                </SoftTypography>
                <SoftBox display="flex" alignItems="center">
                  <Tooltip title={`Rename this ${fieldName.toLowerCase()}`}>
                    <IconButton
                      size="small"
                      sx={{ color: COLORS.lightBrown, mr: 0.5, "&:hover": { color: COLORS.brown } }}
                      onClick={() => startEditing(item)}
                    >
                      <FontAwesomeIcon icon={faPen} size="xs" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Remove this ${fieldName.toLowerCase()}`}>
                    <IconButton
                      size="small"
                      sx={{ color: COLORS.error, "&:hover": { color: COLORS.darkOrange } }}
                      onClick={() => onDelete(item)}
                    >
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                    </IconButton>
                  </Tooltip>
                </SoftBox>
              </SoftBox>
            )
          )}
        </SoftBox>
      )}

      {editError && (
        <SoftTypography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
          {editError}
        </SoftTypography>
      )}

      <SoftBox display="flex" alignItems="center">
        <SoftInput
          placeholder={example}
          value={newValue}
          sx={{ width: "50%", mr: 1 }}
          onChange={(e) => {
            setAddError("");
            onNewValueChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Tooltip title={`Add ${fieldName.toLowerCase()}`}>
          <IconButton
            size="small"
            sx={{
              color: COLORS.white,
              backgroundColor: COLORS.lightBrown,
              "&:hover": { backgroundColor: COLORS.brown },
            }}
            onClick={handleAdd}
          >
            <FontAwesomeIcon icon={faPlus} size="xs" />
          </IconButton>
        </Tooltip>
      </SoftBox>
      <SoftTypography variant="caption" color="secondary" sx={{ display: "block", mt: 0.5 }}>
        {addError ? (
          <SoftTypography variant="caption" color="error">
            {addError}
          </SoftTypography>
        ) : (
          "Press Enter or click + to add it to the list."
        )}
      </SoftTypography>
    </SoftBox>
  );
}

OlympicTagListField.propTypes = {
  /** Section heading, e.g. "Levels". */
  title: PropTypes.string.isRequired,
  /** One line saying what this field means for an olympiad. */
  description: PropTypes.string.isRequired,
  /** Input placeholder carrying a concrete example. */
  example: PropTypes.string.isRequired,
  /** Singular noun used in tooltips and messages, e.g. "Level". */
  fieldName: PropTypes.string.isRequired,
  /** `[{ id, label, edited }]` — `label` is what the server holds, `edited` is shown. */
  items: PropTypes.array.isRequired,
  onItemsChange: PropTypes.func.isRequired,
  newValue: PropTypes.string,
  onNewValueChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

OlympicTagListField.defaultProps = {
  newValue: "",
};

export default OlympicTagListField;
