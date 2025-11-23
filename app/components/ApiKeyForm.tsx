import styles from '../page.module.css';

const scopes = ['read:payments', 'write:payments', 'read:users', 'write:users'];

export default function ApiKeyForm() {
  return (
    <div className={styles.keyPanel}>
      <h2>Create a new API key</h2>
      <p>
        Provide a label, select an environment, and choose scopes to create a
        scoped credential. This mirrors a typical POST /api/keys call.
      </p>
      <form className={styles.keyForm}>
        <label className={styles.formGroup}>
          <span>Key label</span>
          <input type="text" placeholder="e.g. Billing service" />
        </label>
        <label className={styles.formGroup}>
          <span>Environment</span>
          <select defaultValue="production">
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </select>
        </label>
        <label className={styles.formGroup}>
          <span>Scopes</span>
          <div className={styles.scopeGrid}>
            {scopes.map((scope) => (
              <label key={scope} className={styles.scopeItem}>
                <input type="checkbox" /> {scope}
              </label>
            ))}
          </div>
        </label>
        <label className={styles.formGroup}>
          <span>Description</span>
          <textarea rows={3} placeholder="Optional context for teammates" />
        </label>
        <div className={styles.formActions}>
          <button type="button">Save draft</button>
          <button type="submit" className={styles.submitButton}>
            Create key
          </button>
        </div>
      </form>
    </div>
  );
}

