// Soft UI Dashboard React components
import { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";

import Material from "../Material";
import { useMaterialContext } from "layouts/library/Provider";
import SoftTypography from "components/SoftTypography";
import FileDownloadButton from "services/downloadFile";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function MaterialCollection() {  
  const { materialResults } = useMaterialContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [page, setPage] = useState(1);
  const materialsPerPage = 3;
  const indexOfLastMaterial = page * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterial = materialResults.slice(indexOfFirstMaterial, indexOfLastMaterial);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const flexDirection = windowWidth <= 1011 ? 'column' : 'row';
  const margin = windowWidth <= 1011 ? '0px' : '8px';
  const marginBottom = windowWidth <= 1011 ? '20px' : '0px';

  const handlePagination = (event, value) => {
    setPage(value);
  };

return(
  <SoftBox>
    <CardGroup style={{ display: 'flex', flexDirection: flexDirection, flexWrap: 'wrap' }} >
        {
          currentMaterial.map((key, index) => {
            var subtopic = null;
            if (key.platform__subtopic != null) subtopic = key.platform__subtopic.name;
            return (
            <Card key={index} border="light" bg="light" style={{ margin: margin, marginBottom: marginBottom, borderRadius: '4%'}}>
            <Card.Body >
            <SoftBox sx={{display: 'flex', justifyContent:"center", mb:3}}>
              <FileDownloadButton id={key.id} fileExtension={key.file_ext} name={key.file_name}/>
            </SoftBox>
                  <SoftBox
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  >  
                <SoftBox>
                <SoftTypography variant="button" fontWeight="bold" color="info">
                  {key.title}
                </SoftTypography>
                </SoftBox>
                <SoftBox mb={3}>
                <SoftTypography variant="caption" color="info" fontWeight="medium">
                  {key.author}
                </SoftTypography>
              </SoftBox>
              <div style={{ marginBottom: '1rem' }}>
              <SoftTypography variant="h6" fontWeight="regular" sx={{ wordBreak: 'break-word' }} >
                <Latex>{key.description}</Latex>
              </SoftTypography>
            </div>
          
              </SoftBox>
            </Card.Body>
            </Card>
            );
          })
        }
        </CardGroup>
        <Stack mt={2} spacing={3}  alignItems="center">
         <Pagination color="info" count={Math.ceil(materialResults.length / materialsPerPage)} page={page} onChange={handlePagination} />
       </Stack>
      </SoftBox>
)
}

export default MaterialCollection;
