import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from "api";

function SearchBar({ onFilter }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [value, setValue] = useState([1, 2, 3, 4]);
  const api = useApi();

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");
      setAllTopics(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchSubtopics(topic) {
    try {
      const data = await api.get("subtopic/getByTopic/" + topic);
      setAllSubtopics(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics([]);
    setTopic(topic);
    setSubtopic(null);
    fetchSubtopics(topic.id);
    handleOnFilter(topic, null);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    handleOnFilter(topic, subtopic);
  };

  const handleOnFilter = (topic, subtopic, value) => {
    const t = topic ? topic.id : null;
    const s = subtopic ? subtopic.id : null;

    onFilter(t, s);
  };

  return (
    <SoftBox display="flex" mb={2} flexDirection="column" alignItems="flex-start">
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
            Topic
          </SoftTypography>
          <SoftAutocomplete
            onNewValueSelected={handleChangeTopic}
            options={allTopics}
            selected={topic}
          />
        </SoftBox>
        {allSubtopics.length > 0 ? (
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
              Subtopic
            </SoftTypography>
            <SoftAutocomplete
              onNewValueSelected={handleChangeSubtopic}
              options={allSubtopics}
              selected={subtopic}
            />
          </SoftBox>
        ) : null}
      </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
