import React, { useCallback } from 'react';
import { Upload, Image, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { validateImageFile } from '../lib/utils';

export default function SketchUploader({ onUpload, sketch, previewUrl, onRemove }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    onUpload(file);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Upload Facial Sketch</h2>
          {sketch && (
            <button
              onClick={onRemove}
              className="p-2 text-secondary-500 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!sketch ? (
          <div
            className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('sketch-upload').click()}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-secondary-900 mb-1">
                  Drop your sketch here, or click to browse
                </p>
                <p className="text-sm text-secondary-600">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
            <input
              id="sketch-upload"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Uploaded sketch"
                className="w-full max-w-md mx-auto h-80 object-contain rounded-lg border border-secondary-200 bg-secondary-50"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => document.getElementById('sketch-upload').click()}
                  className="opacity-0 group-hover:opacity-100 bg-white text-secondary-700 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Image className="w-4 h-4" />
                  <span>Change Image</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-success-600">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Image uploaded successfully</span>
            </div>
            
            <input
              id="sketch-upload"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        )}

        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-warning-800">
              <p className="font-medium mb-1">Important Guidelines:</p>
              <ul className="space-y-1 text-xs">
                <li>• Use clear, high-contrast sketches for best results</li>
                <li>• Ensure facial features are clearly visible</li>
                <li>• Front-facing sketches work better than profile views</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}