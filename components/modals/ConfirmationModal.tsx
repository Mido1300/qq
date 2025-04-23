'use client';

import ModalWrapper from './ModalWrapper';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmStyle?: 'primary' | 'danger';
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText = 'Confirm',
  confirmStyle = 'primary'
}: ConfirmationModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
      
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            confirmStyle === 'danger' 
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
              : 'bg-primary hover:bg-opacity-90 focus:ring-primary'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {confirmText}
        </button>
      </div>
    </ModalWrapper>
  );
}