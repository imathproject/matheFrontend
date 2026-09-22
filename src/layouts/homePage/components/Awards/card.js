import PropTypes from "prop-types";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";

const AnimatedCard = styled(Card)`
  width: 100%;
  min-height: 100px;
  text-align: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 985px) {
    width: 90%;
  }
`;

const Text = styled(SoftBox)`
  width: 93%;
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: center;
  margin-left: 16px;
`;

const RoundButton = styled(Button)`
  background-color: #2596be;
  border-radius: 50%;
  width: 40px;
  border: #344767;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    background-color: #2596be;
  }
`;

const ButtonContainer = styled(SoftBox)`
  display: flex;
  width: 7%;
  justify-content: flex-end; /* Align buttons to flex-end */
  margin-top: 16px;
`;

const PaperCard = ({ title, authors, link, type }) => {
  return (
    <AnimatedCard>
      <Card.Body style={{ display: "flex", alignItems: "center" }}>
        <Text>
          <SoftTypography ml={2} fontWeight="bold" fontSize="17px">
            {title}
          </SoftTypography>
          <SoftBox sx={{ display: "flex" }}>
            <SoftTypography ml={2} sx={{ color: "#e89f51", fontSize: "15px" }} fontWeight="bold">
              Authors: &nbsp;
            </SoftTypography>
            <SoftTypography sx={{ color: "#344767", fontSize: "15px" }}>{authors}</SoftTypography>
          </SoftBox>
          <SoftBox sx={{ display: "flex" }}>
            <SoftTypography ml={2} sx={{ color: "#2596be", fontSize: "15px" }} fontWeight="bold">
              {type}
            </SoftTypography>
          </SoftBox>
        </Text>
        <ButtonContainer>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <RoundButton>
              <FontAwesomeIcon icon={faLink} color="white" />
            </RoundButton>
          </a>
        </ButtonContainer>
      </Card.Body>
    </AnimatedCard>
  );
};

PaperCard.propTypes = {
  title: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
  link: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default PaperCard;
