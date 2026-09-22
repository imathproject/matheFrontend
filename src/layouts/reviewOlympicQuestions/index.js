import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";

function ReviewQuestion() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader
        title={t("review_olympic_questions_page.title", "Review Olympiads Questions")}
      />
      <Main />
    </DashboardLayout>
  );
}

export default ReviewQuestion;
