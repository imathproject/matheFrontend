import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from "api";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import UseNumberInput from "../InputNumber";

function SearchBar({ onFilter }) {
  const [option, setOption] = useState(null);
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [year, setYear] = useState("");
  const [value, setValue] = useState([1, 2, 3, 4]);
  const api = useApi();
  const [allOptions, setAllOptions] = useState([
    { id: 1, label: "Keywords Information" },
    { id: 2, label: "Materials Information" },
    { id: 3, label: "Questions Information" },
    { id: 4, label: "Student Performance" },
    { id: 5, label: "User Information" },
    { id: 6, label: "Videos Information" },
    { id: 7, label: "Validation Information" },
  ]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleChangeValidation = (val) => {
    setValue(val);
    handleOnFilterClick(topic, subtopic, option, val, year);
  };

  const handleChangeYear = (val) => {
    setYear(val);
    handleOnFilterClick(topic, subtopic, option, value, val);
  };

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");
      setAllTopics(data.data.elements);
    } catch (error) {
    }
  }

  async function fetchSubtopics(topic) {
    try {
      const data = await api.get("subtopic/getByTopic/" + topic);
      setAllSubtopics(data.data.elements);
    } catch (error) {
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics([]);
    setSubtopic(null);
    setTopic(topic);
    fetchSubtopics(topic.id);
    handleOnFilterClick(topic, null, option, value, year);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    handleOnFilterClick(topic, subtopic, option, value, year);
  };

  const handleChangeOption = (option) => {
    setOption(option);
    setTopic(null);
    setSubtopic(null);
    setValue([1, 2, 3, 4]);
    setYear("");
    handleOnFilterClick(null, null, option, value, year);
  };

  const handleOnFilterClick = (topic, subtopic, option, value, year) => {
    const t = topic ? topic.id : null;
    const s = subtopic ? subtopic.id : null;
    const o = option ? option.id : null;
    onFilter(t, s, o, value, year);
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
          width="100%"
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
            Visualization options
          </SoftTypography>
          <SoftAutocomplete
            onNewValueSelected={handleChangeOption}
            options={allOptions}
            selected={option}
          />
        </SoftBox>
      </SoftBox>
      {option != null &&
        (option.id !== 5 ? (
          <SoftBox
            width="100%"
            display="flex"
            mt={2}
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
        ) : null)}
      {option != null &&
        (option.id == 4 ? (
          <UseNumberInput
            defaultValue={year}
            onInputChange={(value) => {
              handleChangeYear(value);
            }}
          />
        ) : null)}
      {option != null &&
        (option.id == 4 || option.id == 5 ? (
          <SoftBox width="100%" mt={2} display="flex" alignItems="center" justifyContent="center">
            <ToggleButtonGroup
              type="checkbox"
              value={value}
              onChange={handleChangeValidation}
              size="sm"
            >
              <ToggleButton
                id="tbg-btn-1"
                value={1}
                style={
                  !value.includes(1)
                    ? { opacity: 0.4, background: "#E00E79" }
                    : { background: "#E00E79", border: "#E00E79" }
                }
              >
                Student
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-2"
                value={2}
                style={
                  !value.includes(2)
                    ? { opacity: 0.4, background: "#0E73C0" }
                    : { background: "#0E73C0", border: "#0E73C0" }
                }
              >
                Lecturer
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-3"
                value={3}
                style={
                  !value.includes(3)
                    ? { opacity: 0.4, background: "#FAA538" }
                    : { background: "#FAA538", border: "#FAA538" }
                }
              >
                Reviewer
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-4"
                value={4}
                style={
                  !value.includes(4)
                    ? { opacity: 0.4, background: "#56a36b" }
                    : { background: "#56a36b", border: "#56a36b" }
                }
              >
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </SoftBox>
        ) : null)}
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default SearchBar;
