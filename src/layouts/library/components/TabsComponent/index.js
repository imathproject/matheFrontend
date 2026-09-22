/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Fontawesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileInvoice, faCheck, faFolder } from '@fortawesome/free-solid-svg-icons'

//Pages
import VideoCollection from "../VideoCollection";
import MaterialCollection from "../MaterialCollection";
import { useTranslation } from "react-i18next";


function TabsComponent() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }


    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFilter = (topic, subtopic, keywords) => {
    const data = {
      topic: null,
      subtopic: subtopic,
      validate: 1,
      type: [3],
      keywords: keywords
    }

    filterMaterials(data);
  };

  return (
    <SoftBox sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <SoftBox>
          <TabList onChange={handleChange} textColor="white" aria-label="lab API tabs example">
            <Tab label={t("library_page.video_collection", "Video Collection")} value="1" icon={<FontAwesomeIcon icon={faPlus} />} />
            <Tab label={t("library_page.teaching_material", "Teaching Material")} value="2" icon={<FontAwesomeIcon icon={faFileInvoice} />} />
          </TabList>
        </SoftBox>
        <TabPanel value="1"><VideoCollection /></TabPanel>
        <TabPanel value="2"><MaterialCollection /></TabPanel>
      </TabContext>
    </SoftBox>
  );
}

export default TabsComponent;
