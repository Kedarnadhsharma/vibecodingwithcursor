import Link from 'next/link';
import styles from '../page.module.css';

type PlanCardProps = {
  planName?: string;
  used?: number;
  limit?: number;
};

export default function PlanCard({ 
  planName = 'Researcher',
  used = 24,
  limit = 1000 
}: PlanCardProps) {
  const usagePercent = Math.min((used / limit) * 100, 100);

  return (
    <section className={styles.planCard}>
      <div className={styles.planTop}>
        <div>
          <p className={styles.planLabel}>Current plan</p>
          <h2>{planName}</h2>
        </div>
        <Link href="#" className={styles.manageButton}>
          Manage plan
        </Link>
      </div>
      <div className={styles.planUsage}>
        <div className={styles.usageRow}>
          <p>API Limit</p>
          <span>
            {used}/{limit} Requests
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressValue}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

