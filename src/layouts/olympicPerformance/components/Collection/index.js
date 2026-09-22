import { Card, CardContent, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";

import BarChart from "layouts/olympicPerformance/charts/Bar"; //ok
import BarSubtopics from "layouts/olympicPerformance/charts/BarSubtopics"; //ok

import LineChart from "layouts/olympicPerformance/charts/Line"; //
import LineChart2 from "layouts/olympicPerformance/charts/Line2"; //

import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChartGantt,
} from "@fortawesome/free-solid-svg-icons";
import SoftTypography from "components/SoftTypography";
import colors from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

const INACTIVE_TAB_COLOR = "#adb5bd";

function Collection() {
  // The two Performance Evolution views plot the same metric grouped
  // differently: "byMonth" is groupBy=month (the month each answer was
  // given), "byPhase" is groupBy=phase.
  const [evolutionTab, setEvolutionTab] = useState("byMonth");
  const { t } = useTranslation();
  const evolutionTabColor = (key) =>
    evolutionTab === key ? colors.lightBrown : INACTIVE_TAB_COLOR;
  const evolutionTabTitle = (key, icon, label) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        color: evolutionTabColor(key),
        fontWeight: evolutionTab === key ? "bold" : "normal",
      }}
    >
      <FontAwesomeIcon color={evolutionTabColor(key)} icon={icon} size="lg" />
      {label}
    </span>
  );
  return (
    <SoftBox>
      <style>
        {`
          .nav-tabs {
            border-bottom: none !important;
          }
          .nav-tabs .nav-item,
          .nav-tabs .nav-link,
          .nav-tabs .nav-link * {
            box-shadow: none !important;
            text-decoration: none !important;
            outline: none !important;
            background-image: none !important;
          }
          .nav-tabs .nav-link {
            border: none !important;
            border-bottom: 2px solid transparent !important;
            background-color: transparent !important;
          }
          .nav-tabs .nav-link:hover,
          .nav-tabs .nav-link.active,
          .nav-tabs .nav-link:focus {
            border-bottom: 2px solid ${colors.lightBrown} !important;
          }
          .nav-tabs .nav-link::before,
          .nav-tabs .nav-link::after,
          .nav-tabs .nav-item::before,
          .nav-tabs .nav-item::after {
            display: none !important;
          }
        `}
      </style>
      <Card sx={{ mt: 2 }}>
        <Card
          sx={{
            backgroundColor: "#F9E0D6",
            mb: 2,
            display: "flex",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography sx={{ color: colors.brown, fontWeight: "bold" }}>{t("olympiads_performance_page.performance_per_olympiad", "Performance per Olympiad")}</SoftTypography>
        </Card>

        <CardContent>
          <Grid container justifyContent="center">
            <BarChart />
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <SoftBox
          sx={{
            backgroundColor: "#F9E0D6",
            overflow: "hidden",
            mb: 2,
            display: "flex",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography sx={{ color: colors.brown, fontWeight: "bold" }}>
            {t("olympiads_performance_page.performance_per_year", "Performance per Year")}
          </SoftTypography>
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

            backgroundColor: "#F9E0D6",
            mb: 2,
            display: "flex",
            width: "100%",
            height: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SoftTypography sx={{ color: colors.brown, fontWeight: "bold" }}>
            {t("olympiads_performance_page.performance_evolution", "Performance Evolution")}
          </SoftTypography>
        </SoftBox>

        <CardContent>
          <SoftBox px={2} mb={1}>
            <SoftTypography variant="caption" sx={{ color: colors.brown }}>
              {t(
                "olympiads_performance_page.performance_evolution_hint",
                "How your score changed over time. Choose whether each point on the timeline groups your answers by the month you gave them or by olympiad phase."
              )}
            </SoftTypography>
          </SoftBox>
          <Tabs
            activeKey={evolutionTab}
            onSelect={(eventKey) => setEvolutionTab(eventKey || "byMonth")}
            id="olympic-performance-evolution-tabs"
            className="mb-3"
            justify
          >
            <Tab
              eventKey="byMonth"
              title={evolutionTabTitle(
                "byMonth",
                faCalendarDays,
                t("olympiads_performance_page.evolution_by_month", "By month")
              )}
            >
              <Grid container justifyContent="center">
                <LineChart />
              </Grid>
            </Tab>
            <Tab
              eventKey="byPhase"
              title={evolutionTabTitle(
                "byPhase",
                faChartGantt,
                t("olympiads_performance_page.evolution_by_phase", "By phase")
              )}
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
