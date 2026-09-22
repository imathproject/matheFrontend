import PropTypes from "prop-types";
import React from "react";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import ReactCountryFlag from "react-country-flag";
import styled from "styled-components";

const ResponsiveBox = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px;

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    margin-top: 10%;
  }
`;

const FlagBox = styled(SoftBox)`
  width: 20%;
  text-align: left;

  @media (max-width: 1070px) {
    width: 40%;
  }
`;

const IconBox = styled(SoftBox)`
  width: 10%;

  @media (max-width: 1070px) {
    width: 10%;
  }
`;

const ResponsiveIcon = styled(FontAwesomeIcon)`
  font-size: 6em;
  color: #d6f0ff;

  @media (max-width: 1070px) {
    font-size: 0em;
  }
`;

const Footer = ({ name, country, countryName, role }) => (
  <ResponsiveBox>
    <FlagBox>
      <ReactCountryFlag
        countryCode={country}
        svg
        style={{
          width: "80%",
          height: "80%",
          borderRadius: "20px",
        }}
      />
    </FlagBox>
    <SoftBox sx={{ width: "70%", marginLeft: "2%" }}>
      <SoftTypography variant="h3" sx={{ textAlign: "left", color: "#D6F0FF" }}>
        {name}
      </SoftTypography>
      <SoftTypography variant="body2" style={{ textAlign: "left", color: "#D6F0FF" }}>
        {role}
      </SoftTypography>
      <SoftTypography variant="body2" style={{ textAlign: "left", color: "#D6F0FF" }}>
        {countryName}
      </SoftTypography>
    </SoftBox>
    <IconBox>
      <ResponsiveIcon icon={faQuoteRight} />
    </IconBox>
  </ResponsiveBox>
);

Footer.propTypes = {
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default Footer;
