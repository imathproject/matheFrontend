import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useTranslation } from "react-i18next";


const MAX_CONFETTIS = 400;
const FIRE_DELAY = 50;

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
    let y = Math.random() * - 500;
    let rotation = Math.random() * 360;
    let skew = Math.random() * 25;
    let opacity = 0;

    confettiAnims[`@keyframes confettiAnim${i}`] = Object.fromEntries(
      [...Array(51)].map((item, j) => {
        if (j > 0 && opacity !== 1) {
          opacity += 0.5;
        }

        if (j > 6 && y < 125) {
          y = y + (8 + Math.random() * 15);
          rotation = rotation + (10 + Math.random() * 30);
        }

        if (j <= 4) {
          return [
            `${j * 2}%`,
            {
              opacity: opacity,
              transform: `translate3d(${getConfettiLaunchValue(
                j,
                x - 150
              )}px, ${getConfettiLaunchValue(
                j,
                y
              )}px, 0) rotateY(${rotation}deg) rotateX(${rotation}deg) rotateZ(${rotation}deg) skew(${skew}deg)`
            }
          ];
        }

        return [
          `${j * 2}%`,
          {
            opacity: opacity,
            transform: `translate3d(${x - 150}px, ${y}px, 0) rotateY(${rotation}deg) rotateX(${rotation}deg) rotateZ(${rotation}deg) skew(${skew}deg)`
          }
        ];
      })
    );

    confettis["&.confetti-" + i] = {
      //transform: `translate(${Math.random() * 300}px, ${Math.random() * 300 * -1}px) rotate(${Math.random() * 360}deg) skew(${Math.random() * 25}deg)`,
      animation: `$confettiAnim${i} 4s ${FIRE_DELAY}ms forwards`,
    };
  });

  return {
    "@global": {
      "html, body": {
        fontFamily: '"Montserrat", sans-serif',
        height: "100%",
        margin: 0,
      }
    },
    congratulations: {
      position: "relative",
      textAlign: "center", // Align text in the center
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      color: "white", // Change color here
      fontSize: 24, // Adjust font size as needed
      marginBottom: 20, // Add margin bottom for spacing
      marginTop: 50
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    },
    confettiParty: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      width: 700,
      height: 800
    },
    confettiContainer: {
      position: "relative",
      width: 600
    },
    ...confettiAnims,
    confetti: {
      // Existing confetti style
      position: "absolute",
      width: 14,
      height: 26,
      backgroundColor: "red", // Primary color
      opacity: 0,
      ...confettis,

    },
    input: {
      marginRight: 10,
      width: 250,
      "& input": {
        height: 16,
        paddingTop: 14,
        paddingBottom: 14
      }
    }
  };
});

function Dot() {
  const classes = useStyles();
  const [hasConfettiLaunched, launchConfetti] = useState(false);

  const [numOfConfetti, setnumOfConfetti] = useState(400);
  const { t } = useTranslation();
  useEffect(() => {
    launchConfetti(true);
  }, []);

  return (
    <div>
      <div className={`${classes.congratulations}`}>
        <SoftTypography textGradient={true} color="info" fontWeight="bold" variant="h2" sx={{ align: "center" }}>{t("he_assessment_page.congratulations", "Congratulations, you have completed all levels!")}</SoftTypography>
        <SoftButton variant="gradient" color="info" sx={{ width: "250px", mt: 2 }} onClick={() => window.location.reload(false)}>
          {t("he_assessment_page.return_to_new_questions", "Return to new questions")}
        </SoftButton>
      </div>
      {[...Array(numOfConfetti)].map((val, i) => {
        // Determine background color based on index
        let backgroundColor;
        if (i % 4 === 0) {
          backgroundColor = '#FF334B'; // Assign red to every fourth confetti
        } else if (i % 4 === 1) {
          backgroundColor = '#338EFF'; // Assign blue to the confettis with indices congruent to 1 modulo 4
        } else if (i % 4 === 2) {
          backgroundColor = '#9AFF33'; // Assign green to the confettis with indices congruent to 2 modulo 4
        } else {
          backgroundColor = '#FFF033'; // Assign yellow to the confettis with indices congruent to 3 modulo 4
        }
        return (
          <div
            className={`${classes.confetti} confetti-${i + 1}`}
            key={i}
            data-testid="confetti"
            style={{ backgroundColor }} // Set inline style for background color
          />
        );
      })}
    </div>
  );
}


export default Dot;
