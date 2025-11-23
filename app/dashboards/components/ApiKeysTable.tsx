import Link from 'next/link';
import { ApiKey } from '../types';
import styles from '../page.module.css';

type ApiKeysTableProps = {
  keys: ApiKey[];
  isLoading: boolean;
  errorText: string | null;
  onReveal: (key: ApiKey) => void;
  onCopy: (keyValue: string, keyName: string) => void;
  onDelete: (id: string) => void;
  onAddKey: () => void;
};

export default function ApiKeysTable({
  keys,
  isLoading,
  errorText,
  onReveal,
  onCopy,
  onDelete,
  onAddKey
}: ApiKeysTableProps) {
  return (
    <section className={styles.keysCard}>
      <div className={styles.keysHeader}>
        <div>
          <h3>API Keys</h3>
          <p>
            The key is used to authenticate requests to the Research API. See the{' '}
            <Link href="https://example.com/docs" target="_blank">
              documentation
            </Link>{' '}
            for details.
          </p>
        </div>
        <button
          type="button"
          className={styles.addButton}
          aria-label="Add key"
          onClick={onAddKey}
        >
          +
        </button>
      </div>

      <div className={styles.keysTable}>
        <div className={styles.tableHead}>
          <span>Name</span>
          <span>Usage</span>
          <span>Key</span>
          <span>Options</span>
        </div>

        {isLoading && <div className={styles.tableStatus}>Loading keys…</div>}
        {errorText && !isLoading && (
          <div className={styles.tableStatus}>{errorText}</div>
        )}
        {!isLoading && !errorText && keys.length === 0 && (
          <div className={styles.tableStatus}>No API keys yet.</div>
        )}

        {keys.map((key) => (
          <div key={key.id || key.name || Math.random()} className={styles.tableRow}>
            <span className={styles.nameCell}>{key.name}</span>
            <span>{key.usage}</span>
            <code>{key.key}</code>
            <div className={styles.optionButtons}>
              <button type="button" onClick={() => onReveal(key)}>
                Reveal
              </button>
              <button
                type="button"
                onClick={() => onCopy(key.key, key.name)}
              >
                Copy
              </button>
              <button type="button" disabled>
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(key.id)}
                aria-label={`Delete ${key.name}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

