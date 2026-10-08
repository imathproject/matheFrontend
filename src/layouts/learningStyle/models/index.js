import { FelderSilvermanArt, KolbArt } from "../components/ModelArt";
import felderSilverman from "./felderSilverman";

// The questionnaires offered on the selection screen, in display order. The
// description of each one is `learning_style_page.models.<id>.description`,
// and `Art` is the drawing on its tile.
//
// A model without a `questionnaire` is drawn as "coming soon": to open it up,
// add its questionnaire file next to felderSilverman.js and point to it here.
const models = [
  {
    id: "felder_silverman",
    name: "Felder-Silverman",
    Art: FelderSilvermanArt,
    questionnaire: felderSilverman,
  },
  { id: "kolb", name: "Kolb", Art: KolbArt, questionnaire: null },
];

export default models;
