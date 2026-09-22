import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useApi } from 'api';

function SearchBar({ onFilter, topicError, keywordsError, topicObject, subtopicObject, keywordIds }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [checkedKey, setCheckedKey] = useState([]);
  const [keywords, setKeywords] = useState(null);
  const [showKeys, setShowKeys] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useApi();

  useEffect(() => {
    fetchTopics();
    //handleChangeTopic(topicObject);
    //setTopic(topicObject);
    if (subtopicObject != null) {
      //handleChangeSubtopic(subtopicObject);
      setSubtopic(subtopicObject);
      fetchSubtopics(topicObject.id);
      fetchKeywords(topicObject, subtopicObject.id, keywordIds);
    }else{
      fetchKeywords(topicObject, null, keywordIds);
      fetchSubtopics(topicObject.id);
    }
  }, []);

  const changeCheckboxStatus = (e, id) => {
    const myKeys = [...keywords];
    const { checked } = e.target;

    myKeys.map((user) => {
        if (user.id === id) {
          user.isChecked = checked;
          handleChangeKey(user.id);
        }
        const isAllChildsChecked = myKeys.every(
          (user) => user.isChecked === true
        );
      return user;
    });
    setKeywords([...myKeys]);
};

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
      setShowKeys(false);
      const data = await api.get("subtopic/getByTopic/" + topic);
      const subtopics = data.data.elements;
      setAllSubtopics(subtopics);
      if (subtopics.length == 0) setShowKeys(true);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchKeywords(topic, subtopic, keywordIds) {
    setLoading(true); // Start loading
    const t = topic == null ? topicObject : topic;

    let url = "keyword/getKeysByTopic/" + t.id;
    if (subtopic != null) url = "keyword/getKeysBySubtopic/" + subtopic;
    try {
      const data = await api.get(url);
      const keys = data.data.elements;
      const newKeys = keys.map((item) => ({
        ...item,
        isChecked: keywordIds.includes(item.id),
      }));
      setKeywords(newKeys);
      setTopic(t);
      setCheckedKey(keywordIds);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false); // End loading
    }
  }

  const handleChangeTopic = (topic) => {
    const id = topic.id;
    setAllSubtopics([]);
    setSubtopic(null);
    handleOnFilter(topic, null, []);
    fetchSubtopics(topic.id);
    fetchKeywords(topic, null, []);
  };

  const handleChangeSubtopic = (subtopic) => {
    const id = subtopic.id;
    setSubtopic(subtopic);
    handleOnFilter(topic, subtopic, []);
    fetchKeywords(topic, id, []);
  };

  const handleChangeKey = (key) => {
      if(checkedKey.includes(key)){
        const index = checkedKey.indexOf(key);
        checkedKey.splice(index, 1);
      }else checkedKey.push(key);
      handleOnFilter(topic, subtopic, checkedKey);

  };

  const handleOnFilter = (topic, subtopic, keywords) => {
    onFilter(topic, subtopic, keywords);
  };
  
  return (
    <SoftBox
      display="flex"
      mb={2}
      mr={1}
      flexDirection="column"
      alignItems="flex-start"
    >
      <SoftBox width="100%" display="flex" flexDirection="row" mb={3} sx={{
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
      }}>
        <SoftBox
          width="50%"
          display="flex"
          flexDirection="column"
          sx={{
            '@media (max-width: 600px)': {
              width: "100%",
              mb: 2
            },
          }}>
          <SoftTypography color={topicError ? "error" : "info"} fontWeight="bold" marginTop={2}> Topic </SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeTopic} options={allTopics} selected={topic} />
        </SoftBox>
        {allSubtopics.length > 0 ?
          <SoftBox
            width="50%"
            ml={1}
            display="flex"
            flexDirection="column"
            sx={{
              '@media (max-width: 600px)': {
                width: "100%",
                ml: 0
              },
            }}>
            <SoftTypography color={(!showKeys && subtopic == null && keywordsError) ? "error" : "info"} fontWeight="bold" marginTop={2}> Subtopic </SoftTypography>
            <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic} />
          </SoftBox> : null}
      </SoftBox>

      {loading ? (
        <SoftTypography fontWeight="bold" marginTop={2}>Loading...</SoftTypography>
      ) : (
        ((showKeys || subtopic) && topic) && (
          <>
            <SoftTypography color={keywordsError ? "error" : "info"} fontWeight="bold" marginTop={2}> Keywords </SoftTypography>
            <SoftTypography color={keywordsError ? "error" : "dark"} variant="caption" fontWeight="light"> Please select from 2 to 5 keywords </SoftTypography>
            <Container style={{ width: "100%", marginBottom: 5 }}>
              <Row>
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
          </>
        )
      )}
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
  topicError: PropTypes.bool,
  keywordsError: PropTypes.bool,
  topicObject: PropTypes.object.isRequired,
  subtopicObject: PropTypes.object.isRequired,
  keywordIds: PropTypes.array.isRequired,
};

export default SearchBar;
