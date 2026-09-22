import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CoverLayout from "./components/CoverLayout";
import ScrollSpy from "react-ui-scrollspy";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Information from "./components/Information";
import Partners from "./components/Partners";
import "./homePage.css";
import fundo5 from "assets/images/fundo5.jpg";
import fundo8 from "assets/images/fundo8.png";
import fundo9 from "assets/images/fundo9.png";
import fundo_olympiads from "assets/images/fundo_olympiads.png";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";



function OlympicHomePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [activeSection, setActiveSection] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <CoverLayout>
      <div className="navbar">
        <p
          className={`nav-item ${activeSection === "first" ? "active" : ""}`}
          onClick={() => scrollToSection("first")}
        >
          <FontAwesomeIcon icon={faPeopleGroup} style={{ marginRight: 5 }} />
          {t('home_page_olympiad.about_us', 'About us')}
        </p>
        <p
          className={`nav-item ${activeSection === "fifth" ? "active" : ""}`}
          onClick={() => scrollToSection("fifth")}
        >
          <FontAwesomeIcon icon={faPhone} style={{ marginRight: 5 }} />
          {t('home_page_olympiad.contact_us', 'Contact us')}
        </p>
      </div>
      <ScrollSpy>
        <div
          id="first"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo_olympiads})`,
            width: "100%",
            backgroundSize: `auto ${windowHeight}px`,
            backgroundPosition: "right top",
            backgroundRepeat: "no-repeat",
            display: "flex",
            justifyContent: "center",
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
          id="partners"
          style={{
            padding: "40px 0",
            backgroundImage: `url(${fundo8})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Partners />
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

export default OlympicHomePage;
