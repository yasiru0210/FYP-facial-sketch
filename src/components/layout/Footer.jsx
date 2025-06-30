import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">FaceTrace</h3>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed">
              Advanced facial recognition technology for law enforcement and security applications.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Security Features</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Privacy protection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure data handling</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-400">Database</span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-success-400">Online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-400">Recognition Engine</span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-success-400">Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-sm text-secondary-400">
          <p>&copy; 2025 FaceTrace. All rights reserved. For authorized use only.</p>
        </div>
      </div>
    </footer>
  );
}