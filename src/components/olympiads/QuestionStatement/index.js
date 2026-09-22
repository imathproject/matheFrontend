import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import useQuestionAttachment from "components/olympiads/useQuestionAttachment";

/**
 * A question's body: the LaTeX statement, plus its attachment when it has one
 * (inline for images, a download link for PDFs).
 *
 * The attachment block is only rendered once there is something in it — the
 * copies this replaces kept an empty padded div on every question without a
 * file.
 */
function QuestionStatement({ questionId, question, fileName, extension }) {
  const { src } = useQuestionAttachment({ questionId, fileName, extension });

  return (
    <>
      <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
        <SoftTypography variant="h6" fontWeight="regular">
          <Latex displayMode>{question}</Latex>
        </SoftTypography>
      </div>
      {src && (
        <div style={{ padding: "1rem", overflowY: "auto", width: "100%" }}>
          {extension === "pdf" ? (
            <a href={src} download={fileName}>Download file</a>
          ) : (
            <img src={src} alt={fileName} width="25%" />
          )}
        </div>
      )}
    </>
  );
}

QuestionStatement.propTypes = {
  questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  question: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  extension: PropTypes.string,
};

export default QuestionStatement;
