import { ApiKey } from '../types';
import styles from '../page.module.css';

type RevealKeyModalProps = {
  isOpen: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
};

export default function RevealKeyModal({
  isOpen,
  apiKey,
  onClose
}: RevealKeyModalProps) {
  if (!isOpen || !apiKey) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h4>API Key</h4>

        <label className={styles.modalField}>
          <span>Key value</span>
          <input type="text" value={apiKey.key} readOnly />
        </label>

        <div className={styles.modalActions}>
          <button type="button" className={styles.createButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

