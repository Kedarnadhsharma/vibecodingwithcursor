import styles from '../page.module.css';

const demoKeys = [
  {
    id: 'key_live_a1b2',
    label: 'Production storefront',
    status: 'active',
    lastUsed: '10 minutes ago'
  },
  {
    id: 'key_test_x9y8',
    label: 'QA automation',
    status: 'paused',
    lastUsed: '3 days ago'
  }
];

export default function ApiKeyList() {
  return (
    <div className={styles.keyPanel}>
      <h2>Existing API keys</h2>
      <p>Update, pause, or delete keys. Tie this UI to GET/PATCH/DELETE calls.</p>
      <div className={styles.keyTable}>
        {demoKeys.map((key) => (
          <article key={key.id} className={styles.keyRow}>
            <div>
              <strong>{key.label}</strong>
              <p>{key.id}</p>
            </div>
            <div className={styles.badge}>{key.status}</div>
            <p className={styles.lastUsed}>Last used {key.lastUsed}</p>
            <div className={styles.keyActions}>
              <button>Edit</button>
              <button>Pause</button>
              <button>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

