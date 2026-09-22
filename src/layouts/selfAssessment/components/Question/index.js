import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import SoftRadioButton from "../RadioButton";
import { useApi } from 'api';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Question({ questionID, question, options, topic, subtopic, onClickAnswer, image, extension }) {
  const [fileSrc, setFileSrc] = useState(null);
  const [error, setError] = useState(null);

  const handleChangeAnswer = (id, answer) => {
    onClickAnswer(id, answer);
  };
  const api = useApi();
  const { t } = useTranslation();
  useEffect(() => {
    setFileSrc(null)
    if (image != null) fetchFile(questionID, extension);
  }, [questionID]);

  const fetchFile = async (id, extension) => {
    try {
      const response = await api.post('question/downloadImage', {
        id: id,
        file_ext: extension
      }, { responseType: 'blob' });

      const url = URL.createObjectURL(new Blob([response.data]));
      setFileSrc(url);
    } catch (err) {
      setError('Failed to fetch file');
    }
  };

  return (
    <SoftBox display="flex">
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftBox
          width="100%"
          display="flex"
          flexDirection="column"
          mb={2}
          bgColor="grey-100"
          borderRadius="lg"
          p={2}
          mt={2}
        >
          <SoftBox display="flex" flexDirection="row" justifyContent="space-between" mb={4} borderBottom={1} borderColor="#02c6f3" sx={{
            '@media (max-width: 600px)': {
              flexDirection: 'column',
            },
          }}>
            <SoftBox display="flex" flexDirection="row" mr={2} sx={{
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                mb: 2
              },
            }}>
              <SoftTypography color="info" fontWeight="bold">{t("he_assessment_page.topic", "Topic:")}&nbsp;&nbsp;&nbsp;</SoftTypography>
              <SoftTypography>{topic.name}</SoftTypography>
            </SoftBox>
            {subtopic && (
              <SoftBox display="flex" flexDirection="row" sx={{
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                },
              }}>
                <SoftTypography color="info" fontWeight="bold">{t("he_assessment_page.subtopic", "Subtopic:")}&nbsp;&nbsp;&nbsp;</SoftTypography>
                <SoftTypography>{subtopic.name}</SoftTypography>
              </SoftBox>
            )}
          </SoftBox>
          <div style={{ padding: '1rem', overflowY: 'auto' }}>
            <SoftTypography
              variant="h6"
              fontWeight="regular">
              <Latex displayMode>{question}</Latex>
            </SoftTypography>
          </div>
          <div style={{ padding: '1rem', overflowY: 'auto', width: '100%' }}>
            {fileSrc && extension === 'pdf' ? (
              <a href={fileSrc} download={image}>{t("he_assessment_page.download_file", "Download file")}</a>
            ) : (
              fileSrc && <img src={fileSrc} alt={image} width="25%" />
            )}
          </div>
        </SoftBox>
        <SoftBox width="100%">
          <div style={{ padding: '1rem', overflowY: 'auto' }}>
            <SoftRadioButton key={question} onNewValueSelected={handleChangeAnswer} options={options} />
          </div>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

Question.defaultProps = {
  noGutter: false,
};

Question.propTypes = {
  questionID: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  topic: PropTypes.object.isRequired,
  subtopic: PropTypes.object,
  onClickAnswer: PropTypes.func.isRequired,
  image: PropTypes.string,
  extension: PropTypes.string
};

export default Question;