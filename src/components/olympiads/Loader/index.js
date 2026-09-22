import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import SoftTypography from "components/SoftTypography";
import { COLORS } from "components/olympiads/colors";
import { useTranslation } from "react-i18next";

/**
 * Full-panel spinner. `message` defaults to the assessment wording it was
 * written for, so the screens that borrow it can say what they are waiting on.
 */
const SpinnerLoader = ({ message }) => {
  const { t } = useTranslation();
  const label =
    message || t("olympic_assessment_page.generating_test", "Generating the best test for you!");
  const spinnerStyle = useSpring({
    loop: true,
    from: { rotate: 0 },
    to: { rotate: 360 },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {[0, 1, 2, 3].map((index) => (
          <animated.div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              margin: '0 10px',
              backgroundColor: COLORS.primary,
              borderRadius: '8px',
              transform: spinnerStyle.rotate.to((rotate) => `rotate(${rotate}deg)`),
            }}
          />
        ))}
      </div>
      <SoftTypography fontWeight="bold" sx={{ color: COLORS.primary }}>{label}</SoftTypography>
    </div>

  );
};

SpinnerLoader.propTypes = {
  message: PropTypes.node,
};

export default SpinnerLoader;
