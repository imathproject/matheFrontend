import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Topic({ job}) {
    return (
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {job}
        </SoftTypography>
      </SoftBox>
    );
  }

  // Typechecking props for the Bill
  Topic.propTypes = {
    job: PropTypes.string.isRequired,

  };

  export default Topic