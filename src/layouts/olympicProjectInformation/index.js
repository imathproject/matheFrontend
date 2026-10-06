import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";

function OlympicProjectInformation() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader
        title={t("olympic_project_information_page.title", "Project Information")}
      />
      <Main />
    </DashboardLayout>
  );
}

export default OlympicProjectInformation;
