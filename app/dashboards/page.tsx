'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import DashboardHeader from './components/DashboardHeader';
import PlanCard from './components/PlanCard';
import ApiKeysTable from './components/ApiKeysTable';
import CreateKeyModal from './components/CreateKeyModal';
import RevealKeyModal from './components/RevealKeyModal';
import { useApiKeys } from './hooks/useApiKeys';
import { ApiKey, ModalMode } from './types';
import styles from './page.module.css';

export default function DashboardsPage() {
  const {
    keys,
    isLoading,
    errorText,
    toast,
    setToast,
    createKey,
    deleteKey,
    copyKey
  } = useApiKeys();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedKey(null);
    setModalOpen(true);
  };

  const openRevealModal = (key: ApiKey) => {
    setSelectedKey(key);
    setModalMode('reveal');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedKey(null);
    setSubmitting(false);
  };

  const handleCreateKey = async (name: string, limit: number | null) => {
    try {
      setSubmitting(true);
      await createKey(name, limit);
      setToast({ message: 'API Key created successfully', type: 'success' });
      closeModal();
    } catch (error) {
      console.error('[handleCreateKey] Error:', error);
      setToast({ message: (error as Error).message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar onToggle={(collapsed) => {
        // You can add state here if you need to adjust layout
      }} />
      <main className={styles.wrapper}>
        <DashboardHeader />
        <PlanCard />
        <ApiKeysTable
          keys={keys}
          isLoading={isLoading}
          errorText={errorText}
          onReveal={openRevealModal}
          onCopy={copyKey}
          onDelete={deleteKey}
          onAddKey={openCreateModal}
        />
        <CreateKeyModal
          isOpen={isModalOpen && modalMode === 'create'}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleCreateKey}
        />
        <RevealKeyModal
          isOpen={isModalOpen && modalMode === 'reveal'}
          apiKey={selectedKey}
          onClose={closeModal}
        />
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

