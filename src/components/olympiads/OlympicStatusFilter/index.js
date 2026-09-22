import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { STATUS } from "components/olympiads/OlympicStatusBadge";

// The order the toggles are offered in follows the path a question takes —
// drafted, submitted, then judged — not the numeric order of the ids.
const ORDER = [3, 4, 1, 2];

/**
 * Narrows a listing to a set of validation states.
 *
 * It sits beside `OlympicFilters` rather than inside it: the olympiad / level /
 * phase / year block is a server-side narrowing shared by every olympic
 * screen, while this one is a client-side filter only the "my questions"
 * listing asks for.
 *
 * `value` is the array of selected ids, which is also what
 * ToggleButtonGroup's `onChange` hands back.
 */
function OlympicStatusFilter({ value, onChange, order = ORDER }) {
  return (
    <SoftBox width="100%" display="flex" alignItems="center" justifyContent="center">
      <ToggleButtonGroup type="checkbox" value={value} onChange={onChange} size="sm">
        {order.map((id) => {
          const { short, swatch } = STATUS[id];
          return (
            <ToggleButton
              key={id}
              id={`olympic-tbg-btn-${id}`}
              value={id}
              style={
                value.includes(id)
                  ? { background: swatch, border: swatch }
                  : { opacity: 0.4, background: swatch }
              }
            >
              {short}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </SoftBox>
  );
}

OlympicStatusFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  order: PropTypes.arrayOf(PropTypes.number),
};

export default OlympicStatusFilter;
