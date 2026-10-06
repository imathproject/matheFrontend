import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useMemo, useState } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import OlympicFilters from "components/olympiads/OlympicFilters";
import { COLORS } from "components/olympiads/colors";
import UseNumberInput from "layouts/projectInformation/components/InputNumber";
import reportOptions from "../../data/reportOptions";

const I18N = "olympic_project_information_page";

const EMPTY_FILTERS = { olympic: null, level: null, phase: null, year: null };
const ALL_ROLES = [1, 2, 3, 4];
const DEFAULT_SOURCE = "both";

const ROLES = [
  { value: 1, key: "student", label: "Student", color: "#E00E79" },
  { value: 2, key: "lecturer", label: "Lecturer", color: "#0E73C0" },
  { value: 3, key: "reviewer", label: "Reviewer", color: "#FAA538" },
  { value: 4, key: "admin", label: "Admin", color: "#56a36b" },
];

const SOURCES = [
  { value: "assessment", key: "source_assessment", label: "Assessment" },
  { value: "challenge", key: "source_challenges", label: "Challenges" },
  { value: "both", key: "source_both", label: "Both" },
];

const toggleStyle = (active, color) =>
  active ? { background: color, border: color } : { opacity: 0.4, background: color };

function SearchBar({ onFilter }) {
  const { t } = useTranslation();
  const [option, setOption] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [roles, setRoles] = useState(ALL_ROLES);
  const [year, setYear] = useState("");
  const [source, setSource] = useState(DEFAULT_SOURCE);

  const allOptions = useMemo(
    () =>
      reportOptions.map((item) => ({
        ...item,
        label: t(`${I18N}.${item.key}`, item.label),
      })),
    [t]
  );

  // Sends the whole selection, with whatever just changed laid over the state.
  const handleOnFilterClick = (changes) => {
    const next = { option, filters, roles, year, source, ...changes };
    if (!next.option) return;
    onFilter({
      option: next.option.id,
      olympic: next.filters.olympic ? next.filters.olympic.id : null,
      level: next.filters.level ? next.filters.level.id : null,
      phase: next.filters.phase ? next.filters.phase.id : null,
      year: next.filters.year ? next.filters.year.id : null,
      roles: next.roles,
      date: next.year,
      source: next.source,
    });
  };

  const handleChangeOption = (option) => {
    setOption(option);
    setFilters(EMPTY_FILTERS);
    setRoles(ALL_ROLES);
    setYear("");
    setSource(DEFAULT_SOURCE);
    handleOnFilterClick({
      option,
      filters: EMPTY_FILTERS,
      roles: ALL_ROLES,
      year: "",
      source: DEFAULT_SOURCE,
    });
  };

  const handleChangeFilters = (filters) => {
    setFilters(filters);
    handleOnFilterClick({ filters });
  };

  const handleChangeRoles = (roles) => {
    setRoles(roles);
    handleOnFilterClick({ roles });
  };

  const handleChangeYear = (val) => {
    // The picker reports NaN while the year is still being typed.
    const year = /^\d{4}$/.test(String(val)) ? val : "";
    setYear(year);
    handleOnFilterClick({ year });
  };

  const handleChangeSource = (source) => {
    setSource(source);
    handleOnFilterClick({ source });
  };

  return (
    <SoftBox display="flex" mb={2} flexDirection="column" alignItems="flex-start">
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold">
          {t(`${I18N}.visualization_options`, "Visualization options")}
        </SoftTypography>
        <SoftAutocomplete
          onNewValueSelected={handleChangeOption}
          options={allOptions}
          selected={allOptions.find((item) => option && item.id === option.id) || null}
        />
      </SoftBox>
      {/* The keys remount the filters, which is what clears them on a new report. */}
      {option != null && option.olympicFilters ? (
        <SoftBox width="100%">
          <OlympicFilters key={option.id} layout="row" onChange={handleChangeFilters} />
        </SoftBox>
      ) : null}
      {option != null && option.performance ? (
        <SoftBox
          width="100%"
          display="flex"
          flexWrap="wrap"
          alignItems="flex-end"
          sx={{ gap: 3, "& > *": { maxWidth: "100%" } }}
        >
          <UseNumberInput key={option.id} defaultValue={year} onInputChange={handleChangeYear} />
          <SoftBox display="flex" flexDirection="column" py={1}>
            <SoftTypography sx={{ color: COLORS.brown }} fontWeight="bold">
              {t(`${I18N}.source`, "Source")}
            </SoftTypography>
            <ToggleButtonGroup
              type="radio"
              name="olympic-project-information-source"
              value={source}
              onChange={handleChangeSource}
              size="sm"
            >
              {SOURCES.map((item) => (
                <ToggleButton
                  key={item.value}
                  id={`olympic-pi-source-${item.value}`}
                  value={item.value}
                  style={toggleStyle(source === item.value, COLORS.primaryDark)}
                >
                  {t(`${I18N}.${item.key}`, item.label)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </SoftBox>
        </SoftBox>
      ) : null}
      {option != null && option.roles ? (
        <SoftBox width="100%" mt={2} display="flex" alignItems="center" justifyContent="center">
          <ToggleButtonGroup
            type="checkbox"
            value={roles}
            onChange={handleChangeRoles}
            size="sm"
            style={{ flexWrap: "wrap" }}
          >
            {ROLES.map((item) => (
              <ToggleButton
                key={item.value}
                id={`olympic-pi-role-${item.value}`}
                value={item.value}
                style={toggleStyle(roles.includes(item.value), item.color)}
              >
                {t(`${I18N}.${item.key}`, item.label)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </SoftBox>
      ) : null}
    </SoftBox>
  );
}

// Define prop types for the component
SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
