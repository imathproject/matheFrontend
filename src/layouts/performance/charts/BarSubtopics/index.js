import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import SearchBar from "layouts/performance/components/SearchBar";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function BarSubtopics() {
  const [data, setData] = useState(null); // Initially set to null
  const [chartWidth, setChartWidth] = useState(1100);
  const [isLoading, setIsLoading] = useState(false); // Loader state
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
    setIsLoading(true); // Show loader while data is being fetched
    const postData = {
      topic: topic,
    };
    try {
      const response = await api.post("questionAssessment/subtopicPerformance", postData);
      setData(response.data.elements);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false); // Hide loader once data is fetched
    }
  }

  const handleTopic = (topic) => {
    fetchData(topic.id);
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
          text: t("performance_page.percentage_correct", "Percentage of correct answers"),
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
      <SearchBar onFilter={handleTopic} />

      {isLoading ? (
        <p>{t("performance_page.loading", "Loading...")}</p> // Show loading message
      ) : !data ? (
        <p>{t("performance_page.select_topic", "Please select a topic")}</p> // Show this message if no data is available
      ) : (
        <div style={{ width: `${chartWidth}px` }}>
          <Bar options={options} data={data} />
        </div>
      )}
    </div>
  );
}

export default BarSubtopics;
