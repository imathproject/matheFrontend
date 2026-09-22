import { useState } from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SoftInput from "components/SoftInput";
import OlympicButton from "components/olympiads/OlympicButton";
import { COLORS } from "components/olympiads/colors";

/**
 * The pagination strip under an olympic listing: the page numbers, plus the
 * optional "Go to Page" box the question listings carry.
 *
 * The component owns the text field and the bounds check, and reports both
 * paths through the same `onChange(event, page)` MUI already uses — so a
 * caller keeps one handler, and whatever it does on a page change (these
 * screens scroll back to the top) happens for the jump box too.
 *
 * Renders nothing on an empty listing, which is what the `length !== 0` guards
 * around the copies of this block were doing.
 */
function OlympicPagination({ count, page, onChange, goTo = false, goToLabel = "Go to Page" }) {
  const [pageInput, setPageInput] = useState("");

  if (!count || count < 1) return null;

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= count) {
      onChange(null, pageNumber);
    } else {
      console.error("Invalid page number");
    }
  };

  return (
    <Stack mt={2} spacing={3} mb={2} alignItems="center">
      <Pagination
        sx={{
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: COLORS.lightBrown,
            color: COLORS.white,
          },
        }}
        count={count}
        page={page}
        onChange={onChange}
      />
      {goTo && (
        <Stack direction="row" spacing={2} alignItems="center">
          <SoftInput
            placeholder={goToLabel}
            variant="outlined"
            value={pageInput}
            onChange={(event) => setPageInput(event.target.value)}
          />
          <OlympicButton onClick={handleGoToPage}>Go</OlympicButton>
        </Stack>
      )}
    </Stack>
  );
}

OlympicPagination.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  goTo: PropTypes.bool,
  goToLabel: PropTypes.string,
};

export default OlympicPagination;
