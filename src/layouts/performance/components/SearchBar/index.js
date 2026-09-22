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
  const { t } = useTranslation();
  const [topic, setTopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const api = useApi();

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const data = await api.get("topic/getAll");

          setAllTopics(data.data.elements);
          setTopic(data.data.elements[0])
          onFilter(data.data.elements[0]);
        } catch (error) {
          // Handle error
        }
      }

  const handleChangeTopic = (topic) => {
    const id = topic.id
    setTopic(topic);
    onFilter(topic);
  };



  return (
    <SoftBox
      mt={2}
      display="flex"
      mb={5}
      flexDirection="row"
      sx={{
        '@media (max-width: 940px)': {
          width: "100%",
          flexDirection: "column",
          mb: 2 // Change flexDirection to column for screens with width up to 600px
        },
      }}
    //   border={2}
    //   borderColor="#02c6f3"
    //   borderRadius="lg"
    >
      <SoftBox width="20%"
        sx={{
          '@media (max-width: 940px)': {
            width: "100%",
          },
        }}>
        <SoftTypography color="info" fontWeight="bold">{t("performance_page.select_topic", "Select a topic:")}</SoftTypography>
      </SoftBox>
      <SoftBox width="100%">
        <SoftAutocomplete onNewValueSelected={handleChangeTopic} options={allTopics} selected={topic} />
      </SoftBox>


    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};


export default SearchBar;