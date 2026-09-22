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
import MovieClip from "examples/YoutubeVideo";

function Video({ description, link, title,  author, videoID, noGutter}) {

  return (
    <SoftBox width="100%" display="flex" flexDirection="column" mt={2}>
    <SoftBox
      width="100%"
      display="flex"
      alignItems="flex-start" 
      flexDirection="column"
      mr={2}
    >
      <MovieClip videoId={link} title={title} description={description}/>
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
            {title}
       </SoftTypography>
       <SoftTypography variant="caption" fontWeight="medium">
            {description}
       </SoftTypography>
    </SoftBox>
           
    </SoftBox>
  </SoftBox>
  );
}

Video.defaultProps = {
  noGutter: false,
};

Video.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  videoID: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  link: PropTypes.string
};

export default Video;
