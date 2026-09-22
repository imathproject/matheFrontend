import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import styled from 'styled-components';
import { useApi } from 'api';
import ipb from 'assets/images/ipbLogo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight} from '@fortawesome/free-solid-svg-icons';

const CardBody = styled(Card.Body)`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  background-color: #f9f9f9; 
  border-radius: 100%;
  border: 10px solid #0dcaf0;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #344767;
    border: 10px solid #344767;
  }
`;

const AnimatedCard = styled(Card)`
  text-align: center;
  justify-content: center;
  border: 0px solid;
  margin: 30px;
`;

const InstructionalText = styled(SoftTypography)`
  color: #a9a9a9;
  ${CardBody}:hover & {
    color: #0dcaf0;
  }
`;

const LabelText = styled(SoftTypography)`
  color: #a9a9a9;
  ${CardBody}:hover & {
    color: #0dcaf0;
  }
`;

const Box = styled(SoftBox)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`;

const Section = styled(SoftBox)`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`;

const Footer = () => {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <SoftBox sx={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems: "center", m: 5}}>
    <SoftBox sx={{width:"20%", textAlign: "left"}}>
      <img src={ipb} style={{ height: '100px', width: 'auto', display: 'block', borderRadius: '6%' }} /> 
    </SoftBox>
    <SoftBox sx={{width:"70%", marginLeft: '20px'}}> 
      <SoftTypography variant="h3" color="dark" sx={{textAlign: 'left'}}>Name Surname</SoftTypography> 
      <SoftTypography variant="h6" color="dark"  style={{textAlign: 'left'}}>Country</SoftTypography>
    </SoftBox>
    <SoftBox sx={{width:"10%"}}> 
        <FontAwesomeIcon icon={faQuoteRight} color="white" size="6x"/>
    </SoftBox>
   
  </SoftBox>
   
  );
};

export default Footer;

