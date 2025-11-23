import { FormEvent, useState } from 'react';
import { KeyFormState } from '../types';
import styles from '../page.module.css';

type CreateKeyModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (name: string, limit: number | null) => Promise<void>;
};

export default function CreateKeyModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit
}: CreateKeyModalProps) {
  const [formState, setFormState] = useState<KeyFormState>({
    name: '',
    limitEnabled: false,
    limit: 1000
  });

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim() || isSubmitting) return;

    await onSubmit(
      formState.name.trim(),
      formState.limitEnabled ? formState.limit : null
    );

    // Reset form
    setFormState({ name: '', limitEnabled: false, limit: 1000 });
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h4>Create API Key</h4>
        <p>Enter a name and optional limit for the new key.</p>

        <label className={styles.modalField}>
          <span>Key name</span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="e.g. Billing service"
          />
        </label>

        <label className={styles.limitToggle}>
          <input
            type="checkbox"
            checked={formState.limitEnabled}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                limitEnabled: event.target.checked
              }))
            }
          />
          Limit monthly usage
        </label>

        <label className={styles.modalField}>
          <span>Limit</span>
          <input
            type="number"
            value={formState.limit}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                limit: Number(event.target.value)
              }))
            }
            disabled={!formState.limitEnabled}
          />
        </label>

        <p className={styles.modalNote}>
          *If the combined usage of all keys exceeds your limit, requests will
          be rejected.
        </p>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.createButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

