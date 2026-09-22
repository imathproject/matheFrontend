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
import { useApi } from 'api';
import { useTranslation } from "react-i18next";
function SearchBar({ onFilter }) {
  const [topic, setTopic] = useState(null);
  const [subtopic, setSubtopic] = useState(null)
  const [allTopics, setAllTopics] = useState([]);
  const [allSubtopics, setAllSubtopics] = useState([]);
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    fetchTopics();
  }, []);

      async function fetchTopics() {
        try {
          
          const data = await api.get("topic/getAll");
          setAllTopics(data.data.elements);
          fetchSubtopics(data.data.elements[3]);
          onFilter(data.data.elements[3].id, null);
        } catch (error) {
          // Handle error
        }
      }
    
      async function fetchSubtopics(topic) {
        try {
          const data = await api.get("subtopic/getByTopic/"+topic.id);
          setAllSubtopics(data.data.elements);
          setTopic(topic);
          onFilter(topic.id, null);
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
              mb: 2 // Change flexDirection to column for screens with width up to 600px
            },
          }}>
          <SoftTypography color="info" fontWeight="bold">{t("performance_page.topic", "Topic")}</SoftTypography>
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
              ml: 0 // Change flexDirection to column for screens with width up to 600px
            },
          }}>
          <SoftTypography color="info" fontWeight="bold">{t("performance_page.subtopic", "Subtopic")}</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};


export default SearchBar;