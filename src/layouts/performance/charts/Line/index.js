import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useApi } from "api";
import SearchBar from "./SearchBar";
import SoftTypography from "components/SoftTypography";
import { useTranslation } from "react-i18next";
function LineChart() {
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

  async function fetchData(postData) {
    try {
      const response = await api.post("questionAssessment/getPerformanceOverTime", postData);
      setData(response.data.elements);
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
          text: t("performance_page.timeline", "Timeline"),
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: t("performance_page.percentage_of_correct_answers", "Percentage of correct answers"),
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const handleChange = (topic, subtopic, year, month) => {
    const s = subtopic == null ? null : subtopic.id;
    const postData = {
      topic: topic,
      subtopic: s,
      year: year,
      month: month == null ? null : month + 1,
    };

    fetchData(postData);
  };

  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
      <SearchBar onFilter={handleChange} />

      {loading ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
          <p>{t("performance_page.loading", "Loading...")}</p>
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
              <SoftTypography color="info" textGradient fontWeight="bold">
                {t("performance_page.no_data", "No data recorded")}
              </SoftTypography>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LineChart;
