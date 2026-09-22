import React from 'react';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFileArrowDown} from '@fortawesome/free-solid-svg-icons'
import IconButton from '@mui/material/IconButton';
import PropTypes from "prop-types";
import { useApi } from 'api';

const FileDownloadButton = ({id,fileExtension, name}) => {
  const api = useApi();

  async function handleDownload() {
    try {
        const response = await api.post("material/downloadFile", { id, file_ext: fileExtension }, {
          responseType: 'blob', // important
        });
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}`); // replace with your file name
        document.body.appendChild(link);
        link.click();

      // const pdfBlob = new Blob([response.data], { type: 'application/pdf' }); // Create a Blob object directly from the response data
      // const url = URL.createObjectURL(pdfBlob);
      
      // const anchor = document.createElement('a');
      // anchor.href = url;
      // anchor.download = id + '.' + fileExtension;

      // document.body.appendChild(anchor);
      // anchor.click();
      // document.body.removeChild(anchor);

     
      await api.get("material/incrementClicks/" + id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error
    }
  }

  return (
    <IconButton size="small" color="dark" onClick={handleDownload}>
        <FontAwesomeIcon icon={faFileArrowDown} size="3x" />
    </IconButton>
  );
};

FileDownloadButton.defaultProps = {
    noGutter: false,
  };
  

FileDownloadButton.propTypes = {
    fileExtension: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  };

export default FileDownloadButton;