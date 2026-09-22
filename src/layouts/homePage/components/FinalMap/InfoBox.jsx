import PropTypes from "prop-types"; // Import PropTypes
import './infobox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';

function numberWithCommas(x) {
  if (x != null) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return '';
  }
}

// TODO link is not clickable, infobox seems to be "transparent"
export function InfoBox({ data, scope }) {
  let infoBox;
  if (data != null) {
    infoBox = <div><h4 style={{color:  "#2596be", fontWeight:"bold"}}>{data.country}</h4>
       <SoftBox>
        <SoftTypography variant="h6" fontWeight="light" sx={{ color: "#000000" }}>
          <FontAwesomeIcon icon={faCircle} color=' #2596be' size="xs" style={{ marginRight: 3, fontSize: '0.55em' }} />
          Institutions: {data.institutions}
        </SoftTypography>
        <SoftTypography variant="h6" fontWeight="light" sx={{ color: "#000000" }}>
          <FontAwesomeIcon icon={faCircle} color=' #2596be' size="xs" style={{ marginRight: 3, fontSize: '0.55em' }} />
          Lecturers: {data.lecturer}
        </SoftTypography>
        <SoftTypography variant="h6" fontWeight="light" sx={{ color: "#000000" }}>
          <FontAwesomeIcon icon={faCircle} color='#2596be' size="xs" style={{ marginRight: 3, fontSize: '0.55em' }} />
          Students: {data.students}
        </SoftTypography>
      </SoftBox>
    </div>;
  } else {
    infoBox = <h4><i>select a country</i></h4>;
  }

  return (
    <div className="info leaflet-top leaflet-right">
      {infoBox}
    </div>
  )
}

InfoBox.propTypes = {
  data: PropTypes.object.isRequired,
  scope: PropTypes.object.isRequired,
};
