import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import PaperCard from "./card";
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "api";

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const Section = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RoundButtonOrange = styled(Button)`
  background: #e89f51;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  margin: 8px;
  border: 0px;

  &:hover {
    transform: scale(1.05);
    background: #e89f51;
  }
`;

const Publications = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [publications, setPublications] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await api.get("/publication/getAll");
      const publications = data.data.elements;
      setPublications(publications);
    } catch (error) {
      // Handle error
    }
  }

  const displayedPublications = showMore ? publications : publications.slice(0, 5);

  return (
    <Box>
      <SoftTypography variant="h1" fontWeight="bold" mt="1%" sx={{ color: "#2596be" }}>
        {t('home_page.research_publications', 'Research Publications')}
      </SoftTypography>
      <Section>
        {displayedPublications.map((publication, index) => (
          <PaperCard
            key={index}
            title={publication.title}
            authors={publication.authors}
            link={publication.link}
            type={publication.type}
          />
        ))}
        <RoundButtonOrange onClick={() => setShowMore(!showMore)}>
          {showMore ? (
            <SoftTypography variant="h6" color="white">
              {t('home_page.show_less', 'Show Less')}
            </SoftTypography>
          ) : (
            <SoftTypography variant="h6" color="white">
              {t('home_page.show_more', 'Show More')}
            </SoftTypography>
          )}
          <FontAwesomeIcon
            icon={showMore ? faAngleUp : faAngleDown}
            color="white"
            style={{ marginLeft: 2 }}
          />
        </RoundButtonOrange>
      </Section>
    </Box>
  );
};

export default Publications;
