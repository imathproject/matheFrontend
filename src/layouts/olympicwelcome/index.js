import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import Main from "./main";
import medalhas from "assets/images/melhadas.jpg";
import SoftBox from "components/SoftBox";
function OlympicWelcomePage() {
  return (
    <DashboardLayout>
      <SoftBox
        component="img"
        src={medalhas}
        alt="Medals"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "200px", sm: "300px", md: "420px" },
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <OlympicPageHeader />
      <Main />
    </DashboardLayout>
  );
}

export default OlympicWelcomePage;
