// Images
import card1 from "assets/images/card1.jpg";
import card3 from "assets/images/card3.jpg";

import felderSilverman from "./felderSilverman";

// The questionnaires offered on the selection screen, in display order. The
// description of each one is `learning_style_page.models.<id>.description`.
//
// A model without a `questionnaire` is drawn as "coming soon": to open it up,
// add its questionnaire file next to felderSilverman.js and point to it here.
const models = [
  {
    id: "felder_silverman",
    name: "Felder-Silverman",
    image: card3,
    questionnaire: felderSilverman,
  },
  { id: "kolb", name: "Kolb", image: card1, questionnaire: null },
];

export default models;
