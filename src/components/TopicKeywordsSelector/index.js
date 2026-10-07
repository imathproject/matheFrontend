import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState, useEffect} from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useApi } from 'api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// Topic / subtopic / keywords block shared by the "add" forms (materials, videos, questions).
// The form fields are passed as children and rendered between the topic row and the keywords.
function TopicKeywordsSelector({contentName, onFilter, onSuggestKeywords, topicError, keywordsError, children}) {
    const [topic, setTopic] = useState(null);
    const [subtopic,setSubtopic] =useState(null)
    const [allTopics, setAllTopics] = useState([]);
    const [allSubtopics, setAllSubtopics] = useState([]);
    const [checkedKey, setCheckedKey] = useState([]);
    const [keywords, setKeywords] = useState(null);
    const [showKeys, setShowKeys] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestMessage, setSuggestMessage] = useState(null);
    const [showManual, setShowManual] = useState(false);
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
          setShowKeys(false);
          const data = await api.get("subtopic/getByTopic/"+topic);
          const subtopics= data.data.elements;
          setAllSubtopics(subtopics);
          if(subtopics.length == 0) setShowKeys(true);
        } catch (error) {
          // Handle error
        }
      }

      async function fetchKeywords(topic, subtopic) {
        let url = "keyword/getKeysByTopic/"+topic.id;
        if(subtopic != null) url = "keyword/getKeysBySubtopic/"+subtopic;
        try {
          const data = await api.get(url);
          const keys = data.data.elements;
          const newKeys = keys.map((item) => ({
            ...item,
            checked: true,
          }));
          setKeywords(newKeys);
          setTopic(topic);
          setCheckedKey([]);
          setSuggestMessage(null);
        } catch (error) {
          // Handle error
        }
      };

      const handleChangeTopic = (topic) => {
        setAllSubtopics([]);
        setSubtopic(null)
        handleOnFilter(topic,null,[]);
        fetchSubtopics(topic.id)
        fetchKeywords(topic, null);
      };

      const handleChangeSubtopic = (subtopic) => {
        const id = subtopic.id
        setSubtopic(subtopic)
        handleOnFilter(topic,subtopic,[]);
        fetchKeywords(topic, id);
      };



    const handleChangeKey = (key) => {
        const newChecked = checkedKey.includes(key)
          ? checkedKey.filter((k) => k !== key)
          : [...checkedKey, key];
        setCheckedKey(newChecked);
        setSuggestMessage(null);
        handleOnFilter(topic,subtopic,newChecked);
      };

      const handleSuggestKeywords = async () => {
        setIsSuggesting(true);
        setSuggestMessage(null);
        try {
          const suggested = await onSuggestKeywords(keywords);
          const available = keywords.map((item) => item.id);
          const newChecked = (suggested || []).filter((id) => available.includes(id)).slice(0, 5);
          if (newChecked.length === 0) {
            setSuggestMessage("No keyword suggestions available yet.");
          } else {
            setCheckedKey(newChecked);
            setShowManual(true);
            handleOnFilter(topic,subtopic,newChecked);
          }
        } catch (error) {
          setSuggestMessage("Could not get keyword suggestions.");
        } finally {
          setIsSuggesting(false);
        }
      };

      const handleOnFilter = (topic, subtopic, keywords) => {
        const t = topic ? topic.id : null;
        const s = subtopic ? subtopic.id : null;
        onFilter(t, s, keywords);
      }

  const keysReady = Boolean((showKeys || subtopic) && topic);
  const manualOpen = showManual || keywordsError;

  return (
    <SoftBox
      display="flex"
      mb={4}
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
            width:"100%",
            mb: 2
          },
          }}>
          <SoftTypography color={topicError ? "error" : "info"} fontWeight="bold" marginTop={2}> Topic* </SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeTopic} options={allTopics} selected={topic}/>
      </SoftBox>
      {allSubtopics.length > 0 ?
      <SoftBox
        width="50%"
        ml={1}
        display="flex"
        flexDirection="column"
        sx={{
          '@media (max-width: 600px)': {
            width:"100%",
            ml: 0
          },
          }}>
          <SoftTypography color={ (!showKeys && subtopic == null && keywordsError) ? "error" : "info"} fontWeight="bold" marginTop={2}> Subtopic* </SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic}/>
      </SoftBox> : null}
      </SoftBox>

      <SoftBox width="100%">{children}</SoftBox>

            <SoftTypography color={keywordsError ? "error" : "info"} fontWeight="bold"> Keywords* </SoftTypography>
            <SoftBox width="100%" display="flex" flexDirection="column" p={2}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
              }}>
            <SoftBox width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <SoftTypography color="text" variant="button" fontWeight="regular"> Let us recommend the keywords that best match your {contentName}. </SoftTypography>
              <SoftButton variant="gradient" color="info" size="medium" disabled={!keysReady || isSuggesting} onClick={handleSuggestKeywords}>
                <FontAwesomeIcon icon={faWandMagicSparkles} />&nbsp;&nbsp;
                {isSuggesting ? "Suggesting..." : "Suggest me keywords"}
              </SoftButton>
            </SoftBox>
            {suggestMessage && <SoftTypography color="dark" variant="caption" fontWeight="regular" mt={1}> {suggestMessage} </SoftTypography>}
            { !keysReady && (
              <SoftTypography color={keywordsError ? "error" : "dark"} variant="caption" fontWeight="light" mt={2}> Select a topic{allSubtopics.length > 0 ? " and subtopic" : ""} to see the available keywords </SoftTypography>
            )}
            { keysReady && (
              <SoftBox display="flex" flexDirection="row" alignItems="center" mt={3} sx={{ cursor: "pointer", alignSelf: "flex-start" }}
                onClick={() => setShowManual(!showManual)}>
                <SoftTypography color={keywordsError ? "error" : "dark"} variant="button" fontWeight="regular" mr={1}> Or select from 2 to 5 keywords manually ({checkedKey.length} selected) </SoftTypography>
                <SoftTypography color={keywordsError ? "error" : "dark"} variant="button">
                  <FontAwesomeIcon icon={manualOpen ? faChevronUp : faChevronDown} />
                </SoftTypography>
              </SoftBox>
            )}
            { keysReady && manualOpen && (
                <>
            <Container fluid style={{width:"100%", marginTop:10, marginBottom:5, paddingLeft:0, paddingRight:0}}>
            <Row>
            <Col>
          {/* First Column */}
          <Form>

            {keywords.slice(0, Math.ceil(keywords.length / 2)).map((user) => (
              <Row key={user.id}>
                <Col style={{width: "50%"}}>
                  <Form.Check
                    type="checkbox"
                    checked={checkedKey.includes(user.id)}
                    style={{fontFamily:"Roboto", fontSize: "1rem", fontWeight: 400}}
                    value="child"
                    label={user.label}
                    onChange={(e) => handleChangeKey(user.id)}
                  />
                </Col>
              </Row>
            ))}
          </Form>
        </Col>

        <Col style={{width: "50%"}}>
          {/* Second Column */}
          <Form>
            {keywords.slice(Math.ceil(keywords.length / 2)).map((user) => (
              <Row key={user.id}>
                <Col>
                  <Form.Check
                    type="checkbox"
                    checked={checkedKey.includes(user.id)}
                    style={{fontFamily:"Roboto", fontSize: "1rem", fontWeight: 400}}
                    value="child"
                    label={user.label}
                    onChange={(e) => handleChangeKey(user.id)}
                  />
                </Col>
              </Row>
            ))}
          </Form>
        </Col>
      </Row>
      </Container>
                </>
            )}
            </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
TopicKeywordsSelector.propTypes = {
  contentName: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSuggestKeywords: PropTypes.func.isRequired,
  topicError: PropTypes.bool,
  keywordsError: PropTypes.bool,
  children: PropTypes.node,
};


export default TopicKeywordsSelector;
