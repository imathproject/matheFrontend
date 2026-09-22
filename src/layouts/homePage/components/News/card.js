import PropTypes from "prop-types";
import React from "react";
import { Card } from "react-bootstrap";
import SoftTypography from "components/SoftTypography";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendar, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const AnimatedCard = styled(Card)`
  width: 100%;
  min-height: 380px;
  text-align: start;
  margin: 10px;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  background: #ffffff;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(37, 150, 190, 0.2);
  }

  &:hover .card-image {
    transform: scale(1.08);
  }

  &:hover .read-more-icon {
    transform: translateX(4px);
  }

  @media (max-width: 985px) {
    width: 100%;
    min-height: auto;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
`;

const ContentContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReadMore = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
`;

const NewsCard = ({ id, title, summary, imageUrl, link, publishedAt }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClick = () => {
    navigate(`/news/${id}`);
  };

  return (
    <AnimatedCard onClick={handleClick}>
      <ImageContainer>
        <CardImage
          className="card-image"
          src={imageUrl || "https://placehold.co/600x400/2596be/ffffff?text=MathE+News"}
          alt={title}
        />
      </ImageContainer>
      <ContentContainer>
        <MetaInfo>
          {publishedAt && (
            <MetaItem>
              <FontAwesomeIcon icon={faCalendar} color="#2596be" size="xs" />
              <SoftTypography sx={{ color: "#8392ab", fontSize: "12px" }}>
                {formatDate(publishedAt)}
              </SoftTypography>
            </MetaItem>
          )}
        </MetaInfo>
        <SoftTypography
          fontWeight="bold"
          sx={{
            color: "#344767",
            fontSize: "16px",
            lineHeight: 1.4,
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </SoftTypography>
        <SoftTypography
          sx={{
            color: "#8392ab",
            fontSize: "14px",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summary}
        </SoftTypography>
        {link && (
          <ReadMore
            as="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: "none" }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} color="#e89f51" size="xs" />
            <SoftTypography
              fontWeight="bold"
              sx={{ color: "#e89f51", fontSize: "13px", "&:hover": { textDecoration: "underline" } }}
            >
              {t('home_page.visit_link', 'Visit Link')}
            </SoftTypography>
          </ReadMore>
        )}
        <ReadMore>
          <SoftTypography
            fontWeight="bold"
            sx={{ color: "#2596be", fontSize: "14px" }}
          >
            {t('home_page.read_more', 'Read More')}
          </SoftTypography>
          <FontAwesomeIcon
            className="read-more-icon"
            icon={faArrowRight}
            color="#2596be"
            size="sm"
            style={{ transition: "transform 0.3s ease" }}
          />
        </ReadMore>
      </ContentContainer>
    </AnimatedCard>
  );
};

NewsCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  publishedAt: PropTypes.string,
};

export default NewsCard;
