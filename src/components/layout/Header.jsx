import React from 'react';
import { Search, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">FaceTrace</h1>
              <p className="text-xs text-secondary-600">Facial Recognition System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-secondary-600">
              <Search className="w-4 h-4" />
              <span>Advanced Identification</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}