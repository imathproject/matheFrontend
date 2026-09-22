/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Accordion from 'react-bootstrap/Accordion';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faFile, faPersonDigging } from '@fortawesome/free-solid-svg-icons'
import SoftTypography from "components/SoftTypography";
import MovieClip from "examples/YoutubeVideo";
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import FileDownloadButton from "services/downloadFile";
import { useApi } from 'api';
import { useTranslation } from "react-i18next";

function QuestionCard({ question, right, answer, keys }) {
  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageM, setPageM] = useState(1);
  const api = useApi();
  const { t } = useTranslation();
  const videosPerPage = 3;
  const indexOfLastVideo = page * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const materialsPerPage = 3;
  const indexOfLastMaterial = pageM * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  const flexDirection = windowWidth <= 1011 ? 'column' : 'row';
  const margin = windowWidth <= 1011 ? '0px' : '8px';
  const marginBottom = windowWidth <= 1011 ? '20px' : '0px';

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const handlePaginationMaterial = (event, value) => {
    setPageM(value);
  }

  useEffect(() => {

    var keywords = keys.map(function (object) {
      return object.id;
    });

    const postVideos ={
      topic: null,
      subtopic: null,
      type: 1,
      keywords: keywords
    }

    const postMaterials ={
      topic: null,
      subtopic: null,
      type: 3,
      keywords: keywords
    }
    getVideos(postVideos)
    getMaterials(postMaterials)
  }, []);

  async function getMaterials(postData) {
    try {
    const data = await api.post("material/getLibrary", postData); 
    setMaterials(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getVideos(postData) {
    try {
      const data = await api.post("material/getLibrary", postData);
      setVideos(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }
  return (
    <SoftBox
      display="flex"
      flexDirection="row"
      bgColor="grey-100"
      borderRadius="lg"
      p={2}
      mt={2}
    >
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftBox
          width="100%"
          display="flex"
          flexDirection="column"
          mb={2}
        >
          <SoftBox display="flex" flexDirection="column" justifyContent="space-between" borderBottom={1}>
            <SoftTypography mb={2} fontWeight="bold">
              {t("he_assessment_page.question", "Question")}
            </SoftTypography>

            <div style={{ overflowY: 'auto' }}>
              <SoftTypography
                variant="h6"
                fontWeight="regular"
                mb={2}>
                <Latex>{question}</Latex>
              </SoftTypography>
            </div>
          </SoftBox>
        </SoftBox>
        <div style={{ overflowY: 'auto' }}>
          <SoftBox
            width="100%"
            display="flex"
            alignItems="flex-start"
            flexDirection="column"
            bgColor="grey-100"
            borderRadius="lg"
            p={2}
            sx={{
              background: "#6cc969",
            }}
          >

            <SoftBox display="flex" flexDirection="row">
              {/* <SoftBox mr={2}>
                  <FontAwesomeIcon icon={faCheck} size="lg"/>
                </SoftBox> */}
              <SoftTypography
                variant="h6"
                fontWeight="regular" mr={1} >
                <Latex>{right}</Latex>
              </SoftTypography>
            </SoftBox>

          </SoftBox>
        </div>
        {
          right != answer ?
            <SoftBox mt={2}>

              <SoftTypography fontWeight="bold">
                {t("he_assessment_page.your_answer", "Your answer")}
              </SoftTypography>
              <div style={{ overflowY: 'auto' }}>
                <SoftBox
                  width="100%"
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  bgColor="grey-100"
                  borderRadius="lg"
                  p={2}
                  sx={{
                    background: "#d93e38",
                  }}
                >

                  <SoftBox display="flex" flexDirection="row">
                    {/* <SoftBox mr={2}>
                  <FontAwesomeIcon icon={faXmark} color="white" size="lg"/>
                </SoftBox> */}
                    <SoftTypography
                      variant="h6"
                      fontWeight="regular" mr={1} color="white">
                      <Latex>{answer}</Latex>
                    </SoftTypography>
                  </SoftBox>

                </SoftBox>
              </div>
              <Accordion style={{ marginTop: '20px' }}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faVideo} color="#344767" size="lg" />
                    <SoftTypography color="dark" ml={2}>
                      {t("he_assessment_page.video_lessons", "Video Lessons")}
                    </SoftTypography>
                  </Accordion.Header>
                  <Accordion.Body>
                    <SoftBox>
                      <CardGroup style={{ display: 'flex', flexDirection: flexDirection, flexWrap: 'wrap' }}>
                        {currentVideos.length === 0 ? ( // Check if there are no videos
                          <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <FontAwesomeIcon icon={faPersonDigging} color="#0578b7" />
                            <SoftTypography variant="body1" color="info" fontWeight="bold" ml={2}>
                              {t("he_assessment_page.new_materials", "New materials will be available soon. Keep connected!")}
                            </SoftTypography>
                          </SoftBox>

                        ) : (
                          currentVideos.map((key, index) => {
                            let subtopic = "";
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
                                    alignItems="center"
                                  >
                                    <SoftTypography variant="h6" fontWeight="bold" color="info">
                                      {key.title}
                                    </SoftTypography>
                                    <SoftTypography variant="caption" fontWeight="medium">
                                      <Latex>{key.description}</Latex>
                                    </SoftTypography>
                                  </SoftBox>
                                </Card.Body>
                              </Card>
                            );
                          })
                        )}
                      </CardGroup>
                      {currentVideos.length != 0 ?
                        <Stack mt={2} spacing={3} alignItems="center">
                          <Pagination color="info" count={Math.ceil(videos.length / videosPerPage)} page={page} onChange={handlePagination} />
                        </Stack> : null}
                    </SoftBox>
                  </Accordion.Body>

                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faFile} color="#344767" size="lg" />
                    <SoftTypography color="dark" ml={3}>
                      {t("he_assessment_page.teaching_materials", "Teaching Materials")}
                    </SoftTypography>
                  </Accordion.Header>
                  <Accordion.Body>
                    <CardGroup style={{ display: 'flex', flexDirection: flexDirection, flexWrap: 'wrap' }} >
                      {currentMaterial.length === 0 ? ( // Check if there are no videos
                        <SoftBox sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                          <FontAwesomeIcon icon={faPersonDigging} color="#0578b7" />
                          <SoftTypography variant="body1" color="info" fontWeight="bold" ml={2}>
                            {t("he_assessment_page.new_materials", "New materials will be available soon. Keep connected!")}
                          </SoftTypography>
                        </SoftBox>

                      ) : (
                        currentMaterial.map((key, index) => {
                          var subtopic = null;
                          if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
                          return (
                            <Card key={index} border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom, borderRadius: '4%' }}>
                              <Card.Body >
                                <SoftBox sx={{ display: 'flex', justifyContent: "center", mb: 3 }}>
                                  <FileDownloadButton id={key.id} fileExtension={key.file_ext} name={key.file_name} />
                                </SoftBox>
                                <SoftBox
                                  display="flex"
                                  alignItems="flex-start"
                                  flexDirection="column"
                                >
                                  <SoftBox>
                                    <SoftTypography variant="button" fontWeight="bold" color="info">
                                      {key.title}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={3}>
                                    <SoftTypography variant="caption" color="info" fontWeight="medium">
                                      {key.author}
                                    </SoftTypography>
                                  </SoftBox>
                                  <div style={{ marginBottom: '1rem' }}>
                                    <SoftTypography variant="h6" fontWeight="regular">
                                      {key.description}
                                    </SoftTypography>
                                  </div>

                                </SoftBox>
                              </Card.Body>
                            </Card>
                          );
                        })
                      )}
                    </CardGroup>
                    {currentMaterial.length != 0 ?
                      <Stack mt={2} spacing={3} alignItems="center">
                        <Pagination color="info" count={Math.ceil(materials.length / materialsPerPage)} page={pageM} onChange={handlePaginationMaterial} />
                      </Stack> : null}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </SoftBox>
            : null
        }
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of Bill
QuestionCard.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
QuestionCard.propTypes = {
  keys: PropTypes.arrayOf(Object).isRequired,
  right: PropTypes.string.isRequired,
  answer: PropTypes.string,
  question: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default QuestionCard;
