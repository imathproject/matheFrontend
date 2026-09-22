import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";

// The author's own questions: the same listing an admin gets on
// `allOlympicQuestions`, narrowed to what this user submitted.
function OlympicQuestion() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("olympic_questions_page.title", "Olympiads Questions")} />
      <Main />
    </DashboardLayout>
  );
}

export default OlympicQuestion;
