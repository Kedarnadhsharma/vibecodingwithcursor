import { useEffect, useState } from 'react';
import { ApiKey, ToastMessage } from '../types';

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/keys');
        if (!response.ok) {
          throw new Error('Unable to load API keys');
        }

        const data: ApiKey[] = await response.json();
        setKeys(data);
        setErrorText(null);
      } catch (error) {
        setErrorText((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const createKey = async (name: string, limit: number | null): Promise<ApiKey> => {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, limit })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create key');
    }

    const createdKey: ApiKey = await response.json();
    setKeys((prev) => [...prev, createdKey]);
    return createdKey;
  };

  const deleteKey = async (id: string) => {
    const previous = keys;
    setKeys((prev) => prev.filter((key) => key.id !== id));

    try {
      const response = await fetch('/api/keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete key');
      }
      setToast({ message: 'API Key deleted successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      setKeys(previous);
      setToast({ message: 'Failed to delete key', type: 'error' });
    }
  };

  const copyKey = async (keyValue: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setToast({ message: 'Copied API Key to clipboard', type: 'success' });
    } catch (error) {
      console.error('[copyKey] Error:', error);
      setToast({ message: 'Failed to copy to clipboard', type: 'error' });
    }
  };

  return {
    keys,
    isLoading,
    errorText,
    toast,
    setToast,
    createKey,
    deleteKey,
    copyKey
  };
}

