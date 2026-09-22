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
import { Button } from "@mui/material";


import Table from "examples/Tables/Table";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Data
import authorsTableData from "./data/authorsTableData";
import Subtopic from "./data/subtopic";
import Topic from "./data/topic";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX} from '@fortawesome/free-solid-svg-icons'
import { Scrollbar } from 'react-scrollbars-custom';
import Modal from '@mui/material/Modal';
import SoftButton from "components/SoftButton";
import Edit from "./data/edit";

//API
import { useApi } from 'api';

function Main() {
  const { columns} = authorsTableData;
  const [rows,setRows] = useState([]);
  const [topic, setTopic] = useState(null);
  const api = useApi();
  const [editValues, setEditValues] = useState({});
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDeleteSubtopic = () => {
    fetchRows();
  };

  async function fetchRows() {
    try {
      const data = await api.get("topic/getSubtopics"); 
      const rows = data.data.elements;
      const transformedRows = rows.map((key, index) => ({
        Topic: <Topic job={key.label} />,
        Questions: key.TopquestionCount,
        Subtopic: (
          <Subtopic
            subtopic={key.platform__subtopics.map((subtopic) => subtopic)}
            // uses={key.platform__subtopics.map((subtopic) => subtopic.id)}
            deleteSub={true}
            onDeleteSubtopic={handleDeleteSubtopic}
            topic={key.id}
            id={key.platform__subtopics.map((subtopic) => subtopic.id)}
          />
        ),
        Manage: (
          <Button
            variant="contained"
            sx={{ color: '#fff', background: '#17C1E8' }}
            fontWeight="medium"
            onClick={() => {
              setEditValues(key);
              handleOpen()
            }}
          >
            Edit
          </Button>
        ),
      }));
      setRows(transformedRows);
    } catch (error) {
      // Handle error
    }
  }

  async function fetchTopic(postData) {
    try {
      const data = await api.post("topic/add", postData); 
      fetchRows();
      setTopic("");
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      // Handle error
    }
  }

  const saveTopic = () =>{
    const postData ={
      name: topic
    }

    fetchTopic(postData)
  }

  const handleEdit = () =>{
    setOpen(false);
    // setRows([]);
    fetchRows();
  }


  return (
    <Card sx={{ minHeight: "80vh", mt: 5, display: "flex", flexDirection: "column" }}>
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <SoftBox sx={{ ...style}}>
           
            <SoftBox m={1} sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom: 1, borderColor: "#3447767", mb: 4}}>
                <SoftTypography  variant="title" fontWeight="bold" >
                Edit topic
                </SoftTypography>
                <SoftButton variant="text" color="dark" onClick={handleClose}>
                    <SoftTypography mr={1} variant="title" fontWeight="bold">Close</SoftTypography>
                    <FontAwesomeIcon icon={faX} size="4x"/>
                </SoftButton>
            </SoftBox>
            <Scrollbar noScrollX style={{ height: "80%" }}>
              <Edit data={editValues} onUpdate={handleEdit}/>
            </Scrollbar>
        </SoftBox>
    </Modal>
    <Grid alignItems="center" p={5}   sx={{
      '@media (max-width: 600px)': {
        p: 2,
    },}}>
    <SoftBox>
        <SoftBox display="flex" flexDirection="row" mb={3} alignItems="flex-start">
          <SoftInput  placeholder="Type new topic..." value={topic} sx={{ mr: 2, width: "70%" }} variant="outlined" onChange={(e) => { setTopic(e.target.value) }} />
          <Button
            variant="contained"  sx={{ width: "20%", color: "#fff", background: "#17C1E8" }}
            fontWeight="medium" onClick={() => saveTopic(3)}>
            Add topic
          </Button>
        </SoftBox>
          <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor} }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
                
              }}
            >
              <Table columns={columns} rows={rows} />
          </SoftBox>
    </SoftBox>
    </Grid>
    </Card>
         
  );
}

export default Main;
