import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-error-600" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-secondary-900">Something went wrong</h3>
        <p className="text-sm text-secondary-600 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}