import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import SoftRadioButton from "layouts/challenge/components/RadioButton";
import { useApi } from 'api';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Question({ questionID, question, options, olympicName, onClickAnswer, image, extension }) {
  const [fileSrc, setFileSrc] = useState(null);
  const [error, setError] = useState(null);

  const handleChangeAnswer = (id, answer) => {
    onClickAnswer(id, answer);
  };
  const api = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    setFileSrc(null);
    if (image != null) fetchFile(questionID, extension);
  }, [questionID]);

  const fetchFile = async (id, extension) => {
    try {
      const response = await api.post('olympicQuestion/downloadImage', {
        id: id
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
          <SoftBox display="flex" flexDirection="row" justifyContent="space-between" mb={4} borderBottom={1} borderColor="#E89F51" sx={{
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
              <SoftTypography sx={{ color: "#F0A844" }} fontWeight="bold">{t("olympic_assessment_page.olympiad", "Olympiad:")}&nbsp;&nbsp;&nbsp;</SoftTypography>
              <SoftTypography>{olympicName}</SoftTypography>
            </SoftBox>
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

Question.propTypes = {
  questionID: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  olympicName: PropTypes.string,
  onClickAnswer: PropTypes.func.isRequired,
  image: PropTypes.string,
  extension: PropTypes.string
};

export default Question;
