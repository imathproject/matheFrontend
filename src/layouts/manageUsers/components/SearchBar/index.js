import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from "api";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function SearchBar({ onFilter }) {
  const [university, setUniversity] = useState(null);
  const [typology, setTypology] = useState(null);
  const [universityOptions, setUniversityOptions] = useState([]);
  const [typologyOptions, setTypologyOptions] = useState([]);
  const [value, setValue] = useState([1, 0]);
  const api = useApi();

  const handleChangeValidation = (val) => {
    setValue(val);
    handleOnFilter(typology, val, university);
  };

  useEffect(() => {
    fetchRoles();
    fetchUniversities();
  }, []);

  async function fetchRoles() {
    try {
      const data = await api.get("role/getAll");
      const roles = data.data.elements;
      roles.unshift({ label: "All typologies", id: null });
      setTypologyOptions(roles); // Fix here
    } catch (error) {
      // Handle error
    }
  }

  async function fetchUniversities() {
    try {
      const data = await api.get("university/getAll");
      const universities = data.data.elements;
      universities.unshift({ label: "All Universities", id: null });
      universities.unshift({ label: "Other/ Suggest a new university ", id: 64 });
      setUniversityOptions(universities); // Fix here
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeTypology = (t) => {
    setTypology(t);
    handleOnFilter(t, value, university);
  };

  const handleChangeUniversity = (u) => {
    setUniversity(u);
    handleOnFilter(typology, value, u);
  };

  const handleOnFilter = (typology, value, university) => {
    const t = typology ? typology.id : null;
    const u = university ? university.id : null;
    onFilter(t, value, u);
  };

  return (
    <SoftBox display="flex" mb={2} flexDirection="column" alignItems="flex-start">
      <SoftBox
        width="100%"
        display="flex"
        flexDirection="row"
        sx={{
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        }}
      >
        <SoftBox
          width="50%"
          display="flex"
          flexDirection="column"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              mb: 2,
            },
          }}
        >
          <SoftTypography color="dark" fontWeight="bold">
            Typology
          </SoftTypography>
          <SoftAutocomplete
            options={typologyOptions}
            selected={typology}
            onNewValueSelected={handleChangeTypology}
          />
        </SoftBox>
        <SoftBox
          width="50%"
          ml={1}
          display="flex"
          flexDirection="column"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              ml: 0,
            },
          }}
        >
          <SoftTypography color="dark" fontWeight="bold">
            University
          </SoftTypography>
          <SoftAutocomplete
            options={universityOptions}
            selected={university}
            onNewValueSelected={handleChangeUniversity}
          />
        </SoftBox>
      </SoftBox>
      <SoftBox width="100%" mt={2} display="flex" alignItems="center" justifyContent="center">
        <ToggleButtonGroup
          type="checkbox"
          value={value}
          onChange={handleChangeValidation}
          size="sm"
        >
          <ToggleButton
            id="tbg-btn-3"
            value={1}
            style={
              !value.includes(1)
                ? { opacity: 0.4, background: "#cc0900" }
                : { background: "#cc0900", border: "#cc0900" }
            }
          >
            Banned
          </ToggleButton>
          <ToggleButton
            id="tbg-btn-4"
            value={0}
            style={
              !value.includes(0)
                ? { opacity: 0.4, background: "#56a36b" }
                : { background: "#56a36b", border: "#56a36b" }
            }
          >
            Active
          </ToggleButton>
        </ToggleButtonGroup>
      </SoftBox>
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
