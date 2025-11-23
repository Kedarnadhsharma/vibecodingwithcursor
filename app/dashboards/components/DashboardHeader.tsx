import Link from 'next/link';
import styles from '../page.module.css';

export default function DashboardHeader() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.breadcrumb}>Pages / Overview</p>
        <h1>Overview</h1>
      </div>
      <div className={styles.headerActions}>
        <span className={styles.statusPill}>
          <span className={styles.statusDot} /> Operational
        </span>
        <div className={styles.iconTray}>
          <Link href="https://github.com" aria-label="GitHub">
            ⧉
          </Link>
          <Link href="https://twitter.com" aria-label="Twitter">
            𝕏
          </Link>
          <Link href="mailto:team@example.com" aria-label="Contact support">
            ✉️
          </Link>
        </div>
      </div>
    </header>
  );
}

