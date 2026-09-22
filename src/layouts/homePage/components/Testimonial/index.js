import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import styled from "styled-components";
import { useApi } from "api";
import Carousel from "react-bootstrap/Carousel";
import Information from "./information";
import Footer from "./footer";

const Box = styled(SoftBox)`
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  @media (max-width: 1070px) {
    width: 90%;
  }
`;

const Testimonial = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await api.get("/info/getTestimonials");
      setTestimonials(response.data.elements);
    } catch (error) {
      setError("Error fetching testimonials.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <SoftTypography variant="h4">{t('home_page.loading_testimonials', 'Loading testimonials...')}</SoftTypography>;
  }

  if (error) {
    return (
      <SoftTypography variant="h4" color="red">
        {error}
      </SoftTypography>
    );
  }

  return (
    <Box>
      <SoftTypography variant="h1" fontWeight="bold" mt="1%" mb="3%" sx={{ color: "#2596be" }}>
        {t('home_page.testimonials', 'Testimonials')}
      </SoftTypography>
      {testimonials.length > 0 ? (
        <Carousel>
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <Information title={testimonial.title} testimonial={testimonial.testimonial} />
              <Carousel.Caption>
                <Footer
                  name={`${testimonial.user_final.name} ${testimonial.user_final.surname}`}
                  country={testimonial.user_final.country.alpha_2}
                  countryName={testimonial.user_final.country.name}
                  role={testimonial.user_final.role.description}
                />
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <SoftTypography variant="h4">{t('home_page.no_testimonials', 'No testimonials available.')}</SoftTypography>
      )}
    </Box>
  );
};

export default Testimonial;
