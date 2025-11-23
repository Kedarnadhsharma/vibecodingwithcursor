'use client';

import { useState, FormEvent } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import styles from './page.module.css';

export default function GitHubSummarizerPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      setToast({ message: 'Please enter a GitHub repository URL', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setSummary(null);
    
    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ repoUrl: repoUrl.trim() })
      });

      const data = await response.json();
      
      if (response.ok && data.summary) {
        setSummary(data.summary);

        // Function to create an array of highlights from the summary string
        function extractHighlightsFromSummary(summary: string): string[] {
          // Simple heuristic: split by newline, dash, or numbered lists; fallback to sentences
          if (!summary) return [];
          // Try splitting by lines containing bullet-like markers
          const lines = summary
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

          // Collect lines that look like bullet points, otherwise fallback to all non-empty lines
          const bullets = lines.filter(line =>
            /^[-*•]\s/.test(line) || /^\d+\.\s/.test(line)
          );

          if (bullets.length > 0) {
            // Remove bullet chars for clean display
            return bullets.map(line => line.replace(/^([-*•]|\d+\.)\s*/, '').trim());
          }
          // If no bullets found, fallback to splitting by periods into sentences
          return summary.split('.').map(s => s.trim()).filter(Boolean);
        }

        const highlights = extractHighlightsFromSummary(data.summary);

        // For demonstration, you may store highlights in state for actual rendering elsewhere,
        // or just log them here:
        // setHighlights(highlights);

        setToast({ message: 'Repository summarized successfully', type: 'success' });
      } else {
        setToast({ message: data.message || 'Failed to summarize repository', type: 'error' });
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setToast({ message: 'Failed to summarize repository', type: 'error' });
    } finally {
      setIsProcessing(false);
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
            <p className={styles.breadcrumb}>Pages / GitHub Summarizer</p>
            <h1>GitHub Repository Summarizer</h1>
          </div>
        </header>

        <section className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="repoUrl">GitHub Repository URL</label>
              <input
                id="repoUrl"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className={styles.input}
              />
              <p className={styles.hint}>
                Enter a GitHub repository URL to generate a summary
              </p>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Summarizing...' : 'Summarize Repository'}
            </button>
          </form>

          {summary && (
            <div className={styles.summarySection}>
              <h3>Summary</h3>
              <div className={styles.summaryContent}>
                {summary}
              </div>
            </div>
          )}
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

