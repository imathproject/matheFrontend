// The reports the page offers and which filters each one takes.
// `olympicFilters`: olympiad / level / phase / year; `roles`: the role toggles;
// `performance`: the answer year and the source (Assessment / Challenges / Both).
const reportOptions = [
  { id: 1, key: "keywords_information", label: "Keywords Information", olympicFilters: true },
  { id: 2, key: "questions_information", label: "Questions Information", olympicFilters: true },
  { id: 3, key: "validation_information", label: "Validation Information", olympicFilters: true },
  {
    id: 4,
    key: "student_performance",
    label: "Student Performance",
    olympicFilters: true,
    roles: true,
    performance: true,
  },
  { id: 5, key: "user_information", label: "User Information", roles: true },
  { id: 6, key: "olympiads_information", label: "Olympiads Information" },
  { id: 7, key: "challenges_information", label: "Challenges Information", olympicFilters: true },
];

export default reportOptions;
