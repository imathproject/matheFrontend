import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect} from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import SoftInput from "components/SoftInput";
import { Button, Card, Grid, Stack, Pagination } from "@mui/material";
import { useApi } from 'api';
import SoftButton from "components/SoftButton";

function SearchBar({onFilter, onAdd}) {
    const [topic, setTopic] = useState(null);
    const [subtopic,setSubtopic] =useState(null)
    const [allTopics, setAllTopics] = useState([]);
    const [allSubtopics, setAllSubtopics] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showKeys, setShowKeys] = useState();
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
  
      const handleChangeTopic = (topic) => {
        const id = topic.id
        setAllSubtopics([]);
        setTopic(topic);
        setSubtopic(null)
        fetchSubtopics(topic.id)
        handleOnFilter(topic, null);
      };
      
      const handleChangeSubtopic = (subtopic) => {
       
        const id = subtopic.id
        setSubtopic(subtopic)
        handleOnFilter(topic, subtopic);
      
      };
      
      const handleOnFilter = (topic, subtopic) => {
        const t = topic ? topic.id : null;
        const s = subtopic ? subtopic.id : null;

        onFilter(t,s);
      }

      const saveKeyword = () =>{
        var s = null;
        if(subtopic != null) s = subtopic.id;
        const postData =
        {
            topic: topic.id,
            subtopic: s,
            name: keyword
        }
        addKeyword(postData)
      }

      async function addKeyword(postData) {
        try {
          const data = await api.post("keyword/add", postData); 
          setKeyword("");
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          onAdd();
          // fetchFilterRows(topic, subtopic);
        } catch (error) {
          // Handle error
        }
      }

  return (
    <SoftBox
      display="flex"
      mb={2}
      flexDirection="column"
      alignItems="flex-start"
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
            width:"100%",
            mb: 2 
          },
          }}>
          <SoftTypography color="info" fontWeight="bold">Topic</SoftTypography>
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
          <SoftTypography color="info" fontWeight="bold">Subtopic</SoftTypography>
          <SoftAutocomplete onNewValueSelected={handleChangeSubtopic} options={allSubtopics} selected={subtopic}/>
      </SoftBox>
      : null}
      </SoftBox>
      {  ((showKeys || subtopic) && topic) && (
               
      <Stack direction="row" spacing={2} alignItems="flex-start" mb={3} mt={5} sx={{width:"100%"}}>
           <SoftInput placeholder="Type new keyword..." value={keyword} sx={{ width:"60%",}} onChange={(e) => setKeyword(e.target.value)} />
           <SoftButton variant="contained" color="info" disabled={!keyword.trim()} sx={{ width:"20%", background: "#17C1E8" }} onClick={saveKeyword}>
             Add keyword
           </SoftButton>
      </Stack> )}
         
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired, 
  onAdd: PropTypes.func.isRequired
};


export default SearchBar;