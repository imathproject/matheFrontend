import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";

function AllOlympicQuestions({ canEdit }) {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("olympic_questions_page.title", "Olympiads Questions")} />
      <Main canEdit={canEdit} />
    </DashboardLayout>
  );
}

AllOlympicQuestions.propTypes = {
  canEdit: PropTypes.bool,
};

AllOlympicQuestions.defaultProps = {
  canEdit: false,
};

export default AllOlympicQuestions;
