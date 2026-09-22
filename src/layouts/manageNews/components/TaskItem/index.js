import PropTypes from "prop-types";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faLink } from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";

const AnimatedCard = styled(Card)`
  width: 100%;
  text-align: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${({ published }) => (published ? "#2ecc71" : "#95a5a6")};
`;

function TaskItem({ item, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AnimatedCard>
      <Card.Body style={{ display: "flex", alignItems: "center" }}>
        <Text>
          <SoftTypography variant="h5" ml={2} fontWeight="bold">
            {item.title}
          </SoftTypography>
          {item.link && (
            <SoftBox sx={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faLink} color="#e89f51" style={{ marginLeft: "16px", marginRight: "4px" }} size="xs" />
              <SoftTypography variant="body2" sx={{ color: "#2596be", fontSize: "12px" }}>
                {item.link.length > 40 ? item.link.substring(0, 40) + "..." : item.link}
              </SoftTypography>
            </SoftBox>
          )}
          <SoftBox sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <SoftTypography variant="body2" ml={2} sx={{ color: "#2596be" }} fontWeight="bold">
              {formatDate(item.publishedAt)}
            </SoftTypography>
            <SoftBox ml={2}>
              <StatusBadge published={item.isPublished}>
                {item.isPublished ? "Published" : "Draft"}
              </StatusBadge>
            </SoftBox>
          </SoftBox>
          {item.summary && (
            <SoftTypography
              variant="body2"
              ml={2}
              mt={0.5}
              sx={{ color: "#7b809a", fontStyle: "italic" }}
            >
              {item.summary.length > 100 ? item.summary.substring(0, 100) + "..." : item.summary}
            </SoftTypography>
          )}
        </Text>

        <ButtonContainer>
          <RoundButton
            color="#2ecc71"
            onClick={() => {
              onEdit(item.id);
            }}
          >
            <FontAwesomeIcon icon={faPen} color="white" />
          </RoundButton>
        </ButtonContainer>

        <ButtonContainer>
          <RoundButton
            color="#e74c3c"
            onClick={() => {
              onDelete(item.id);
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
    link: PropTypes.string,
    summary: PropTypes.string,
    publishedAt: PropTypes.string,
    isPublished: PropTypes.bool,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default TaskItem;
