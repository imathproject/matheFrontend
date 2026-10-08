import { useId } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// The pictures of the selection screen: one drawing per model, with no words
// in it, so there is nothing to translate. Each one keeps to the upper half of
// its frame, because the tile writes the model's name over the lower half.
const WIDTH = 600;
const HEIGHT = 360;

const colorsShape = PropTypes.shape({
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
});

// Pictograms are drawn on a 36 by 36 grid, as outlines.
const pictograms = {
  // A triangle pointing forward: doing.
  doing: <path d="M11 7l17 11-17 11z" />,
  // A pause sign: stopping to think it over.
  thinking: (
    <>
      <rect x="8" y="7" width="7" height="22" rx="1.5" />
      <rect x="21" y="7" width="7" height="22" rx="1.5" />
    </>
  ),
  // A ruler: concrete facts and measures.
  ruler: (
    <>
      <rect x="4" y="12" width="28" height="12" rx="2" />
      <path d="M10 12v5M16 12v7M22 12v5M28 12v7" />
    </>
  ),
  // A light bulb: ideas and concepts.
  idea: (
    <>
      <path d="M18 5a9 9 0 0 0-5 16.5V25h10v-3.5A9 9 0 0 0 18 5z" />
      <path d="M14 30h8" />
    </>
  ),
  // An eye: pictures, or watching.
  eye: (
    <>
      <path d="M3 18s6-9 15-9 15 9 15 9-6 9-15 9S3 18 3 18z" />
      <circle cx="18" cy="18" r="4" />
    </>
  ),
  // A speech bubble with lines of text: words.
  words: (
    <>
      <path d="M5 7h26v16H16l-7 6v-6H5z" />
      <path d="M10 13h16M10 18h10" />
    </>
  ),
  // Stairs: one step after the other.
  steps: <path d="M4 30h8v-8h8v-8h8V6h4" />,
  // A globe: the whole picture.
  globe: (
    <>
      <circle cx="18" cy="18" r="13" />
      <path d="M5 18h26M18 5c5 4 5 22 0 26M18 5c-5 4-5 22 0 26" />
    </>
  ),
  // A heart: feeling, living the experience.
  heart: (
    <path d="M18 30S6 22.5 6 13.5a6.5 6.5 0 0 1 12-3.5 6.5 6.5 0 0 1 12 3.5C30 22.5 18 30 18 30z" />
  ),
};

function Pictogram({ name, x, y, size }) {
  const scale = size / 36;

  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="#fff"
      strokeWidth={2.5 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {pictograms[name]}
    </g>
  );
}

Pictogram.propTypes = {
  name: PropTypes.oneOf(Object.keys(pictograms)).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

// The frame both drawings share: the section's colors and two faint circles.
function Frame({ colors, children }) {
  // Two drawings sit on the same page, so each needs its own gradient id.
  const gradientId = `model-art-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.from} />
          <stop offset="1" stopColor={colors.to} />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill={`url(#${gradientId})`} />
      <circle cx="540" cy="20" r="150" fill="#fff" opacity="0.06" />
      <circle cx="40" cy="340" r="190" fill="#fff" opacity="0.05" />
      {children}
    </svg>
  );
}

Frame.propTypes = {
  colors: colorsShape.isRequired,
  children: PropTypes.node.isRequired,
};

// Felder-Silverman: its four scales, each between the pictograms of its two
// poles, with a marker somewhere along the way.
const scales = [
  { y: 66, left: "doing", right: "thinking", marker: 0.24 },
  { y: 102, left: "ruler", right: "idea", marker: 0.66 },
  { y: 138, left: "eye", right: "words", marker: 0.14 },
  { y: 174, left: "steps", right: "globe", marker: 0.58 },
];

const SCALE_START = 160;
const SCALE_END = 440;
const SCALE_MIDDLE = (SCALE_START + SCALE_END) / 2;

export function FelderSilvermanArt({ colors }) {
  return (
    <Frame colors={colors}>
      {scales.map(({ y, left, right, marker }) => {
        const x = SCALE_START + (SCALE_END - SCALE_START) * marker;

        return (
          <g key={y}>
            <Pictogram name={left} x={SCALE_START - 50} y={y} size={26} />
            <Pictogram name={right} x={SCALE_END + 50} y={y} size={26} />
            <line
              x1={SCALE_START}
              x2={SCALE_END}
              y1={y}
              y2={y}
              stroke="#fff"
              strokeOpacity="0.3"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1={SCALE_MIDDLE}
              x2={x}
              y1={y}
              y2={y}
              stroke={colors.highlight}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1={SCALE_MIDDLE}
              x2={SCALE_MIDDLE}
              y1={y - 9}
              y2={y + 9}
              stroke="#fff"
              strokeOpacity="0.6"
              strokeWidth="2"
            />
            <circle cx={x} cy={y} r="8" fill="#fff" />
          </g>
        );
      })}
    </Frame>
  );
}

FelderSilvermanArt.propTypes = {
  colors: colorsShape.isRequired,
};

// Kolb: his cycle of four stages, clockwise from the top: living the
// experience, watching, thinking and doing.
const stages = [
  { x: 300, y: 60, pictogram: "heart" },
  { x: 410, y: 118, pictogram: "eye" },
  { x: 300, y: 176, pictogram: "idea" },
  { x: 190, y: 118, pictogram: "doing" },
];

// The stretch of the cycle between one stage and the next.
const arcs = [
  "M330.3 62.2A110 58 0 0 1 397.1 90.8",
  "M398.9 143.4A110 58 0 0 1 334 173.2",
  "M269.7 173.8A110 58 0 0 1 202.9 145.2",
  "M201.1 92.6A110 58 0 0 1 266 62.8",
];

export function KolbArt({ colors }) {
  const arrowId = `model-art-arrow-${useId().replace(/:/g, "")}`;

  return (
    <Frame colors={colors}>
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" fill={colors.highlight} />
        </marker>
      </defs>
      {arcs.map((arc) => (
        <path
          key={arc}
          d={arc}
          fill="none"
          stroke={colors.highlight}
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd={`url(#${arrowId})`}
        />
      ))}
      {stages.map(({ x, y, pictogram }) => (
        <g key={pictogram}>
          <circle
            cx={x}
            cy={y}
            r="19"
            fill="#fff"
            fillOpacity="0.14"
            stroke="#fff"
            strokeWidth="2"
          />
          <Pictogram name={pictogram} x={x} y={y} size={20} />
        </g>
      ))}
    </Frame>
  );
}

KolbArt.propTypes = {
  colors: colorsShape.isRequired,
};
