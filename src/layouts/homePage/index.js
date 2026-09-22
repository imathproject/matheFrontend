import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CoverLayout from "./components/CoverLayout";
import ScrollSpy from "react-ui-scrollspy";
import About from "./components/About";
import SoftTypography from "components/SoftTypography";
import Testimonial from "./components/Testimonial";
import Contacts from "./components/Contacts";
import PhotosCarousel from "./components/Carousel";
import Information from "./components/Information";
import Publications from "./components/Publications";
import Awards from "./components/Awards";
import News from "./components/News";
import { keyframes } from "styled-components";
import "./homePage.css";
import fundo_about from "assets/images/fundo_about.png";
import fundo5 from "assets/images/fundo5.jpg";
import fundo6 from "assets/images/fundo6.png";
import fundo7 from "assets/images/fundo7.png";
import fundo8 from "assets/images/fundo8.png";
import fundo9 from "assets/images/fundo9.png";
import fundoawards from "assets/images/fundoawards.png"
import ChoroplethMap from "./components/FinalMap";
import { useApi } from "api";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faPeopleGroup,
  faPhone,
  faCommentDots,
  faChartSimple,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import SoftBox from "components/SoftBox";

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

// The page scrolls inside the PageLayout container rather than the window, so the
// element that actually scrolls has to be looked up to keep the menu in sync.
function getScrollContainer(element) {
  let node = element ? element.parentElement : null;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return window;
}

// Sections listed in the exact order they appear on the page.
// `id` must match the id of the corresponding <div> inside <ScrollSpy> below.
const navSections = [
  { id: "first", icon: faPeopleGroup, translationKey: "home_page.about_us", defaultLabel: "About us" },
  { id: "awards", icon: faChartSimple, translationKey: "home_page.outcomes", defaultLabel: "Outcomes" },
  { id: "news", icon: faNewspaper, translationKey: "home_page.news", defaultLabel: "News" },
  { id: "third", icon: faGlobe, translationKey: "home_page.mathe_members", defaultLabel: "MathE members" },
  { id: "fourth", icon: faCommentDots, translationKey: "home_page.testimonials", defaultLabel: "Testimonials" },
  { id: "fifth", icon: faPhone, translationKey: "home_page.contact_us", defaultLabel: "Contact us" },
];

function HomePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [activeSection, setActiveSection] = useState("");
  const [uniCountries, setUniCountries] = useState([]);
  const { t } = useTranslation();
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
      const data = await api.get("info/getMapInfo");
      setUniCountries(data.data.countries);
    } catch (error) {
      //Handle Error
    }
  }

  useEffect(() => {
    const scroller = getScrollContainer(document.getElementById(navSections[0].id));

    const updateActiveSection = () => {
      setActiveSection(
        navSections.reduce((inView, { id }) => {
          const element = document.getElementById(id);
          const reached = element && element.getBoundingClientRect().top <= window.innerHeight / 2;
          return reached ? id : inView;
        }, "")
      );
    };

    updateActiveSection();
    scroller.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => scroller.removeEventListener("scroll", updateActiveSection);
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
      <div id="carrosel" style={{ width: "100%" }}>
        <PhotosCarousel />
      </div>
      <div className="navbar">
        {navSections.map(({ id, icon, translationKey, defaultLabel }) => (
          <p
            key={id}
            className={`nav-item ${activeSection === id ? "active" : ""}`}
            onClick={() => scrollToSection(id)}
          >
            <FontAwesomeIcon icon={icon} style={{ marginRight: 5 }} />
            {t(translationKey, defaultLabel)}
          </p>
        ))}
      </div>
      <ScrollSpy>
        <div
          id="first"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo_about})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            mr: "40%",
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
            marginTop: "5%",
            marginBottom: "5%",
          }}
        >
          <Information />
        </div>
        <div
          id="awards"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundoawards})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Awards />
        </div>

        <div
          id="publications"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo7})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Publications />
          <div
            style={{
              position: "absolute",
              zIndex: 0,
              bottom: 0,
              left: 0,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "40%",
              height: "40%",
            }}
          />
        </div>

        <div
          id="news"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo7})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <News />
        </div>
        <div
          id="third"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo6})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SoftTypography variant="h1" fontWeight="bold" mb="2%" m="2%" sx={{ color: "#2596be" }}>
            {t('home_page.mathe_around_world', 'MathE around the world')}
          </SoftTypography>

          <SoftBox
            sx={{
              height: windowHeight - 200,
              width: "70%",
              margin: "0 auto",
              borderRadius: "1em",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <ChoroplethMap />
          </SoftBox>
          <SoftTypography variant="body1" fontWeight="bold" sx={{ color: "#2596be" }}>
            {t('home_page.mathe_present_in_countries', 'MathE is already present in {{count}} countries.', { count: uniCountries.length })}
          </SoftTypography>
        </div>
        <div
          id="fourth"
          style={{
            minHeight: windowHeight,
            backgroundImage: `url(${fundo8})`,
            width: "100%",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Testimonial />
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

export default HomePage;
