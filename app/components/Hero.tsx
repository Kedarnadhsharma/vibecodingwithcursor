import Link from 'next/link';
import styles from '../page.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>Next.js Starter</p>
      <h1>Build quickly, iterate faster.</h1>
      <p>
        This sample app ships with the Next.js App Router, a global style
        sheet, and a basic layout so you can start experimenting immediately.
      </p>
      <div className={styles.ctaRow}>
        <Link href="/dashboards" className={styles.primaryCta}>
          Manage API keys
        </Link>
        <Link href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
          Explore the docs
        </Link>
        <Link
          href="https://github.com/vercel/next.js/tree/canary/examples"
          target="_blank"
          rel="noreferrer"
        >
          See examples
        </Link>
      </div>
    </div>
  );
}

