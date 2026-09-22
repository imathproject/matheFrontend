import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect} from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types"; 
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useApi } from 'api';

function SearchBar({onFilter, topicError, keywordsError}) {
    const [topic, setTopic] = useState(null);
    const [subtopic,setSubtopic] =useState(null)
    const [allTopics, setAllTopics] = useState([]);
    const [allSubtopics, setAllSubtopics] = useState([]);
    const [checkedKey, setCheckedKey] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [isParentChecked, setIsParentChecked] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
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
          setIsParentChecked(false);
          setTopic(topic);
          setCheckedKey([]);
        } catch (error) {
          // Handle error
        }
      };

      const handleChangeTopic = (topic) => {
        const id = topic.id
        setAllSubtopics([]);
        setSubtopic(null)
        handleOnFilter(topic,subtopic,[]);
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
        if(checkedKey.includes(key)){
          const index = checkedKey.indexOf(key);
          checkedKey.splice(index, 1);
        }else checkedKey.push(key);
        handleOnFilter(topic,subtopic,checkedKey);
      };
      
      const handleOnFilter = (topic, subtopic, keywords) => {
        const t = topic ? topic.id : null;
        const s = subtopic ? subtopic.id : null;
        onFilter(t, s, keywords);
      }

  return (
    <SoftBox
      display="flex"
      mb={6}
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
          <SoftTypography color={topicError ? "error" : "info"} fontWeight="bold" marginTop={2}> Topic </SoftTypography> 
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
          <SoftTypography color={ (!showKeys && subtopic == null && keywordsError) ? "error" : "info"}  fontWeight="bold" marginTop={2}> Subtopic </SoftTypography> 
          <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic}/>
      </SoftBox> : null}
      </SoftBox>
     
            { (showKeys || subtopic) && (
                <>
                <SoftTypography color={keywordsError ? "error" : "info"} fontWeight="bold" marginTop={2}> Keywords </SoftTypography> 
                <SoftTypography color={keywordsError ? "error" : "dark"} variant="caption" fontWeight="light"> Please select from 2 to 5 keywords </SoftTypography>
            <Container style={{width:"100%", marginBottom:5}}>
            <Row>
            <Col>
          {/* First Column */}
          <Form>

            {keywords.slice(0, Math.ceil(keywords.length / 2)).map((user) => (
              <Row key={user.id}>
                <Col style={{width: "50%"}}>
                  <Form.Check
                    type="checkbox"
                    checked={user.isChecked}
                    value="child"
                    style={{fontFamily:"Roboto", fontSize: "1rem", fontWeight: 400}}
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
                    checked={user.isChecked}
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
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired, 
  topicError: PropTypes.bool,
  keywordsError: PropTypes.bool,
};


export default SearchBar;