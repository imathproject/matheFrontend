import React from 'react';
import { useSpring, animated } from 'react-spring';
import SoftTypography from 'components/SoftTypography';
import { useTranslation } from 'react-i18next';

const SpinnerLoader = () => {
  const spinnerStyle = useSpring({
    loop: true,
    from: { rotate: 0 },
    to: { rotate: 360 },
  });
  const { t } = useTranslation();
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
              backgroundColor: '#3498db',
              borderRadius: '8px',
              transform: spinnerStyle.rotate.to((rotate) => `rotate(${rotate}deg)`),
            }}
          />
        ))}
      </div>
      <SoftTypography fontWeight="bold" color="info">{t("he_assessment_page.generating_test", "Generating the best test for you!")}</SoftTypography>
    </div>

  );
};

export default SpinnerLoader;
