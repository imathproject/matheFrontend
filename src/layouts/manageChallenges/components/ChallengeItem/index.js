import PropTypes from "prop-types";
import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faEye,
  faCalendarDays,
  faListOl,
  faKey,
  faPlay,
  faPause,
  faStop,
  faClock,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const AnimatedCard = styled(Card)`
  width: 100%;
  text-align: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
`;

const Text = styled(SoftBox)`
  width: 75%;
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: center;
  margin-left: 16px;
`;

const ButtonsContainer = styled(SoftBox)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  flex-wrap: wrap;
  flex-shrink: 0;
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

const STATUS_CONFIG = {
  created: { label: "Created", color: "#6c757d", bgColor: "#e9ecef" },
  started: { label: "Started", color: "#28a745", bgColor: "#d4edda" },
  paused: { label: "Paused", color: "#fd7e14", bgColor: "#fff3cd" },
  finished: { label: "Finished", color: "#dc3545", bgColor: "#f8d7da" },
};

function ChallengeItem({ item, onEdit, onDelete, onViewResults, onStart, onPause, onFinish }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const topicLabel = item.platform__topic ? item.platform__topic.label : "N/A";
  const subtopicLabel = item.platform__subtopic ? item.platform__subtopic.label : null;
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.created;

  return (
    <AnimatedCard>
      <Card.Body style={{ display: "flex", alignItems: "center" }}>
        <Text>
          <SoftBox sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <SoftTypography variant="h5" fontWeight="bold">
              {item.title || topicLabel}
            </SoftTypography>
            <SoftBox
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "0.7rem",
                fontWeight: "bold",
              }}
            >
              {statusConfig.label}
            </SoftBox>
          </SoftBox>
          <SoftTypography variant="body2" color="secondary" fontWeight="medium">
            {topicLabel}
            {subtopicLabel && ` — ${subtopicLabel}`}
          </SoftTypography>
          <SoftBox sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 3, flexWrap: "wrap" }}>
            <SoftBox sx={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faKey} color="#17c1e8" style={{ marginRight: "6px" }} size="sm" />
              <SoftTypography variant="body2" sx={{ color: "#17c1e8" }} fontWeight="medium">
                Code: {item.code}
              </SoftTypography>
            </SoftBox>
            <SoftBox sx={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faListOl} color="secondary" style={{ marginRight: "6px" }} size="sm" />
              <SoftTypography variant="body2" sx={{ color: "secondary" }} fontWeight="medium">
                {item.numberOfQuestions} questions
              </SoftTypography>
            </SoftBox>
            <SoftBox sx={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faClock} color="secondary" style={{ marginRight: "6px" }} size="sm" />
              <SoftTypography variant="body2" sx={{ color: "secondary" }} fontWeight="medium">
                {item.maxDuration} min
              </SoftTypography>
            </SoftBox>
            <SoftBox sx={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faCalendarDays} color="secondary" style={{ marginRight: "6px" }} size="sm" />
              <SoftTypography variant="body2" sx={{ color: "secondary" }} fontWeight="medium">
                {formatDate(item.date)}
              </SoftTypography>
            </SoftBox>
            {item.localization && (
              <SoftBox sx={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon icon={faLocationDot} color="secondary" style={{ marginRight: "6px" }} size="sm" />
                <SoftTypography variant="body2" sx={{ color: "secondary" }} fontWeight="medium">
                  {item.localization}
                </SoftTypography>
              </SoftBox>
            )}
          </SoftBox>
        </Text>

        <ButtonsContainer>
          {/* Status control buttons */}
          {(item.status === "created" || item.status === "paused") && (
            <RoundButton
              color="#28a745"
              onClick={() => onStart(item.id)}
              title={item.status === "paused" ? "Resume Challenge" : "Start Challenge"}
            >
              <FontAwesomeIcon icon={faPlay} color="white" />
            </RoundButton>
          )}

          {item.status === "started" && (
            <RoundButton
              color="#fd7e14"
              onClick={() => onPause(item.id)}
              title="Pause Challenge"
            >
              <FontAwesomeIcon icon={faPause} color="white" />
            </RoundButton>
          )}

          {(item.status === "started" || item.status === "paused") && (
            <RoundButton
              color="#dc3545"
              onClick={() => onFinish(item.id)}
              title="Finish Challenge"
            >
              <FontAwesomeIcon icon={faStop} color="white" />
            </RoundButton>
          )}

          {/* View Results */}
          <RoundButton
            color="#2e85ccff"
            onClick={() => {
              onViewResults(item.id);
            }}
            title="View Results"
          >
            <FontAwesomeIcon icon={faListOl} color="white" />
          </RoundButton>

          {/* Edit */}
          <RoundButton
            color="#2ecc71"
            onClick={() => {
              onEdit(item.id);
            }}
            title={item.status === "finished" ? "Verify Information" : "Edit Challenge"}
          >
            <FontAwesomeIcon icon={item.status === "finished" ? faEye : faPen} color="white" />
          </RoundButton>

          {/* Delete */}
          <RoundButton
            color="#e74c3c"
            onClick={() => {
              onDelete(item.id);
            }}
            title="Delete Challenge"
          >
            <FontAwesomeIcon icon={faTrash} color="white" />
          </RoundButton>
        </ButtonsContainer>
      </Card.Body>
    </AnimatedCard>
  );
}

ChallengeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string,
    title: PropTypes.string,
    localization: PropTypes.string,
    maxDuration: PropTypes.number,
    status: PropTypes.string,
    numberOfQuestions: PropTypes.number.isRequired,
    date: PropTypes.string,
    platform__topic: PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
    }),
    platform__subtopic: PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
    }),
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewResults: PropTypes.func,
  onStart: PropTypes.func,
  onPause: PropTypes.func,
  onFinish: PropTypes.func,
};

export default ChallengeItem;
