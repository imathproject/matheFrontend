import PropTypes from "prop-types";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faGripVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import { useApi } from "api";
const AnimatedCard = styled(Card)`
  width: 100%;
  text-align: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 500px) {
    .card-body {
      flex-direction: column !important;
    }
  }
`;

const Text = styled(SoftBox)`
  width: 80%;
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: center;
  margin-left: 16px;
`;

const ButtonContainer = styled(SoftBox)`
  display: flex;
  width: 7%;
  justify-content: flex-end;
  margin-top: 16px;
`;

const RoundButton = styled(Button)`
  background-color: ${({ color }) => color || "#2596be"};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid ${({ color }) => color || "#2596be"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 4px 8px ${({ color }) => color || "#2596be"};

  &:hover {
    transform: scale(1.05);
    background-color: ${({ color }) => color || "#2596be"};
    border: 2px solid ${({ color }) => color || "#2596be"};
  }
`;

function TaskItem({ item, dragHandleProps, onUpdate, onEdit }) {
  const api = useApi();

  async function handleDelete(id) {
    try {
      await api.get("publication/deletePublication/" + id);
      if (onUpdate) {
        onUpdate(id);
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
    }
  }

  async function handleEdit(id) {
    onEdit(id);
  }

  return (
    <AnimatedCard {...dragHandleProps}>
      <Card.Body style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faGripVertical}></FontAwesomeIcon>
        <Text>
          <SoftTypography variant="h5" ml={2} fontWeight="bold">
            {item.title}
          </SoftTypography>
          <SoftBox sx={{ display: "flex" }}>
            <SoftTypography variant="body2" ml={2} sx={{ color: "#e89f51" }} fontWeight="bold">
              Authors: &nbsp;
            </SoftTypography>
            <SoftTypography variant="body2" sx={{ color: "#344767" }}>
              {item.authors}
            </SoftTypography>
          </SoftBox>
          <SoftBox sx={{ display: "flex" }}>
            <SoftTypography variant="body2" ml={2} sx={{ color: "#2596be" }} fontWeight="bold">
              {item.type}
            </SoftTypography>
          </SoftBox>
        </Text>

        <ButtonContainer>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <RoundButton color="#2596be" on>
              <FontAwesomeIcon icon={faLink} color="white" />
            </RoundButton>
          </a>
        </ButtonContainer>

        <ButtonContainer>
          <RoundButton
            color="#2ecc71"
            onClick={() => {
              handleEdit(item.id);
            }}
          >
            <FontAwesomeIcon icon={faPen} color="white" />
          </RoundButton>
        </ButtonContainer>

        <ButtonContainer>
          <RoundButton
            color="#e74c3c"
            onClick={() => {
              handleDelete(item.id);
            }}
          >
            <FontAwesomeIcon icon={faTrash} color="white" />
          </RoundButton>
        </ButtonContainer>
      </Card.Body>
    </AnimatedCard>
  );
}

TaskItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  dragHandleProps: PropTypes.object,
  onUpdate: PropTypes.func,
  onEdit: PropTypes.func,
};

export default TaskItem;
