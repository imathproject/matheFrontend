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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

//Pages
import VideoCollection from "../VideoCollection";
import MaterialCollection from "../MaterialCollection";
import SearchBar from "../SearchBar";
import TabsComponent from "../TabsComponent";
import { useMaterialContext } from "layouts/library/Provider";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import CircularProgress from "@mui/material/CircularProgress";
import { useApi } from 'api';
import { useTranslation } from "react-i18next";
function Main() {
  const { videoResults, setVideoResults, materialResults, setMaterialResults } = useMaterialContext();
  const [filterApplied, setFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const { t } = useTranslation();
  async function filterMaterials(filterData) {
    try {
      setLoading(true)
      const data = await api.post("material/getLibrary", filterData); 
      setMaterialResults(data.data.elements);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function filterVideos(filterData) {
    try {
      const data = await api.post("material/getLibrary", filterData); 
      setVideoResults(data.data.elements);
    } catch (error) {
    }
  }

  const handleFilter = (topic, subtopic, keywords) => {
    setVideoResults(null);
    setMaterialResults(null);
    
    const materialsData ={
      topic: topic,
      subtopic: subtopic,
      type: 3,
      keywords: keywords
    }

    const videosData ={
        topic: topic,
        subtopic: subtopic,
        type: 1,
        keywords: keywords
    }

    filterVideos(videosData);
    filterMaterials(materialsData);


    setFilterApplied(true);
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Grid alignItems="center" p={5}>
        <SearchBar onFilter={handleFilter} />
        {filterApplied && (
          <>
            {loading ? ( // Show loader while loading
              <SoftBox display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </SoftBox>
            ) : (
              <>
                {materialResults && videoResults ? (
                  <TabsComponent />
                ) : (
                  <>
                    {materialResults && <MaterialCollection />}
                    {videoResults && <VideoCollection />}
                    {materialResults == null && videoResults == null ? (
                      <SoftBox display="flex" alignItems="center" justifyContent="center">
                        <SoftTypography color="error"> {t("library_page.no_materials_found", "No materials found")} </SoftTypography>
                      </SoftBox>
                    ) : null}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Grid>
    </Card>
  );
}

export default Main;
