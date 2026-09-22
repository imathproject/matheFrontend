import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
//API
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useApi } from "api";
import { useTranslation } from "react-i18next";

function SearchBar({ onFilter }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [checkedKey, setCheckedKey] = useState([]);
  const [keywords, setKeywords] = useState(null);
  const [isParentChecked, setIsParentChecked] = useState(false);
  const api = useApi();
  const { t } = useTranslation();
  useEffect(() => {
    fetchTopics();
  }, []);

  const changeCheckboxStatus = (e, id) => {
    const myKeys = [...keywords];
    const { checked } = e.target;

    if (id === "p1") {
      handleAllKeys(checked, myKeys);
    }

    myKeys.map((user) => {
      if (id === "p1") {
        setIsParentChecked(checked);
        user.isChecked = checked;
      } else {
        if (user.id === id) {
          user.isChecked = checked;
          handleChangeKey(user.id);
        }
        const isAllChildsChecked = myKeys.every((user) => user.isChecked === true);
        if (isAllChildsChecked) {
          setIsParentChecked(checked);
        } else {
          setIsParentChecked(false);
        }
      }
      return user;
    });
    setKeywords([...myKeys]);
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

  async function fetchKeywords(topic, subtopic) {
    let url = "keyword/getKeysByTopic/" + topic.id;
    if (subtopic != null) url = "keyword/getKeysBySubtopic/" + subtopic;

    try {
      const data = await api.get(url);
      const keys = data.data.elements;
      const newKeys = keys.map((item) => ({
        ...item,
        checked: true,
      }));
      setKeywords(newKeys);
      setIsParentChecked(false);
      setTopic(topic);
      setCheckedKey([]);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics([]);
    setSubtopic(null);
    fetchSubtopics(topic.id);
    fetchKeywords(topic, null);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    fetchKeywords(topic, id);
  };

  const handleChangeKey = (key) => {
    if (checkedKey.includes(key)) {
      const index = checkedKey.indexOf(key);
      checkedKey.splice(index, 1);
    } else checkedKey.push(key);
  };

  const handleAllKeys = (checked, keys) => {
    const myKeys = [];
    if (checked === true) {
      keys.map((key) => {
        myKeys.push(key.id);
      });
    }
    setCheckedKey(myKeys);
  };

  const handleOnFilterClick = () => {
    const t = topic ? topic.id : null;
    const s = subtopic ? subtopic.id : null;
    const k = checkedKey.length != 0 ? checkedKey : null;
    onFilter(t, s, k);
  };

  return (
    <SoftBox
      display="flex"
      mb={2}
      mr={1}
      flexDirection="column"
      alignItems="flex-start"
    //   border={2}
    //   borderColor="#02c6f3"
    //   borderRadius="lg"
    >
      <SoftTypography variant="h6" fontWeight="light">

        {t("library_page.to_access", "To access the available video lessons and written materials, please select:")}{" "}
      </SoftTypography>
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
            {t("library_page.topic", "Topic")}
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
              {t("library_page.subtopic", "Subtopic")}
            </SoftTypography>
            <SoftAutocomplete
              onNewValueSelected={handleChangeSubtopic}
              options={allSubtopics}
              selected={subtopic}
            />
          </SoftBox>
        ) : null}
      </SoftBox>
      {topic && (
        <>
          <SoftTypography color="info" fontWeight="bold" marginTop={2}>
            {t("library_page.keywords", "Keywords")}
          </SoftTypography>
          <Container style={{ width: "100%" }}>
            <Row>
              <Form.Check
                type="checkbox"
                value="parent"
                label="Select all"
                onChange={(e) => changeCheckboxStatus(e, "p1")}
                checked={isParentChecked}
                style={{
                  marginBottom: "1%",
                  fontFamily: "Roboto",
                  fontSize: "1rem",
                  fontWeight: 400,
                }}
              />
              <Col>
                {/* First Column */}
                <Form>
                  {keywords.slice(0, Math.ceil(keywords.length / 2)).map((user) => (
                    <Row key={user.id}>
                      <Col style={{ width: "50%" }}>
                        <Form.Check
                          type="checkbox"
                          checked={user.isChecked}
                          value="child"
                          style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                          label={user.label}
                          onChange={(e) => changeCheckboxStatus(e, user.id)}
                        />
                      </Col>
                    </Row>
                  ))}
                </Form>
              </Col>

              <Col style={{ width: "50%" }}>
                {/* Second Column */}
                <Form>
                  {keywords.slice(Math.ceil(keywords.length / 2)).map((user) => (
                    <Row key={user.id}>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          checked={user.isChecked}
                          value="child"
                          style={{ fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 }}
                          label={user.label}
                          onChange={(e) => changeCheckboxStatus(e, user.id)}
                        />
                      </Col>
                    </Row>
                  ))}
                </Form>
              </Col>
            </Row>
          </Container>

          <SoftBox
            mt={4}
            mb={1}
            display="flex"
            flexDirection="row"
            alignItems="flex-end"
            marginLeft="auto"
          >
            <SoftButton
              variant="gradient"
              color="info"
              onClick={() => {
                handleOnFilterClick();
              }}
            >
              {t("library_page.find_resources", "Find Resources")}
            </SoftButton>
          </SoftBox>
        </>
      )}
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
