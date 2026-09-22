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
import SoftTypography from "components/SoftTypography";
import FileDownloadButton from "services/downloadFile";

function Material({ description,title, author, fileName, materialID, fileExtension, noGutter, name }) {
  return (
    <SoftBox
      display="flex"
      bgColor="grey-100"
      borderRadius="lg"
      p={3}
      mt={2}
    >
      <SoftBox display="flex" flexDirection="row"  sx={{
          '@media (max-width: 600px)': {
           flexDirection:"column",
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
          {/* <SoftBox lineHeight={0} mb={3}>
          <SoftTypography variant="button" fontWeight="large" color="dark" mb={1}>
            TCM{materialID}
          </SoftTypography>
          </SoftBox> */}

          <SoftBox display="flex" flexDirection="column" alignItems="center" m={2}>
              <FileDownloadButton id={materialID} fileExtension={fileExtension} name={name}/>
          </SoftBox>
          
        </SoftBox>
        <SoftBox
          width="70%"
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          ml={2}
        >  
          <SoftBox>
          <SoftTypography variant="button" fontWeight="bold" color="info">
            {title}
          </SoftTypography>
          </SoftBox>
          <SoftBox mb={3}>
          <SoftTypography variant="caption" color="info" fontWeight="medium">
            {author}
          </SoftTypography>
        </SoftBox>
        <div style={{ marginBottom: '1rem' }}>
        <SoftTypography variant="h6" fontWeight="regular">
          {description}
        </SoftTypography>
       </div>
    
        </SoftBox>
    
      </SoftBox>
    </SoftBox>
  );

}

// Setting default values for the props of Bill
Material.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Material.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  materialID: PropTypes.number.isRequired,
  fileName: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  fileExtension: PropTypes.string,
  noGutter: PropTypes.bool,
  name: PropTypes.string.isRequired
};

export default Material;
