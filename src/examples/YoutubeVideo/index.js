import React, { useState } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import Spinner from 'react-bootstrap/Spinner';
import { useApi } from 'api';

const MovieClip = ({ id, videoId }) => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [playedOverOneMinute, setPlayedOverOneMinute] = useState(false);
  const [hasCheckedTime, setHasCheckedTime] = useState(false);

  const onPlayerReady = (event) => {
    // Access to player in all event handlers via event.target
    event.target.pauseVideo();
    setLoading(false);
  }

  const onStateChange = async (event) => {
    // Check if video has been played for over 1 minute
    if (!hasCheckedTime && event.data === YouTube.PlayerState.PLAYING) {
      const intervalId = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        if (currentTime > 60) {
          updateClicks();
          setPlayedOverOneMinute(true);
          clearInterval(intervalId);
        }
      }, 1000); // Check every second
      setHasCheckedTime(true);
    }
  }

  const updateClicks = async () => {
    try {
      await api.get("material/incrementClicks/" + id);
    } catch (error) {
    }
  }

  return (
    <>
      <style>
        {`
          .youtube-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            height: '100vh';
          }

          .youtube-container iframe {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
          .spinner-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}
      </style>
      <div className='youtube-container'> 
        <YouTube 
          videoId={videoId} 
          opts={{ playerVars: { autoplay: 0, controls: 1 } }} 
          onReady={onPlayerReady}
          onStateChange={onStateChange} 
        />
        {loading ? 
          <div className='spinner-container'>
            <Spinner animation="border" variant="primary" />
          </div>
        : null}
      </div>
    </>
  );
};

MovieClip.propTypes = {
  id: PropTypes.number.isRequired,
  videoId: PropTypes.string.isRequired,
};

export default MovieClip;
