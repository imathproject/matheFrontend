// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import Material from "./components/Material";
import SearchBar from "./components/SearchBar";
import SoftTypography from "components/SoftTypography";
import { useApi } from 'api';

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftButton from "components/SoftButton";
import Modal from '@mui/material/Modal';
import AddMaterial from "./components/AddMaterial";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Scrollbar } from 'react-scrollbars-custom';



//Fontawesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX} from '@fortawesome/free-solid-svg-icons'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "80%",
    bgcolor: '#FFFFFF',
    boxShadow: 24,
    p: 4,
    borderRadius: 6
  };

function Main() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [topic, setTopic] = useState(null);
    const [subtopic, setSubtopic] = useState(null);
    const [validation, setValidation] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [page, setPage] = useState(1);
    const materialsPerPage = 3;
    const indexOfLastMaterial = page * materialsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
    const currentMaterial = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const api = useApi();
    const postData ={
      topic: null,
      subtopic: null,
      validate: null,
      type: [3],
      keywords: null
    }
  
  useEffect(() => {
    getMaterials(postData)
  }, []);

  async function getMaterials(postData) {
    try {
    const data = await api.post("material/getCollection", postData); 
    setMaterials(data.data.elements);
    } catch (error) {
    // Handle error
    }
}

  const handlePagination = (event, value) => {
    setPage(value);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  };


  async function filterMaterials(filterData) {
    try {
      const data = await api.post("material/getCollection", filterData); 
      setMaterials(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  function handleDeleteMaterial(id) {
    const updatedMaterial = [...materials];
    const index = materials.findIndex(material => material.id === id);
    updatedMaterial.splice(index, 1);
    setMaterials(updatedMaterial);
  }

  function handleSaveMaterial() {
    setOpen(false);
    var data ={
      topic: topic,
      subtopic: subtopic,
      validate: validation,
      type: [3],
      keywords: null
    }

    if(topic == null){
      data = {
        topic: null,
        subtopic: null,
        validate: null,
        type: [3],
        keywords: null
      };
    }

    filterMaterials(data);
  }

  const handleFilter = (topic, subtopic, validation) => {
    setTopic(topic);
    setSubtopic(subtopic);
    setValidation(validation);
    setPage(1);

    const data ={
      topic: topic,
      subtopic: subtopic,
      validate: validation,
      type: [3],
      keywords: null
    }

    filterMaterials(data);
  };

  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
         <SoftBox sx={{ display: "flex", justifyContent: "flex-end", p: 2}}>
            <SoftButton variant="gradient" color="info" size="medium" onClick={handleOpen}>
                Add Material&nbsp;
                <FontAwesomeIcon icon={faPlus} size="lg" />
            </SoftButton>
        </SoftBox>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <SoftBox sx={{ ...style}}>
            <SoftBox sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom: 1, borderColor: "#3447767", mb: 4}}>
                    <SoftTypography variant="title" fontWeight="bold" >
                    Material
                    </SoftTypography>
                    <SoftButton variant="text" color="dark" onClick={handleClose}>
                      <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
                      <FontAwesomeIcon icon={faX} size="4x"/>
                    </SoftButton>
                </SoftBox>
                <Scrollbar noScrollX style={{ height: "80%" }}>
                <AddMaterial onSave={handleSaveMaterial}/>
                </Scrollbar>
            </SoftBox>
        </Modal>

      <Grid alignItems="center" p={5}   sx={{
          '@media (max-width: 600px)': {
            p: 2,
          },}}>
        <SearchBar onFilter={handleFilter} />
        {materials.length === 0 ? (
          <SoftBox align="center" m={2} p={5}>
            <SoftTypography textGradient fontWeight="bold" color="info">No data recorded</SoftTypography>
          </SoftBox>
        ) : (
          currentMaterial.map((key, index) => {
            // var subtopic = null;
            // if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (
              <Material
              key={index}
              materialId= {key.id}
              description={key.description}
              title={key.title}
              author= {key.author}
              status={key.validate}
              file_ext={key.file_ext}
              onEdit={handleSaveMaterial}
              onDelete={handleDeleteMaterial}
              name={key.file_name}
            />
            );
          })
        )}
      </Grid>
      {materials.length != 0 ? (
      <Stack mt={2} spacing={3}  mb={2} alignItems="center">
         <Pagination color="info" count={Math.ceil(materials.length / materialsPerPage)} page={page} onChange={handlePagination} />
       </Stack>) : null}
    </Card>
  );
}

export default Main;
