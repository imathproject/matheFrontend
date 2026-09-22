import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import OlympicButton from "components/olympiads/OlympicButton";
import { Scrollbar } from "react-scrollbars-custom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const SHEET = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 4,
  borderRadius: 6,
};

// "#3447767" is seven digits, so the browser drops the declaration and the rule
// falls back to `border-bottom: 1px solid currentColor`. It is carried over
// verbatim from the copies this replaces: correcting it would change how every
// one of those modals looks, which is a decision for a design pass, not for a
// move.
const HEADER = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottom: 1,
  borderColor: "#3447767",
  mb: 4,
};

/**
 * The centered sheet the olympic screens open their forms in: a titled header
 * with a Close action, and a scrolling body underneath.
 *
 * The body is capped at 80% of the sheet so the header stays put while a long
 * form scrolls under it.
 */
function OlympicModal({ open, onClose, title, children, closeLabel = "Close" }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="olympic-modal-title">
      <SoftBox sx={SHEET}>
        <SoftBox m={1} sx={HEADER}>
          <SoftTypography id="olympic-modal-title" variant="title" fontWeight="bold">
            {title}
          </SoftTypography>
          <OlympicButton variant="text" tone="neutral" onClick={onClose}>
            <SoftTypography mr={1} variant="title" fontWeight="bold">
              {closeLabel}
            </SoftTypography>
            <FontAwesomeIcon icon={faX} size="4x" />
          </OlympicButton>
        </SoftBox>
        <Scrollbar noScrollX style={{ height: "80%" }}>
          {children}
        </Scrollbar>
      </SoftBox>
    </Modal>
  );
}

OlympicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  closeLabel: PropTypes.node,
};

export default OlympicModal;
