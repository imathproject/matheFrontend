import React from "react";
import { makeStyles } from "@material-ui/core";

/**
 * The confetti burst of the olympic result screens.
 *
 * The olympic screens used to reuse `layouts/challenge/components/Confetti`,
 * which is the Higher Education one: besides the falling paper it also renders
 * a blue "Congratulations, you have completed all levels!" heading and a blue
 * "Return to new questions" button. Both landed on top of the olympic result
 * card, where the heading is wrong (there are no levels to complete) and the
 * button reloads the page. This is the same animation with only the paper.
 */

const MAX_CONFETTIS = 400;
const FIRE_DELAY = 50;

// Confetti are launched from a single point, so the first few keyframes ease
// them out of it instead of teleporting them to their final trajectory.
const getConfettiLaunchValue = (index, value) => {
  switch (index) {
    case 0:
      return 0;
    case 1:
      return (value / 5) * 3;
    case 2:
      return (value / 5) * 4.5;
    case 3:
      return (value / 5) * 4.8;
    case 4:
      return (value / 5) * 4.9;
    default:
      return 0;
  }
};

const useStyles = makeStyles(() => {
  const confettis = {};
  const confettiAnims = {};

  [...Array(MAX_CONFETTIS)].forEach((val, i) => {
    let x = Math.random() * window.innerWidth + 100;
    let y = Math.random() * -500;
    let rotation = Math.random() * 360;
    const skew = Math.random() * 25;
    let opacity = 0;

    confettiAnims[`@keyframes olympicConfettiAnim${i}`] = Object.fromEntries(
      [...Array(51)].map((item, j) => {
        if (j > 0 && opacity !== 1) {
          opacity += 0.5;
        }

        if (j > 6 && y < 125) {
          y = y + (8 + Math.random() * 15);
          rotation = rotation + (10 + Math.random() * 30);
        }

        const translateX = j <= 4 ? getConfettiLaunchValue(j, x - 150) : x - 150;
        const translateY = j <= 4 ? getConfettiLaunchValue(j, y) : y;

        return [
          `${j * 2}%`,
          {
            opacity: opacity,
            transform: `translate3d(${translateX}px, ${translateY}px, 0) rotateY(${rotation}deg) rotateX(${rotation}deg) rotateZ(${rotation}deg) skew(${skew}deg)`,
          },
        ];
      })
    );

    confettis["&.olympic-confetti-" + i] = {
      animation: `$olympicConfettiAnim${i} 4s ${FIRE_DELAY}ms forwards`,
    };
  });

  return {
    ...confettiAnims,
    confetti: {
      position: "absolute",
      width: 14,
      height: 26,
      backgroundColor: "red",
      opacity: 0,
      ...confettis,
    },
  };
});

function OlympicConfetti() {
  const classes = useStyles();

  return (
    <div>
      {[...Array(MAX_CONFETTIS)].map((val, i) => {
        // The olympic palette instead of the Higher Education red/blue/green/yellow.
        let backgroundColor;
        if (i % 4 === 0) {
          backgroundColor = "#f1a841";
        } else if (i % 4 === 1) {
          backgroundColor = "#ffcc00";
        } else if (i % 4 === 2) {
          backgroundColor = "#A72D08";
        } else {
          backgroundColor = "#6e1c07";
        }

        return (
          <div
            className={`${classes.confetti} olympic-confetti-${i}`}
            key={i}
            data-testid="olympic-confetti"
            style={{ backgroundColor }}
          />
        );
      })}
    </div>
  );
}

export default OlympicConfetti;
