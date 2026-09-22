import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import NewsCard from "./card";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_MATHE_API;

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const News = () => {
    const { t } = useTranslation();
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);

    async function fetchNewsImage(newsItem) {
        // The imageUrl field in the DB stores the filename like "news5.png"
        if (!newsItem.imageUrl) return null;
        try {
            const parts = newsItem.imageUrl.split(".");
            const fileExt = parts[parts.length - 1];
            const fileId = parts.slice(0, -1).join("."); // e.g. "news5"
            const response = await axios.post(
                `${BASE_URL}news/downloadImage`,
                { id: fileId, file_ext: fileExt },
                { responseType: "blob" }
            );
            const imageBlob = new Blob([response.data]);
            return URL.createObjectURL(imageBlob);
        } catch (error) {
            console.error(`Failed to load image for news ${newsItem.id}:`, error);
            return null;
        }

    }

    async function fetchNews(page) {
        try {
            console.log(`Fetching news page ${page} from API...`);
            const response = await axios.get(`${BASE_URL}news/getAll?page=${page}&limit=3`);
            const newsItems = response.data.elements;
            setNews(newsItems);
            setTotalPages(response.data.totalPages);

            // Fetch images for all news items
            const urls = {};
            await Promise.all(
                newsItems.map(async (item) => {
                    const url = await fetchNewsImage(item);
                    if (url) {
                        urls[item.id] = url;
                    }
                })
            );
            setImageUrls(urls);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    const handlePagination = (event, value) => {
        setCurrentPage(value);
    };

    if (news.length === 0) return null;

    return (
        <Box>
            <SoftTypography variant="h1" fontWeight="bold" mt="1%" sx={{ color: "#2596be" }}>
                {t('home_page.latest_news', 'Latest News')}
            </SoftTypography>
            <SoftTypography
                variant="body2"
                sx={{ color: "#8392ab", marginTop: "8px", marginBottom: "16px" }}
            >
                {t('home_page.stay_up_to_date', 'Stay up to date with the latest from MathE')}
            </SoftTypography>
            <Grid>
                {news.map((item) => (
                    <NewsCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        summary={item.summary}
                        imageUrl={imageUrls[item.id] || null}
                        link={item.link}
                        publishedAt={item.publishedAt}
                    />
                ))}
            </Grid>
            {totalPages > 1 && (
                <SoftBox mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePagination}
                        color="primary"
                        size="large"
                    />
                </SoftBox>
            )}
        </Box>
    );
};

export default News;
