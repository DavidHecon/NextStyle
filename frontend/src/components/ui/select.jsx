// src/components/ui/select.jsx

import React from 'react';

export function Select({ children, value, onValueChange, ...props }) {
  // Puedes usar un select nativo o hacer uno personalizado; aquí simplifico con div
  return (
    <div {...props} className="relative inline-block w-full">
      {children}
    </div>
  );
}

export function SelectTrigger({ children }) {
  return (
    <button type="button" className="w-full px-3 py-2 border rounded bg-white text-left">
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  // Aquí puedes mostrar valor o placeholder, pero como ejemplo solo placeholder
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return (
    <div className="absolute mt-1 w-full bg-white border rounded shadow-md z-10">
      {children}
    </div>
  );
}

export function SelectItem({ children, value }) {
  return (
    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100" data-value={value}>
      {children}
    </div>
  );
}
