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

//Icons
import SoftTypography from "components/SoftTypography";
import { useTranslation } from "react-i18next";

function QuestionCard({ question, right, answer }) {
  const { t } = useTranslation();
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
              {t("olympic_assessment_page.question", "Question")}
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
                {t("olympic_assessment_page.your_answer", "Your answer")}
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
  keys: PropTypes.arrayOf(Object),
  right: PropTypes.string.isRequired,
  answer: PropTypes.string,
  question: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default QuestionCard;
