import { Card, CardContent, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import BarChart from "layouts/performance/charts/Bar";
import DonutChart from "layouts/performance/charts/Donut";
import BarSubtopics from "layouts/performance/charts/BarSubtopics";
import RadarChart from "layouts/performance/charts/Radar";
import LineChart from "layouts/performance/charts/Line";
import LineChart2 from "layouts/performance/charts/Line2";
import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartColumn,
  faChartArea,
  faCalendarDays,
  faChartGantt,
} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import SoftTypography from "components/SoftTypography";
import back6 from "assets/images/background6.jpg";
import { useTranslation } from "react-i18next";

function Collection() {
  const { t } = useTranslation();
  const [barColor, setBarColor] = useState("#0578b7");
  const [radarColor, setRadarColor] = useState("#adb5bd");

  const handleTabKey = (key) => {
    if (key === "bar") {
      setBarColor("#0578b7");
      setRadarColor("#adb5bd");
    } else {
      setBarColor("#adb5bd");
      setRadarColor("#0578b7");
    }
  };
  return (
    <SoftBox>
      <Card sx={{ mt: 2 }}>
        <SoftBox
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${back6})`,
            mb: 2,
            display: "flex",
            backgroundColor: "rgb(5, 120, 183, 0.7)",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography color="white">{t("performance_page.performance_per_topic", "Performance per topic")}</SoftTypography>
        </SoftBox>

        <CardContent>
          <Tabs
            defaultActiveKey="bar"
            onSelect={(eventKey) => handleTabKey(eventKey)}
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab
              eventKey="bar"
              title={
                <Container>
                  <FontAwesomeIcon color={barColor} icon={faChartColumn} size="lg" />
                </Container>
              }
            >
              <Grid container justifyContent="center">
                <BarChart />
              </Grid>
            </Tab>
            <Tab
              eventKey="radar"
              title={
                <Container>
                  <FontAwesomeIcon color={radarColor} icon={faChartArea} size="lg" />
                </Container>
              }
            >
              <Grid container justifyContent="center">
                <RadarChart />
              </Grid>
            </Tab>
          </Tabs>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <SoftBox
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${back6})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
            mb: 2,
            display: "flex",
            backgroundColor: "rgb(5, 120, 183, 0.7)",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography color="white">{t("performance_page.performance_per_subtopic", "Performance per subtopic")}</SoftTypography>
        </SoftBox>

        <CardContent>
          <Grid container justifyContent="center">
            <BarSubtopics />
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <SoftBox
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${back6})`,
            mb: 2,
            display: "flex",
            backgroundColor: "rgb(5, 120, 183, 0.7)",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography color="white">{t("performance_page.performance_per_level", "Performance per level")}</SoftTypography>
        </SoftBox>

        <CardContent>
          <Grid container justifyContent="center">
            <DonutChart />
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <SoftBox
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${back6})`,
            mb: 2,
            display: "flex",
            backgroundColor: "rgb(5, 120, 183, 0.7)",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography color="white">{t("performance_page.performance_per_timeline", "Performance per timeline")}</SoftTypography>
        </SoftBox>

        <CardContent>
          <Tabs
            defaultActiveKey="bar"
            onSelect={(eventKey) => handleTabKey(eventKey)}
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab
              eventKey="bar"
              title={
                <Container>
                  <FontAwesomeIcon color={barColor} icon={faCalendarDays} size="lg" />
                </Container>
              }
            >
              <Grid container justifyContent="center">
                <LineChart />
              </Grid>
            </Tab>
            <Tab
              eventKey="radar"
              title={
                <Container>
                  <FontAwesomeIcon color={radarColor} icon={faChartGantt} size="lg" />
                </Container>
              }
            >
              <Grid container justifyContent="center">
                <LineChart2 />
              </Grid>
            </Tab>
          </Tabs>
        </CardContent>
      </Card>
    </SoftBox>
  );
}

export default Collection;
