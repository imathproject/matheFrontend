import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import SearchBar from "./SearchBar";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function DonutChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartflex, setChartflex] = useState("row");
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
    // Adjust chart width based on window size
    const newflex = window.innerWidth <= 600 ? "column" : "row";
    setChartflex(newflex);
  }

  async function fetchData(postData) {
    try {
      setLoading(true); // Start loading
      const data = await api.post("questionAssessment/getLevelPerformanceByTopic", postData);
      setData(data.data.elements);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false); // Stop loading after the data fetch is complete
    }
  }

  const handleChange = (topic, subtopic) => {
    const postData = {
      topic: topic,
      subtopic: subtopic,
    };
    fetchData(postData);
  };

  return (
    <div style={{ overflowX: "auto", height: "500px", marginBottom: 10, marginTop: 10 }}>
      <SearchBar onFilter={handleChange} />

      {loading ? (
        // Loader component or spinner
        <SoftBox
          sx={{
            width: "1000px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            className="spinner"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "6px solid lightgray",
              borderTop: "6px solid blue",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </SoftBox>
      ) : data.length === 0 ? (
        <SoftBox sx={{ width: "1000px", display: "flex", justifyContent: "center" }}>
          <SoftTypography textGradient={true} color="info" fontWeight="bold" mt={2}>
            {t("performance_page.no_data", "No data recorded")}
          </SoftTypography>
        </SoftBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: "rgb(5, 120, 183, 0.7)",
                marginRight: 5,
                textAlign: "center",
              }}
            />
            <text style={{ fontSize: 12, marginRight: 5 }}>My performance</text>

            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: "rgb(93, 93, 93, 0.5)",
                marginRight: 5,
                textAlign: "center",
              }}
            />
            <text style={{ fontSize: 12 }}>{t("performance_page.global_performance", "Global performance")}</text>
          </div>
          <div
            className="chart-container"
            style={{ display: "flex", flexDirection: `${chartflex}` }}
          >
            {data.map((key, index) => (
              <div
                key={key.level}
                style={{
                  position: "relative",
                  width: "210px",
                  height: "210px",
                  marginTop: "1%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Doughnut
                  data={key.data}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label = context.dataset.label || "";
                            const dataIndex = context.dataIndex;
                            const datasetIndex = context.datasetIndex;
                            if (dataIndex === 0) {
                              if (label) {
                                label += ": ";
                              }
                              if (context.raw !== null) {
                                label += context.raw + "%";
                              }
                            } else {
                              label = label;
                            }
                            return label;
                          },
                        },
                      },
                      centerText: {
                        text: `Level ${key.level}`,
                        fontSize: 20,
                        font: "Roboto",
                        color: "#0578B7",
                      },
                    },
                  }}
                  plugins={[
                    {
                      id: "centerText",
                      beforeDraw: (chart) => {
                        const { width, height } = chart;
                        const ctx = chart.ctx;
                        const { text, fontSize, color, font } = chart.config.options.plugins.centerText;

                        ctx.save();
                        ctx.font = `bold ${fontSize}px ${font}`;
                        ctx.fillStyle = color;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";

                        const centerX = width / 2;
                        const centerY = height / 2;

                        ctx.fillText(text, centerX, centerY);
                        ctx.restore();
                      },
                    },
                  ]}

                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DonutChart;
