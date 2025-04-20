// SketchUploader.jsx

import React from 'react';

export default function SketchUploader({ onUpload }) {
  const handleChange = (e) => {
    onUpload(e.target.files[0]);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Upload Facial Sketch</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
