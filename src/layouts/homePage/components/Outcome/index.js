import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import { useApi } from "api";

const CardBody = styled(Card.Body)`
  dispay: flex;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  background-color: #344767;
  border-radius: 100%;
  border: 8px solid #344767;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: scale(1.1);
  }
`;

const AnimatedCard = styled(Card)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 0px solid;
  margin: 30px;
`;

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  @media (max-width: 985px) {
    margin-top: 10%;
  }
`;

const Section = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;

  @media (max-width: 985px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Outcome = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("info/outcomes");
        setData(response.data.elements);
        setLoading(false);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <SoftTypography variant="h1" fontWeight="bold" mt="1%" mb="1%" sx={{ color: "#2596be" }}>
        {t('mathe_achievements', 'MathE Achievements')}
      </SoftTypography>
      <Section>
        {data &&
          data.result.map((key, index) => (
            <AnimatedCard key={index}>
              <CardBody>
                <SoftTypography fontWeight="bold" variant="h3" sx={{ color: "#FFFFFF" }}>
                  {key}
                </SoftTypography>
              </CardBody>
              <Card.Title>
                <SoftTypography mt={2} fontWeight="bold" variant="h2">
                  {t(`home_page.${(data.labels[index] || "").toLowerCase()}`, data.labels[index])}
                </SoftTypography>
              </Card.Title>
            </AnimatedCard>
          ))}
      </Section>
    </Box>
  );
};

export default Outcome;
