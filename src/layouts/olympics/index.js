import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";

function Olympics() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("olympics_page.title", "Olympiads")} />
      <Main />
    </DashboardLayout>
  );
}

export default Olympics;
