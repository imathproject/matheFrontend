import React from "react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const DownloadTeacherAbility = ({ file, name }) => {
  async function handleDownload() {
    try {
      const url = window.URL.createObjectURL(new Blob([file.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error
    }
  }

  return (
    <IconButton size="small" color="dark" onClick={handleDownload}>
      <FontAwesomeIcon icon={faAddressCard} size="2x" />
    </IconButton>
  );
};

DownloadTeacherAbility.defaultProps = {
  noGutter: false,
};

DownloadTeacherAbility.propTypes = {
  file: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DownloadTeacherAbility;
