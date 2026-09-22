import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import SearchBar from "layouts/olympicPerformance/components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from "api";
import colors from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

function BarSubtopics() {
  const [data, setData] = useState(null); // Initially set to null
  const [chartWidth, setChartWidth] = useState(1100);
  const [isLoading, setIsLoading] = useState(true); // Loader state, the first Olympic is selected by default
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
    const newWidth = window.innerWidth <= 700 ? 500 : 1100;
    setChartWidth(newWidth);
  }

  async function fetchData(topic) {
    setIsLoading(true);
    let url = "olympicAssessment/getOlympicPerformance?groupBy=year";
    if (topic) {
      url += `&olympicId=${topic}`;
    }
    try {
      const response = await api.get(url);
      const fetchedData = response.data.elements;
      if (fetchedData && fetchedData.datasets) {
        fetchedData.datasets = fetchedData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: colors.lightBrown,
          borderWidth: 0,
        }));
      }
      setData(fetchedData);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }

  const handleTopic = (topic) => {
    fetchData(topic ? topic.id : null);
  };

  const options = {
    responsive: true,
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
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: t("olympiads_performance_page.percentage_of_correct_answers", "Percentage of correct answers"),
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
      <SearchBar onFilter={handleTopic} autoSelectFirstOlympic />

      {isLoading ? (
        <div style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>{t("olympiads_performance_page.loading", "Loading...")}</p>
        </div>
      ) : !data ? (
        <div style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>{t("olympiads_performance_page.select_olympiad", "Please select the Olympic")}</p>
        </div>
      ) : !data.labels || data.labels.length === 0 ? (
        <div style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <SoftTypography style={{ color: colors.lightBrown }} textGradient fontWeight="bold">
            {t("olympiads_performance_page.no_data", "No data recorded")}
          </SoftTypography>
        </div>
      ) : (
        <div style={{ width: `${chartWidth}px` }}>
          <Bar options={options} data={data} />
        </div>
      )}
    </div>
  );
}

export default BarSubtopics;
