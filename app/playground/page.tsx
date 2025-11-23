'use client';

import { useState, FormEvent } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import styles from './page.module.css';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setToast({ message: 'Please enter an API key', type: 'error' });
      return;
    }

    setIsValidating(true);
    
    try {
      const response = await fetch('/api/keys/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: apiKey })
      });

      const data = await response.json();
      
      if (data.valid) {
        setToast({ message: 'Valid API Key', type: 'success' });
      } else {
        setToast({ message: 'Invalid API Key', type: 'error' });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setToast({ message: 'Invalid API Key', type: 'error' });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <Sidebar onToggle={(collapsed) => {
        // You can add state here if you need to adjust layout
      }} />
      <main className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <p className={styles.breadcrumb}>Pages / API Playground</p>
            <h1>API Playground</h1>
          </div>
        </header>

        <section className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="apiKey">API Key</label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate API Key'}
            </button>
          </form>
        </section>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </>
  );
}

