import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

/**
 * The states an olympic question moves through, and how each one is painted.
 *
 * This table used to be a `statusIcon` array pasted into every question
 * listing (allOlympicQuestions, SnaOlympicQuestion, reviewOlympicQuestions),
 * and the copies had already drifted: one of them dropped the `0` row, so a
 * question that never entered the validation flow rendered with no badge at
 * all.
 *
 * `badgeColor` is handed to SoftBox, which takes either a palette name or a
 * literal colour — "In Progress" was written as the theme's `info` while the
 * rest are hex. The status filter's toggles need a real colour for all five,
 * hence `swatch`; the two are kept as they were found rather than unified by
 * guess. `short` is the wording the filter uses, which is terser than the
 * badge's for status 4.
 */
export const STATUS = {
  0: { label: "Not Submitted", short: "Not Submitted", badgeColor: "#8c8c8c", swatch: "#8c8c8c" },
  1: { label: "Accepted", short: "Accepted", badgeColor: "#56a36b", swatch: "#56a36b" },
  2: { label: "Not Accepted", short: "Not Accepted", badgeColor: "#cc0900", swatch: "#cc0900" },
  3: { label: "In Progress", short: "In Progress", badgeColor: "info", swatch: "#0578b7" },
  4: {
    label: "Waiting for validation",
    short: "Waiting",
    badgeColor: "#FFB200",
    swatch: "#FFB200",
  },
};

/**
 * The coloured pill a question carries in the listings. A question that was
 * never put through validation arrives with `validate` = 0 or null, which is
 * why the value is normalised here instead of at every call site.
 */
function OlympicStatusBadge({ status }) {
  const entry = STATUS[Number(status) || 0];

  if (!entry) return null;

  return (
    <SoftBox
      bgColor={entry.badgeColor}
      borderRadius="lg"
      flexDirection="row"
      display="flex"
      justifyContent="center"
      width="50"
      mb={2}
    >
      <SoftTypography variant="button" fontWeight="bold" color="white" mt={1} mb={1}>
        {entry.label}
      </SoftTypography>
    </SoftBox>
  );
}

OlympicStatusBadge.propTypes = {
  status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default OlympicStatusBadge;
