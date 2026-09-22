// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";

import SoftTypography from "components/SoftTypography";
//API
import { useMaterialContext } from "layouts/library/Provider";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import Card from '@mui/material/Card';
import Card from 'react-bootstrap/Card';
import MovieClip from "examples/YoutubeVideo";
import CardGroup from 'react-bootstrap/CardGroup';
import { useTranslation } from "react-i18next";
function VideoCollection() {
  const { videoResults } = useMaterialContext();
  const [page, setPage] = useState(1);
  const videosPerPage = 3;
  const indexOfLastVideo = page * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videoResults.slice(indexOfFirstVideo, indexOfLastVideo);
  const { t } = useTranslation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const flexDirection = windowWidth <= 1011 ? 'column' : 'row';
  const margin = windowWidth <= 1011 ? '0px' : '8px';
  const marginBottom = windowWidth <= 1011 ? '20px' : '0px';

  const handlePagination = (event, value) => {
    setPage(value);
  };


  return (
    <SoftBox>
      <CardGroup style={{ display: 'flex', flexDirection: flexDirection, flexWrap: 'wrap' }} >

        {currentVideos.length === 0 ? (
          <SoftBox sx={{ display: 'flex', justifyContent: 'center', margin: 'auto', marginTop: '20px' }}>
            <SoftTypography textGradient color="info" fontWeight="bold">
              {t("library_page.no_materials_associated", "There are no materials associated.")}
            </SoftTypography>
          </SoftBox>
        ) : (
          currentVideos.map((key, index) => {
            var subtopic = null;
            if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (

              <Card key={index} border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom }}>
                <div style={{ alignItems: "center", justifyContent: "center" }}>
                  <MovieClip id={key.id} videoId={key.link} />
                </div>
                <Card.Body >
                  <SoftBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center" // Align children horizontally
                  >
                    <SoftTypography variant="h6" fontWeight="bold" color="info">
                      {key.title}
                    </SoftTypography>
                    <SoftTypography variant="caption" fontWeight="medium">
                      {key.description}
                    </SoftTypography>
                  </SoftBox>
                </Card.Body>
              </Card>


            );
          })
        )}
      </CardGroup>
      {currentVideos.length != 0 ? (
        <Stack mt={2} spacing={3} alignItems="center">
          <Pagination color="info" count={Math.ceil(videoResults.length / videosPerPage)} page={page} onChange={handlePagination} />
        </Stack>) : null}
    </SoftBox>
  );
};

export default VideoCollection;