import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types"; // Import PropTypes
import { useApi } from 'api';
import SoftButton from "components/SoftButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

function SearchBar({ onFilter, onStart }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null)
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const [showKeys, setShowKeys] = useState();
  const api = useApi();
  const { t } = useTranslation();

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
          const data = await api.get("subtopic/getByTopic/"+topic.id);
          const subtopics= data.data.elements; 
          setAllSubtopics(data.data.elements);
          setTopic(topic);
          onFilter(topic.id, null);
          if(subtopics.length == 0) setShowKeys(true);
        } catch (error) {
          // Handle error
        }
      }
      
      const handleChangeTopic = (topic) => {
        const id = topic.id
        setAllSubtopics([]);
        setSubtopic(null)
        fetchSubtopics(topic)
  
      };
      
      const handleChangeSubtopic = (subtopic) => {
        const id = subtopic.id
        setSubtopic(subtopic)
        onFilter(topic.id, subtopic.id);
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
      <SoftBox width="100%" display="flex" flexDirection="row" sx={{
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
          <SoftTypography color="info" fontWeight="bold">{t("he_assessment_page.topic", "Topic")}</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeTopic} options={allTopics} selected={topic} />
        </SoftBox>

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
          {allSubtopics.length > 0 ?
            <>
              <SoftTypography color="info" fontWeight="bold">{t("he_assessment_page.subtopic", "Subtopic")}</SoftTypography>
              <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic} />
            </> : null}
          <SoftBox mt={4} mb={1} display="flex" flexDirection="row" alignItems="flex-end" marginLeft="auto" >
            <SoftButton variant="gradient" color="info" onClick={onStart} disabled={!((showKeys || subtopic) && topic)}>
              {t("he_assessment_page.start_assessment", "Start assessment")}
              <FontAwesomeIcon icon={faAngleRight} size="2x" />
            </SoftButton>
          </SoftBox>
        </SoftBox>

      </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};


export default SearchBar;