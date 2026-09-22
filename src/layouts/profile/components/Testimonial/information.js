import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import { useTranslation } from "react-i18next";
import { useApi } from "api";

const Information = ({ title, testimonial, validated }) => {
  const { t } = useTranslation();
  return (
    <SoftBox
      borderRadius="lg"
      sx={{
        width: "100%",
        height: "600px",
        background: "rgb(52, 71, 103, 1)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <SoftBox
        variant="h3"
        m={2}
        sx={{
          color: validated ? "#90EE90" : "#FFADB0",
          whiteSpace: "nowrap",
        }}
      >
        {validated ? t("profile_page.testimonial_validated") : t("profile_page.testimonial_not_validated")}
      </SoftBox>

      <SoftBox
        mx="10%"
        mt="5%"
        sx={{
          "@media (max-width: 1070px)": {
            width: "100%",
          },
          overflowY: "auto",
          height: "60%",
          width: "100%",
        }}
      >
        <SoftTypography variant="h3" mb={4} sx={{ color: "#D6F0FF" }}>
          {title}
        </SoftTypography>
        <SoftTypography sx={{ color: "#D6F0FF" }}>&quot;{testimonial}&quot;</SoftTypography>
      </SoftBox>
    </SoftBox>
  );
};

Information.propTypes = {
  title: PropTypes.string.isRequired,
  testimonial: PropTypes.string.isRequired,
  validated: PropTypes.number.isRequired,
};

export default Information;
