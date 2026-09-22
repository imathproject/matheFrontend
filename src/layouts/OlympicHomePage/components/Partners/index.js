import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
`;

const Section = styled(SoftBox)`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 80px;
  margin-top: 20px;

  /* Force horizontal layout of 4 */
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const PartnerImage = styled.img`
  height: 80px;
  max-width: 250px;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PartnerLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
`;

const Partners = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [olympics, setOlympics] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    fetchOlympics();
  }, []);

  async function fetchOlympicImage(olympicItem) {
    if (!olympicItem.imageUrl) return null;
    try {
      const parts = olympicItem.imageUrl.split(".");
      const fileExt = parts[parts.length - 1];
      const fileId = parts.slice(0, -1).join(".");
      const response = await api.post(
        "info/olympics/downloadImage",
        { id: fileId, file_ext: fileExt },
        { responseType: "blob" }
      );
      const imageBlob = new Blob([response.data]);
      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error(`Failed to load image for olympic ${olympicItem.id}:`, error);
      return null;
    }
  }

  async function fetchOlympics() {
    try {
      const response = await api.get("info/olympics");
      const items = response.data.elements;
      setOlympics(items);

      const urls = {};
      await Promise.all(
        items.map(async (item) => {
          const url = await fetchOlympicImage(item);
          if (url) {
            urls[item.id] = url;
          }
        })
      );
      setImageUrls(urls);
    } catch (error) {
      console.error("Error fetching olympics:", error);
    }
  }

  if (olympics.length === 0) return null;

  return (
    <Box>
      <SoftTypography variant="h3" color="dark" fontWeight="bold" sx={{ color: "#2596be" }}>
        {t('home_page_olympiad.our_partners', 'Our Partners')}
      </SoftTypography>
      <Section>
        {olympics.map((item) => (
          <PartnerLink key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
            <PartnerImage src={imageUrls[item.id] || "https://placehold.co/250x80/ffffff/2596be?text=" + item.label} alt={item.label} />
          </PartnerLink>
        ))}
      </Section>
    </Box>
  );
};

export default Partners;
