import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";
import Information from "./information";
import slideshow1 from "assets/images/slideshow1.jpg";
import olympiads from "assets/images/olympiads.png";
import awards from "assets/images/awards.png";
import slideshow4 from "assets/images/slideshow4.jpg";
const PhotosCarousel = () => {
  const { t } = useTranslation();

  return (
    <Carousel>
      <Carousel.Item>
        <Information
          img={slideshow1}
          title={t("home_page.carousel_welcome_title", "Welcome to MathE")}
          text={t("home_page.carousel_welcome_text", "An innovative e-learning platform that uses artificial intelligence to support mathematical learning, adapting to each student's needs, learning pace, and goals.")}
        />
      </Carousel.Item>
      <Carousel.Item>
        <Information
          img={olympiads}
          title={t("home_page.carousel_olympiads_title", "MathE Olympiads")}
          text={t("home_page.carousel_olympiads_text", "A dedicated learning space designed to support students preparing effectively for competitions and Olympiads.")}
        />
      </Carousel.Item>
      <Carousel.Item>
        <Information
          img={slideshow4}
          title={t("home_page.carousel_system_title", "MathE System")}
          text={t("home_page.carousel_system_text", "Uses an exclusive recommendation algorithm to dynamically adapt the learning experience and meet each individual's unique needs and preferences.")}
        />
      </Carousel.Item>
      <Carousel.Item>
        <Information
          img={awards}
          title=""
          text=""
          bgSize="contain"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default PhotosCarousel;
