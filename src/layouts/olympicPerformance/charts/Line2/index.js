import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useApi } from "api";
import SearchBar from "./SearchBar";
import SoftTypography from "components/SoftTypography";
import colors from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

function LineChart2() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(800);
  const api = useApi();
  const { t } = useTranslation();
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
      let fetchedData = response.data.elements;
      if (fetchedData && fetchedData.datasets) {
        fetchedData.datasets = fetchedData.datasets.map(dataset => ({
          ...dataset,
          borderColor: colors.lightBrown,
          backgroundColor: colors.lightBrown,
          pointBackgroundColor: colors.lightBrown,
          pointBorderColor: colors.lightBrown,
        }));
      }
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  }

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
          text: t("olympiads_performance_page.timeline", "Timeline"),
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
    let url = "olympicAssessment/getOlympicPerformance?groupBy=phase";
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
              <Line options={options} data={data} />
            ) : (
              <SoftTypography style={{ color: colors.lightBrown }} fontWeight="bold">
                {t("olympiads_performance_page.no_data", "No data recorded")}
              </SoftTypography>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LineChart2;
