"use client";
import React, { useState } from "react";
import CustomModal from "./customModal";
import LoadingSpinner from "./loadingSpinner";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => Promise<void>;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onRequestClose={isLoading ? () => {} : onRequestClose}>
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] flex flex-col items-center text-center shadow-xl">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D92D20"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to log out? You will need to sign in again to access your account.
        </p>
        <div className="flex w-full gap-3">
          <button
            onClick={onRequestClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[#D92D20] text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-h-[44px]"
          >
            {isLoading ? <LoadingSpinner size={20} color="#ffffff" /> : "Logout"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default LogoutConfirmationModal;
