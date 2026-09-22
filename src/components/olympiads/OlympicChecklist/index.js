import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const LABEL_STYLE = { fontFamily: "Roboto", fontSize: "1rem", fontWeight: 400 };

// The olympiads as two columns of checkboxes, for choosing which ones a reviewer
// reviews — by the admin in Manage Users and by the reviewer on their profile.
function OlympicChecklist({ options, selected, onChange }) {
  const toggle = (id, checked) =>
    onChange(checked ? [...selected, id] : selected.filter((item) => item !== id));

  const half = Math.ceil(options.length / 2);
  const column = (olympics) => (
    <Col style={{ width: "50%" }}>
      <Form>
        {olympics.map((olympic) => (
          <Form.Check
            key={olympic.id}
            type="checkbox"
            checked={selected.includes(olympic.id)}
            style={LABEL_STYLE}
            label={olympic.label}
            onChange={(e) => toggle(olympic.id, e.target.checked)}
          />
        ))}
      </Form>
    </Col>
  );

  return (
    <Container style={{ width: "100%", marginBottom: 5 }}>
      <Row>
        {column(options.slice(0, half))}
        {column(options.slice(half))}
      </Row>
    </Container>
  );
}

OlympicChecklist.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OlympicChecklist;
