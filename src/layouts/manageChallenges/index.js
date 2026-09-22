import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Title from "./components/Title";
import Main from "./main";
import Results from "./components/Results";

function ManageChallenges() {
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
      <Title />
      {view === "list" ? (
        <Main onViewResults={handleViewResults} />
      ) : (
        <Results challengeId={selectedChallengeId} onBack={handleBack} />
      )}
    </DashboardLayout>
  );
}

export default ManageChallenges;
