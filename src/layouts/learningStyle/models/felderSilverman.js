// Felder-Silverman describes a learner on four dimensions, each one a scale
// between two poles. Every question has two options: "a" counts for the left
// pole of its dimension and "b" for the right one.
//
// The texts are in the translation files, under `i18nKey`: questions are
// `questions.q<id>` (text, a, b) and poles are `poles.<pole>` (name, summary).
const dimensions = [
  { id: "active_reflective", left: "active", right: "reflective" },
  { id: "sensing_intuitive", left: "sensing", right: "intuitive" },
  { id: "visual_verbal", left: "visual", right: "verbal" },
  { id: "sequential_global", left: "sequential", right: "global" },
];

const TOTAL_QUESTIONS = 44;

// Ids run from 1 to 44 and cycle through the dimensions, so the questions of
// each dimension stay spread along the questionnaire.
const questions = Array.from({ length: TOTAL_QUESTIONS }, (_, index) => ({
  id: index + 1,
  dimension: dimensions[index % dimensions.length].id,
}));

const felderSilverman = {
  i18nKey: "learning_style_page.felder_silverman",
  dimensions,
  questions,
  // 6 asks the short questionnaire (24 questions); 11 asks all 44.
  questionsPerDimension: 6,
};

export default felderSilverman;
