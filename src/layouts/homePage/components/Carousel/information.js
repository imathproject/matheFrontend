import PropTypes from "prop-types";
import React, { useState, useEffect } from 'react';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import slideshow1 from 'assets/images/slideshow1.jpg';
import Typewriter from "../TypeWriter";

const Information = ({ img, title, text, bgSize = 'cover' }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasContent = Boolean(title || text);

  return (
    <div style={{
      backgroundImage: hasContent
        ? `linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 45%, rgba(0, 0, 0, 0) 75%), url(${img})`
        : `url(${img})`,
      height: windowDimensions.height - 150,
      width: '100%',
      backgroundSize: bgSize,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: "flex",
      justifyContent: "flex-start"
    }}>
      {hasContent && (
        <SoftBox mx="10%" mt="10%" sx={{
          maxWidth: { xs: "90%", md: "560px" },
          '@media (max-width: 1100px)': {
            mt: "25%"
          },
        }}>
          {/* Scrim darkens the strip behind the text and fades out to the right,
              keeping the photo readable and medals visible on every slide. */}
          <SoftBox>
            <h1
              dangerouslySetInnerHTML={{ __html: title }}
              style={{
                fontWeight: "bold",
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
                marginBottom: "12px",
              }}
            />
            <SoftTypography
              variant="h6"
              color="white"
              fontWeight="bold"
              sx={{
                textShadow: "0 1px 8px rgba(0, 0, 0, 0.7)",
                lineHeight: 1.5,
              }}
            >
              {text}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      )}
    </div>
  );
};

Information.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  bgSize: PropTypes.string
};

export default Information;
