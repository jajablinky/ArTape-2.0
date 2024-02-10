import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

type ModuleStatsProps = {
  live: boolean;
};

const ModuleStats = (props: ModuleStatsProps) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const calculateTimeLeft = () => {
    const difference = +new Date('2024-02-21T00:00:00') - +new Date();
    let timeLeft: any = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    setCountdown(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  const displayCountdown = () => {
    return `${countdown.days || 0}d ${countdown.hours || 0}h ${
      countdown.minutes || 0
    }min ${countdown.seconds || 0}s`;
  };

  useEffect(() => {
    setRandomNumber(getRandomNumber());
  }, []);
  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className={styles.moduleStats}>
      <div className={styles.moduleStatsInner}>
        <div className={styles.moduleStatsLeft}>
          <button className={styles.mintButton}>Mint</button>
          {props.live ? (
            <>
              <div className={styles.liveCircle}></div>
              <p>LIVE</p>
              <b>
                <p>{displayCountdown()}</p>
              </b>
            </>
          ) : null}
        </div>
        <div className={styles.moduleStatsRight}>
          <div className={styles.mint}>
            <p>Mints</p>

            <b>
              <span>{randomNumber}/100</span>
            </b>
          </div>
          <div className={styles.plays}>
            <p>Plays</p>

            <b>
              <span>2.2k</span>
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleStats;
