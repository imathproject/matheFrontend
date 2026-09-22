import React, { useEffect, useState } from "react";
import CoverLayout from "./components/CoverLayout";
import ScrollSpy from "react-ui-scrollspy";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Information from "./components/Information";
import Contents from "./components/Contents";
import styled, { keyframes } from "styled-components";
import "./homePage.css";
import fundo_higher_education from "assets/images/fundo_higher_education.png"
import light from "assets/images/light.png";
import fundo5 from "assets/images/fundo5.jpg";
import fundo9 from "assets/images/fundo9.png";
import { useApi } from "api";

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const PulsatingDiv = styled.div`
  position: absolute;
  top: 5%;
  right: 0;
  background-image: url(${light});
  background-size: contain;
  background-repeat: no-repeat;
  width: 20%;
  height: 30%;
  animation: ${pulseAnimation} 1.5s infinite; // Apply the pulse animation
`;






function HigherEducationHomePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [elements, setElements] = useState([]);
  const api = useApi();

  useEffect(() => {
    fetchInformation();
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function fetchInformation() {
    try {
      const response = await api.get("/info/topics");
      if (response.data && response.data.elements && response.data.elements.elements) {
        setElements(response.data.elements.elements);
      } else if (response.data && response.data.elements) {
        setElements(response.data.elements);
      } else {
        setElements(response.data);
      }
    } catch (error) {
      //Handle Error
      console.error(error);
    }
  }


  return (
    <CoverLayout>
      <ScrollSpy>
        <div
          id="first"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo_higher_education})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            marginTop: "50px"
          }}
        >
          <About />
        </div>
        <div
          id="info"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo5})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Information />
        </div>

        <div
          id="contents"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Contents elements={elements} />
        </div>

        <div
          id="fifth"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo9})`,
            width: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: "flex",
          }}
        >
          <Contacts />
        </div>
      </ScrollSpy>
    </CoverLayout>
  );
}

export default HigherEducationHomePage;
