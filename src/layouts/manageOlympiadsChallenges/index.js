import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import OlympicPageHeader from "components/olympiads/OlympicPageHeader";
import { useTranslation } from "react-i18next";
import Main from "./main";
import Results from "./components/Results";

function ManageChallenges() {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const handleViewResults = (id) => {
    setSelectedChallengeId(id);
    setView("results");
  };

  const handleBack = () => {
    setView("list");
    setSelectedChallengeId(null);
  };

  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("manage_olympiads_challenges_page.title", "Manage Challenges")} />
      {view === "list" ? (
        <Main onViewResults={handleViewResults} />
      ) : (
        <Results challengeId={selectedChallengeId} onBack={handleBack} />
      )}
    </DashboardLayout>
  );
}

export default ManageChallenges;
