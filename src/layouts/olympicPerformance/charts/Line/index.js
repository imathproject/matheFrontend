import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useAuth } from "authContext";
import { useApi } from "api";
import SearchBar from "./SearchBar";
import SoftTypography from "components/SoftTypography";
import colors from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

function LineChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(800);
  const api = useApi();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    const newWidth = window.innerWidth <= 700 ? 800 : 1100;
    setChartWidth(newWidth);
  }

  async function fetchData(url) {
    try {
      const response = await api.get(url);
      const fetchedData = response.data.elements;
      if (fetchedData && fetchedData.datasets) {
        fetchedData.datasets = fetchedData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: colors.lightBrown,
          borderColor: colors.lightBrown,
          // Months without answers are null; keep the line going across them.
          spanGaps: true,
        }));
      }
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  }

  // The API sends each month as "YYYY-MM"; show it in the page language
  // ("Apr 2026", "abr. de 2026").
  const chartData = useMemo(() => {
    if (!data?.labels) return data;
    const monthFormat = new Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" });
    return {
      ...data,
      labels: data.labels.map((label) => {
        const match = /^(\d{4})-(\d{2})$/.exec(label);
        return match ? monthFormat.format(new Date(Number(match[1]), Number(match[2]) - 1, 1)) : label;
      }),
    };
  }, [data, i18n.language]);

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t("olympiads_performance_page.answer_month", "Month answered"),
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: t("olympiads_performance_page.percentage_of_correct_answers", "Percentage of correct answers"),
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const handleChange = (olympics, level, year, phase) => {
    let url = "olympicAssessment/getOlympicPerformance?groupBy=month";
    if (olympics) url += `&olympicId=${olympics.id}`;
    if (level) url += `&levelId=${level.id}`;
    if (year) url += `&yearId=${year.id}`;
    if (phase) url += `&phaseId=${phase.id}`;

    fetchData(url);
  };

  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
      <SearchBar onFilter={handleChange} autoSelectFirstOlympic />

      {loading ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
          <p>{t("olympiads_performance_page.loading", "Loading...")}</p>
        </div>
      ) : (
        <>
          <div
            style={{
              width: `${chartWidth}px`,
              height: "600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {data?.labels?.length > 0 ? (
              <Line options={options} data={chartData} />
            ) : (
              <SoftTypography style={{ color: colors.lightBrown }} textGradient fontWeight="bold">
                {t("olympiads_performance_page.no_data", "No data recorded")}
              </SoftTypography>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LineChart;
