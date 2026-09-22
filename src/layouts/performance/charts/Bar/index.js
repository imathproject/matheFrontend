import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function BarChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(800);
  const api = useApi();
  const { t } = useTranslation();

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
    const newWidth = window.innerWidth <= 700 ? 800 : 1100;
    setChartWidth(newWidth);
  }

  async function fetchData() {
    try {
      const response = await api.get("questionAssessment/topicPerformance");
      setData(response.data.elements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  }

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
          text: t("performance_page.percentage_correct", "Percentage of correct answers"),
        },
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
      {loading ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
          <p>{t("performance_page.loading", "Loading...")}</p> {/* Simple text loader, can be replaced with a spinner */}
        </div>
      ) : (
        <div style={{ width: `${chartWidth}px` }}>
          <Bar options={options} data={data} />
        </div>
      )}
    </div>
  );
}

export default BarChart;
