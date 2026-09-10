import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast-item">
        {type === 'success' ? (
          <CheckCircle size={16} color="#25D366" />
        ) : (
          <AlertCircle size={16} color="#E5A65E" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
