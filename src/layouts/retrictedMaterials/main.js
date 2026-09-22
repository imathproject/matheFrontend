import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Main() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        mt: 5,
      }}
    >
      <Card
        sx={{
          width: "40%",
          minWidth: 300,
          padding: 2,
          textAlign: "center",
          boxShadow: 3,
          backgroundColor: "#fff2cc",
          color: "#fff2cc",
        }}
      >
        <CardContent>
          <FontAwesomeIcon icon={faWarning} size="2x" color="#f1c232" />
          <SoftTypography variant="h5" sx={{ fontWeight: "bold" }}>
            Restricted area
          </SoftTypography>
          <SoftTypography variant="body2" sx={{ mt: 2 }}>
            Your lecturer account has not yet been validated. Once a platform administrator
            validates it, you will receive an email notification.
          </SoftTypography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Main;
