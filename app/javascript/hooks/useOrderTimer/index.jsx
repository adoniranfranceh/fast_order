import { useEffect, useState, useRef } from 'react';
import moment from 'moment';

const useOrderTimer = (orderId, timeStarted, timeStopped, status) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === 'doing' && timeStarted) {
      const now = moment().unix();
      const startTime = moment(timeStarted).unix();

      setElapsedTime(now - startTime);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);

    } else if (timeStopped && timeStarted) {
      const totalTime = moment(timeStopped).unix() - moment(timeStarted).unix();
      setElapsedTime(totalTime);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId, timeStarted, timeStopped, status]);

  return elapsedTime;
};

export default useOrderTimer;
