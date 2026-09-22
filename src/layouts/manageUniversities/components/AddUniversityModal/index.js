import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import SoftButton from "components/SoftButton";
import { useEffect, useRef, useState } from "react";
import { useApi } from "api";
import SoftInput from "components/SoftInput";
import { Spinner } from "react-bootstrap";
import SoftAutocomplete from "components/AutoComplete";
import { Scrollbar } from "react-scrollbars-custom";

function AddUniversityModal({ open, onDo, onCancel, onClose }) {
  const validationMessageRef = useRef();
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [country, setCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "60%",
    justifyContent: "center",
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    p: 4,
    borderRadius: 6,
  };

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    country: false,
    latitude: false,
    longitude: false,
  });

  const validateForm = () => {
    const errors = {
      name: name.trim() === "",
      country: country === null,
      latitude: lat.trim() === "",
      longitude: long.trim() === "",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };
  useEffect(() => {
    fetchCountries();
  }, []);

  async function fetchCountries() {
    try {
      const data = await api.get("country/getAll");
      setCountryOptions(data.data.elements);
      setLoading(false);
    } catch (error) {
      // Handle error
    }
  }

  async function addUniversity(postData) {
    try {
      const data = await api.post("university/add", postData);
      onDo();
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeCountry = (c) => {
    setCountry(c);
  };

  const handleSave = () => {
    if (validateForm()) {
      const postData = {
        name: name,
        country: country.label,
        latitude: lat,
        longitude: long,
      };

      addUniversity(postData);
    } else {
      setErrorMessage("Please complete all required fields.");
      validationMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <SoftBox sx={{ ...style }}>
        <Scrollbar noScrollX style={{ height: "100%" }}>
          {loading ? (
            <>
              <SoftBox
                sx={{
                  display: "flex",
                  height: "500px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner animation="border" variant="primary" />
              </SoftBox>
            </>
          ) : (
            <SoftBox
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <SoftTypography color="dark" fontWeight="bold">
                  New University
                </SoftTypography>
              </SoftBox>

              {errorMessage && (
                <SoftBox sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                  <SoftTypography variant="h6" color="error" fontWeight="light">
                    {errorMessage}
                  </SoftTypography>
                </SoftBox>
              )}
              <SoftBox width="95%" mr={2}>
                <SoftTypography
                  variant="h6"
                  fontWeight="bold"
                  color={validationErrors.name ? "error" : "info"}
                >
                  University
                </SoftTypography>
                <SoftInput
                  placeholder="Type here..."
                  value={name}
                  sx={{
                    border: validationErrors.name ? "1px solid red" : "1px solid #ced4da",
                    mb: 2,
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                    setValidationErrors({ ...validationErrors, name: false });
                    if (e.target.value == "")
                      setValidationErrors({ ...validationErrors, name: true });
                  }}
                />
              </SoftBox>

              <SoftBox width="95%" mr={2}>
                <SoftTypography
                  variant="h6"
                  color={validationErrors.country ? "error" : "info"}
                  fontWeight="bold"
                >
                  Country
                </SoftTypography>
                <SoftAutocomplete
                  options={countryOptions}
                  selected={country}
                  sx={{
                    border: validationErrors.country ? "1px solid red" : "1px solid #ced4da",
                    mb: 2,
                  }}
                  onNewValueSelected={handleChangeCountry}
                />
              </SoftBox>

              <SoftBox width="95%" mr={2} mt={2}>
                <SoftTypography
                  fontWeight="bold"
                  color={validationErrors.latitude ? "error" : "info"}
                  variant="h6"
                >
                  Latitude
                </SoftTypography>
                <SoftInput
                  placeholder="Type here..."
                  value={lat}
                  sx={{
                    border: validationErrors.latitude ? "1px solid red" : "1px solid #ced4da",
                    mb: 2,
                  }}
                  onChange={(e) => {
                    setLat(e.target.value);
                    setValidationErrors({ ...validationErrors, latitude: false });
                    if (e.target.value == "")
                      setValidationErrors({ ...validationErrors, latitude: true });
                  }}
                />
              </SoftBox>

              <SoftBox width="95%" mr={2}>
                <SoftTypography
                  fontWeight="bold"
                  color={validationErrors.longitude ? "error" : "info"}
                  variant="h6"
                >
                  Longitude
                </SoftTypography>
                <SoftInput
                  placeholder="Type here..."
                  value={long}
                  sx={{
                    border: validationErrors.longitude ? "1px solid red" : "1px solid #ced4da",
                    mb: 2,
                  }}
                  onChange={(e) => {
                    setLong(e.target.value);
                    setValidationErrors({ ...validationErrors, longitude: false });
                    if (e.target.value == "")
                      setValidationErrors({ ...validationErrors, longitude: true });
                  }}
                />
              </SoftBox>

              <SoftBox
                mt={4}
                display="flex"
                flexDirection="row"
                width="100%"
                justifyContent="space-around"
              >
                <SoftButton
                  variant="gradient"
                  color="success"
                  sx={{ width: "30%" }}
                  onClick={handleSave}
                >
                  Save
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="info"
                  sx={{ width: "30%" }}
                  onClick={onCancel}
                >
                  Cancel
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}
        </Scrollbar>
      </SoftBox>
    </Modal>
  );
}

AddUniversityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onDo: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddUniversityModal;
