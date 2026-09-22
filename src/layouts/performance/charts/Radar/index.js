import React, { useState, useEffect } from "react";
import { Bar, Radar } from "react-chartjs-2";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function RadarChart() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const api = useApi();
  const { t } = useTranslation();
  const [chartWidth, setChartWidth] = useState(800); // Initial width

  useEffect(() => {
    fetchData();
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    // Adjust chart width based on window size
    const newWidth = window.innerWidth <= 700 ? 600 : 1000;
    setChartWidth(newWidth);
  }

  async function fetchData() {
    try {
      setIsLoading(true); // Start loading
      const data = await api.get("questionAssessment/topicPerformance");
      setData(data.data.elements);
      setIsLoading(false); // End loading
    } catch (error) {
      // Handle error
      setIsLoading(false); // Stop loading even if there's an error
    }
  }

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              // Access value from 'raw' property
              label += context.raw + "%"; // Use context.raw instead of context.parsed
            }
            return label;
          },
        },
      },
    },
    scales: {
      r: {
        pointLabels: {
          font: {
            size: 13,
          },
        },
        ticks: {
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
      x: {
        display: false,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true,
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
      <div style={{ width: `${chartWidth}px` }}>
        {isLoading ? (
          <div className="loader">{t("performance_page.loading", "Loading...")}</div>
        ) : (
          <Radar options={options} data={data} />
        )}
      </div>
    </div>
  );
}

export default RadarChart;
