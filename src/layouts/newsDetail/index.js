import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import axios from "axios";
import CoverLayout from "layouts/homePage/components/CoverLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import notica_background1 from "assets/images/noticia_background1.png";
import noticia_background2 from "assets/images/noticia_background2.jpg";
import noticia_background3 from "assets/images/noticia_background3.jpg";

const BASE_URL = process.env.REACT_APP_MATHE_API;

// --- NOVOS COMPONENTES DE ESTRUTURA E BACKGROUND ---

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

const BackgroundSequence = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BgItem = styled.div`
  width: 100%;
  /* Define a altura de cada bloco de imagem. 100vh equivale a uma "tela inteira".
     Caso as imagens possuam uma altura específica fixa (ex: 800px), altere aqui. */
  min-height: 100vh;
  flex-shrink: 0;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1; /* Garante que o conteúdo fique sempre acima do background */
`;

// --- COMPONENTES ORIGINAIS MANTIDOS ---

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  width: 100%;
`;

const HeroImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 640px) {
    height: 250px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled(Button)`
  background: transparent;
  border: 2px solid #2596be;
  color: #2596be;
  border-radius: 10px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: #2596be;
    color: white;
    transform: translateX(-4px);
    box-shadow: 0 4px 12px rgba(37, 150, 190, 0.3);
  }
`;

const Content = styled.div`
  color: #344767;
  font-size: 16px;
  line-height: 1.8;
  margin-top: 24px;

  p {
    margin-bottom: 16px;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 24px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #e89f51, #d4893f);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin-top: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(232, 159, 81, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(232, 159, 81, 0.4);
    color: white;
  }
`;

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [id]);

  async function fetchNewsImage(newsItem) {
    if (!newsItem.imageUrl) return null;
    try {
      const parts = newsItem.imageUrl.split(".");
      const fileExt = parts[parts.length - 1];
      const fileId = parts.slice(0, -1).join(".");
      const response = await axios.post(
        `${BASE_URL}news/downloadImage`,
        { id: fileId, file_ext: fileExt },
        { responseType: "blob" }
      );
      const imageBlob = new Blob([response.data]);
      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error("Failed to load news image:", error);
      return null;
    }
  }

  async function fetchNews() {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}news/getById/${id}`);
      const newsData = response.data.element;
      setNews(newsData);

      // Fetch the image from the download endpoint
      const imageUrl = await fetchNewsImage(newsData);
      setHeroImageUrl(imageUrl);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("News article not found.");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Subcomponente de renderização sequencial
  const RenderBackgrounds = () => (
    <BackgroundSequence>
      {/* Array de repetição para garantir que, caso a notícia seja massiva, as imagens continuem fluindo na mesma ordem. */}
      {Array.from({ length: 5 }).map((_, index) => (
        <React.Fragment key={index}>
          <BgItem src={notica_background1} />
          <BgItem src={noticia_background2} />
          <BgItem src={noticia_background3} />
        </React.Fragment>
      ))}
    </BackgroundSequence>
  );

  if (loading) {
    return (
      <CoverLayout>
        <LoadingContainer>
          <SoftTypography variant="h4" sx={{ color: "#8392ab" }}>
            Loading...
          </SoftTypography>
        </LoadingContainer>
      </CoverLayout>
    );
  }

  if (error || !news) {
    return (
      <CoverLayout>
        <PageWrapper>
          <RenderBackgrounds />
          <ContentWrapper>
            <Container>
              <BackButton onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Go Back
              </BackButton>
              <SoftTypography variant="h3" sx={{ color: "#344767", textAlign: "center" }}>
                {error || "News article not found."}
              </SoftTypography>
            </Container>
          </ContentWrapper>
        </PageWrapper>
      </CoverLayout>
    );
  }

  return (
    <CoverLayout>
      <PageWrapper>
        <RenderBackgrounds />
        
        <ContentWrapper>
          <Container>
            <BackButton onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Go Back
            </BackButton>

            {heroImageUrl && (
              <HeroImage>
                <img src={heroImageUrl} alt={news.title} />
              </HeroImage>
            )}

            <SoftTypography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "#344767",
                lineHeight: 1.3,
                marginBottom: "16px",
              }}
            >
              {news.title}
            </SoftTypography>

            <MetaInfo>
              {news.publishedAt && (
                <MetaItem>
                  <FontAwesomeIcon icon={faCalendar} color="#2596be" />
                  <SoftTypography sx={{ color: "#8392ab", fontSize: "14px" }}>
                    {formatDate(news.publishedAt)}
                  </SoftTypography>
                </MetaItem>
              )}
            </MetaInfo>

            {news.summary && (
              <>
                <SoftTypography
                  variant="h6"
                  sx={{
                    color: "#8392ab",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  {news.summary}
                </SoftTypography>
                <Divider />
              </>
            )}

            <Content>
              {news.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Content>

            {news.link && (
              <>
                <Divider />
                <LinkButton
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  Visit Link
                </LinkButton>
              </>
            )}
          </Container>
        </ContentWrapper>
      </PageWrapper>
    </CoverLayout>
  );
};

export default NewsDetail;