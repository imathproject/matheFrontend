import PropTypes from "prop-types";
import React from 'react';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';

const Information = ({ title, testimonial }) => {

  return (
    <SoftBox
      borderRadius="lg"
      sx={{
        width: "100%",
        minHeight: "550px",
        background: "rgba(52, 71, 103, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "top",
        p: 4,
      }}
    >
      <SoftBox
        sx={{
          width: "70%",
          maxHeight: "400px",
          overflowY: "auto",
          "@media (max-width: 1070px)": {
            width: "90%",
          },
        }}
      >
        <SoftTypography variant="h3" mb={4} sx={{ color: "#D6F0FF" }}>
          {title}
        </SoftTypography>
        <SoftTypography sx={{ color: "#D6F0FF" }}>
          &quot;{testimonial}&quot;
        </SoftTypography>
      </SoftBox>
    </SoftBox>


  );
};

Information.propTypes = {
  title: PropTypes.string.isRequired,
  testimonial: PropTypes.string.isRequired,
};

export default Information;

