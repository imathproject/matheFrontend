// The questions that are actually asked: the first `questionsPerDimension` of
// each dimension, in their original order.
export function getQuestionSet(questionnaire) {
  const taken = {};

  return questionnaire.questions.filter(({ dimension }) => {
    taken[dimension] = (taken[dimension] || 0) + 1;
    return taken[dimension] <= questionnaire.questionsPerDimension;
  });
}

// How far the answers have to lean to one pole to count as each intensity.
function getIntensity(strength) {
  if (strength === 0) return "balanced";
  if (strength <= 0.3) return "slight";
  if (strength <= 0.65) return "moderate";
  return "strong";
}

// One result per dimension. `lean` goes from -1 (every answer on the left
// pole) to 1 (every answer on the right pole), and `pole` is the side the
// answers lean to, or null on a tie.
export function calculateResults(questionnaire, questionSet, answers) {
  return questionnaire.dimensions.map((dimension) => {
    const asked = questionSet.filter((question) => question.dimension === dimension.id);
    const left = asked.filter((question) => answers[question.id] === "a").length;
    const right = asked.filter((question) => answers[question.id] === "b").length;
    const lean = asked.length ? (right - left) / asked.length : 0;

    let pole = null;
    if (lean < 0) pole = dimension.left;
    if (lean > 0) pole = dimension.right;

    return {
      id: dimension.id,
      left: dimension.left,
      right: dimension.right,
      lean,
      pole,
      intensity: getIntensity(Math.abs(lean)),
    };
  });
}
