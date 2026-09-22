/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from "api";
import YearInput from "../YearInput";
import MonthInput from "../MonthInput";
import { useTranslation } from "react-i18next";

function SearchBar({ onFilter }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const api = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");
      setAllTopics(data.data.elements);
      fetchSubtopics(data.data.elements[0]);
      onFilter(
        data.data.elements[0].id,
        null,
        year == null ? null : year,
        month == null ? null : month
      );
    } catch (error) {
      // Handle error
    }
  }

  async function fetchSubtopics(topic) {
    try {
      const data = await api.get("subtopic/getByTopic/" + topic.id);
      setAllSubtopics(data.data.elements);
      setTopic(topic);
      onFilter(topic.id, null, year == "" ? null : year, month == "" ? null : month);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics([]);
    setSubtopic(null);
    fetchSubtopics(topic);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    onFilter(topic.id, subtopic, year == "" ? null : year, month == "" ? null : month);
  };

  const handleChangeYear = (y) => {
    setYear(y);
    setMonth("");
    onFilter(topic.id, subtopic, y, null);
  };

  const handleChangeMonth = (m) => {
    setMonth(m);
    onFilter(topic.id, subtopic, year == "" ? null : year, m);
  };

  return (
    <SoftBox
      display="flex"
      mb={2}
      mr={1}
      flexDirection="column"
      alignItems="flex-start"
      fullWidth
    //   border={2}
    //   borderColor="#02c6f3"
    //   borderRadius="lg"
    >
      <SoftBox
        width="100%"
        display="flex"
        flexDirection="row"
        sx={{
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        }}
      >
        <SoftBox
          width="50%"
          display="flex"
          flexDirection="column"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              mb: 2,
            },
          }}
        >
          <SoftTypography color="info" fontWeight="bold">
            {t("performance_page.topic", "Topic")}
          </SoftTypography>
          <SoftAutocomplete
            onNewValueSelected={handleChangeTopic}
            options={allTopics}
            selected={topic}
          />
        </SoftBox>
        <SoftBox
          width="50%"
          ml={1}
          display="flex"
          flexDirection="column"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              ml: 0,
            },
          }}
        >
          <SoftTypography color="info" fontWeight="bold">
            {t("performance_page.subtopic", "Subtopic")}
          </SoftTypography>
          <SoftAutocomplete
            onNewValueSelected={handleChangeSubtopic}
            options={allSubtopics}
            selected={subtopic}
          />
        </SoftBox>
      </SoftBox>
      <SoftBox
        width="50%"
        display="flex"
        flexDirection="row"
        sx={{
          "@media (max-width: 600px)": {
            flexDirection: "column",
            width: "100%",
          },
        }}
      >
        <YearInput
          defaultValue={year}
          onInputChange={(value) => handleChangeYear(value)}
        ></YearInput>
        <MonthInput
          defaultValue={month}
          disabled={year == "" ? true : false}
          onInputChange={(value) => handleChangeMonth(value)}
        ></MonthInput>
      </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
