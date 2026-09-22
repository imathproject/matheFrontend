import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import { SiSagemath, } from "react-icons/si";
import { PiMathOperationsBold, PiApproximateEqualsBold, PiVectorThree } from "react-icons/pi";
import { FiCodesandbox, FiList, FiLayers } from "react-icons/fi";
import { FaHubspot, FaPencilRuler, FaRegMap, FaRegChartBar, FaRegSnowflake, FaUncharted, FaCode, FaLink, FaRoute } from "react-icons/fa";
import { TbMath, TbMathFunction, TbMathIntegralX, TbMathIntegrals, TbMathFunctionY, TbVectorTriangle, TbMathMaxMin, TbMatrix, TbLine } from "react-icons/tb";
import { FaArrowUpRightDots, FaArrowsLeftRightToLine, FaArrowsUpToLine } from "react-icons/fa6";
import { TiInfoLarge } from "react-icons/ti";
import { HiOutlineCubeTransparent } from "react-icons/hi";
import { TiPiOutline } from "react-icons/ti";
const Container = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 10%;
  background-color: white;
`;

const Title = styled(SoftTypography)`
  color: #2596be;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const CardContainer = styled.div`
  background-color: transparent;
  perspective: 1000px;
  height: 270px;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;

  ${CardContainer}:hover & {
    transform: rotateY(180deg);
  }
`;

const CardFront = styled.div`
  background-color: white;
  border: 1px solid ${props => props.borderColor || '#f9cd8b'};
  border-radius: 8px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 270px;
  backface-visibility: hidden;
  position: relative;
  transform: rotateY(0deg);
  z-index: 2;
`;

const CardBack = styled.div`
  background-color: white;
  border: 1px solid ${props => props.borderColor || '#f9cd8b'};
  border-radius: 8px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 270px;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: rotateY(180deg);
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: #344767;
  height: 140px;
  overflow-y: auto;
  padding-right: 8px;
  text-align: left;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .bullet-point {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    
    &:before {
      content: '•';
      margin-right: 8px;
      font-weight: bold;
      flex-shrink: 0;
    }
  }
`;

const IconWrapper = styled.div`
  color: #1a237e;
  font-size: 72px;
  margin-bottom: 15px;
  
  @keyframes sizeChange {
    0% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1.0);
    }
  }
  
  animation: sizeChange 0.8s ease-in-out infinite alternate;
`;

const Label = styled(SoftTypography)`
  font-size: 16px;
  font-weight: 600;
  color: #344767;
`;

const defaultIcons = [
  TiPiOutline,
  SiSagemath,
  TbMath,
  PiMathOperationsBold,
  TbMathFunction,
  TbMathIntegrals,
  TbMathIntegralX,
  TbMathFunctionY,
  TbVectorTriangle,
  FiCodesandbox,
  FiList,
  FiLayers,
  FaHubspot,
  FaPencilRuler,
  HiOutlineCubeTransparent,
  FaRegMap,
  FaRegChartBar,
  FaRegSnowflake,
  TbLine,
  PiApproximateEqualsBold,
  FaRoute,
  TbMathMaxMin,
  FaUncharted,
  FaArrowUpRightDots,
  FaArrowsLeftRightToLine,
  FaArrowsUpToLine,
  PiVectorThree,
  TbMatrix,
  FaCode,
  TiInfoLarge,
  FaLink
];

const iconMap = {
  TiPiOutline,
  SiSagemath,
  PiMathOperationsBold,
  TbMath,
  TbMathFunction,
  TbMathIntegrals,
  TbMathIntegralX,
  TbMathFunctionY,
  TbVectorTriangle,
  FiCodesandbox,
  FiList,
  FiLayers,
  FaHubspot,
  FaPencilRuler,
  HiOutlineCubeTransparent,
  FaRegMap,
  FaRegChartBar,
  FaRegSnowflake,
  TbLine,
  PiApproximateEqualsBold,
  FaRoute,
  TbMathMaxMin,
  FaUncharted,
  FaArrowUpRightDots,
  FaArrowsLeftRightToLine,
  FaArrowsUpToLine,
  PiVectorThree,
  TbMatrix,
  FaCode,
  TiInfoLarge,
  FaLink
};

const Contents = ({ elements = [] }) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 400) {
        setColumns(1);
      } else if (width <= 600) {
        setColumns(2);
      } else if (width <= 900) {
        setColumns(3);
      } else if (width <= 1400) {
        setColumns(4);
      } else {
        setColumns(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!elements || elements.length === 0) return null;

  return (
    <Container id="contents">
      <Title variant="h2">{t('higher_education.available_contents', 'Content')}</Title>
      <div className='m-2'>
        {t('higher_education.available_contents_desc', 'The collection of mathematical resources are organized by topic, subtopic, and keywords to help you find what you need.')}
      </div>
      <Grid>
        {elements.map((el, index) => {
          let IconComponent = el.icon ? iconMap[el.icon] : null;
          if (!IconComponent) {
            IconComponent = defaultIcons[index % defaultIcons.length];
          }
          // Alternate border colors based on current row
          const row = Math.floor(index / columns);
          const borderColor = row % 2 === 0 ? '#f9cd8b' : '#344767'; // orange or dark blue

          return (
            <CardContainer key={el.id || index}>
              <CardInner>
                <CardFront borderColor={borderColor}>
                  <IconWrapper>
                    <IconComponent size={50} />
                  </IconWrapper>
                  <Label>{el.label}</Label>
                </CardFront>
                <CardBack borderColor={borderColor}>
                  <Description>
                    {(el.description || t('higher_education.detailed_desc_unavailable', "Detailed description regarding this specific content is currently unavailable.")).split(',').map((item, idx) => (
                      <div key={idx} className="bullet-point">
                        {item.trim()}
                      </div>
                    ))}
                  </Description>
                </CardBack>
              </CardInner>
            </CardContainer>
          );
        })}
      </Grid>
    </Container>
  );
};

Contents.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

export default Contents;
