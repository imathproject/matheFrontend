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

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import FileDownloadButton from "services/downloadFile";
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import MovieClip from "examples/YoutubeVideo";
import { useTranslation } from "react-i18next";

function WrongAnswer({ wrong, keys }) {
  const [answerState, setAnswerState] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    var keywords = keys.map(function (object) {
      return object.id;
    });

    const postVideos = {
      id_lect: null,
      topic: null,
      subtopic: null,
      validate: 1,
      type: [1, 2],
      keywords: keywords
    }

    const postMaterials = {
      id_lect: null,
      topic: null,
      subtopic: null,
      validate: 1,
      type: [3],
      keywords: keywords
    }
    getVideos(postVideos)
    getMaterials(postMaterials)
  }, []);

  async function getMaterials(postData) {
    try {
      const data = await api.post("material/getCollection", postData);
      setMaterials(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function getVideos(postData) {
    try {
      const data = await api.post("material/getCollection", postData);
      setVideos(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  const Video = () => {
    return (
      <SoftBox
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(320px, 2fr))"
        gap={1}
        p={1}
        m={3}
      >
        {videos.map((key, index) => {
          console.log(key)
          console.log(key.link)
          return (
            <SoftBox key={index} width="100%" display="flex" flexDirection="column" mt={2}>
              <SoftBox
                width="100%"
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
                mr={2}
              >
                <MovieClip videoId={key.link} title={key.title} description={key.description} />
                <SoftBox
                  width="80%"
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  sx={{
                    '@media (max-width: 700px)': {
                      width: "70%"
                    },
                  }}>
                  <SoftTypography variant="button" fontWeight="bold" color="info">
                    {key.title}
                  </SoftTypography>
                  <SoftTypography variant="caption" fontWeight="medium">
                    {key.description}
                  </SoftTypography>
                </SoftBox>

              </SoftBox>
            </SoftBox>

          )
        })}
      </SoftBox>

    )
  }

  const Material = () => {
    return (
      <SoftBox
        flexDirection="column"
        width="100%"
        display="flex"
        borderTop={1}
        borderColor="#1a79b4">
        {materials.map((key, index) => {
          return (
            <SoftBox
              key={index}
              component="li"
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              bgColor="grey-100"
              borderRadius="lg"
              p={3}
              mt={2}
            >
              <SoftBox width="100%" display="flex" flexDirection="row" sx={{
                '@media (max-width: 600px)': {
                  flexDirection: "column",
                },
              }}>
                <SoftBox
                  width="30%"
                  display="flex"
                  borderRight={1}
                  borderColor="#02c6f3"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{
                    '@media (max-width: 600px)': {
                      borderRight: 0,
                      borderBottom: 1,
                      flexDirection: "row",
                      width: "100%",
                      borderColor: "#02c6f3",
                      mb: 2
                    },
                  }}>

                  <SoftBox display="flex" flexDirection="column" alignItems="center" m={2}>
                    <FileDownloadButton id={key.id} fileExtension={key.file_ext} name={key.file_name} />
                  </SoftBox>

                </SoftBox>
                <SoftBox
                  width="90%"
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  ml={2}
                >
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="large" color="info">
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

              </SoftBox>
            </SoftBox>
          )
        })}
      </SoftBox>
    )
  }

  return (
    <SoftBox
      width="100%"
      display="flex"
      flexDirection="column"
      mb={2}
      mt={2}
    >
      <SoftTypography>{t("challenge.your_answer", "Your answer:")}{" "}</SoftTypography>
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
          <SoftBox mr={2}>
            <FontAwesomeIcon icon={faXmark} color="white" size="lg" />
          </SoftBox>
          <SoftTypography
            variant="h6"
            fontWeight="regular" mr={1} color="white">
            <Latex>{wrong}</Latex>
          </SoftTypography>
        </SoftBox>

      </SoftBox>
      {materials.length != 0 || videos.length != 0 ?
        <SoftBox>
          <Button variant="contained" sx={{ mt: 3, mb: 3 }} color="info" onClick={() => setAnswerState(!answerState)}>
            {answerState ? "Hide Materials" : "Show Materials"}
          </Button>
        </SoftBox> : <></>}
      {(answerState && videos.length > 0) ? <Video /> : null}
      {(answerState && materials.length > 0) ? <Material /> : null}
    </SoftBox>
  );
}

// Setting default values for the props of Bill
WrongAnswer.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
WrongAnswer.propTypes = {
  keys: PropTypes.arrayOf(Object).isRequired,
  wrong: PropTypes.string,
  noGutter: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default WrongAnswer;
