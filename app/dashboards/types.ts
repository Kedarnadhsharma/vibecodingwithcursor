export type ApiKey = {
  id: string;
  name: string;
  usage: number;
  key: string;
  limit: number | null;
};

export type ModalMode = 'create' | 'reveal' | null;

export type ToastMessage = {
  message: string;
  type: 'success' | 'error' | 'info';
};

export type KeyFormState = {
  name: string;
  limitEnabled: boolean;
  limit: number;
};

