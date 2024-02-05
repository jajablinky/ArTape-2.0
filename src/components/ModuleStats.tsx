import styles from '@/styles/Home.module.css';

const ModuleStats = () => {
  return (
    <div className={styles.moduleStats}>
      <div className={styles.moduleStatsInner}>
        <div className={styles.moduleStatsRight}>
          <button className={styles.mintButton}>Mint</button>
        </div>
        <div className={styles.moduleStatsLeft}>
          <div className={styles.mint}>
            <p>Mints</p>
            <span>56/100</span>
          </div>
          <div className={styles.plays}>
            <p>Plays</p>
            <span>2.2k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleStats;
