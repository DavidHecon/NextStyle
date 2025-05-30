// src/components/ui/dialog.jsx

import React from "react";

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
          aria-label="Cerrar"
        >
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="border-b border-gray-200 pb-2 mb-4">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">
    {children}
  </h2>
);

export const DialogContent = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

export const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4 mt-4">
    {children}
  </div>
);
