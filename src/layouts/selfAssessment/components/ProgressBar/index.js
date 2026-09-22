import PropTypes from "prop-types";
import React from 'react';
import { useSpring, animated } from 'react-spring';

const ProgressBar = ({ progress, maxLevel }) => {
  const { width } = useSpring({
    from: { width: '0%' },
    to: { width: `${(progress / maxLevel) * 100}%` },
  });

  const markers = Array.from({ length: maxLevel }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        height: '100%',
        width: '2px',
        backgroundColor: '#2596be',
        left: `${((i + 1) / maxLevel) * 100}%`
      }}
    />
  ));

  const labels = Array.from({ length: maxLevel }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        top: '100%',
        left: `${((i + 1) / maxLevel) * 100}%`,
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        color: '#2596be'
      }}
    >
      {i + 1}
    </div>
  ));

  return (
    <div style={{ width: '100%', height: '20px', backgroundColor: '#ddd', position: 'relative', marginBottom: '30px' }}>
      {/* Milestone Markers */}
      {markers}

      {/* Text Labels */}
      {labels}

      {/* Progress Bar */}
      <animated.div
        style={{
          height: '100%',
          width,
          backgroundColor: '#2596be'
        }}
      />
    </div>
  );
};

// Typechecking props for the ProgressBar
ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  maxLevel: PropTypes.number.isRequired,
};

export default ProgressBar;
