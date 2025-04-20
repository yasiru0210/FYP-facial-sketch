// Home.jsx – Main page with sketch upload and sliders, with loading and error handling (no external UI components)

import React, { useState } from 'react';
import SketchUploader from '../components/SketchUploader';
import FeatureSlider from '../components/FeatureSlider';
import { useNavigate } from 'react-router-dom';
import { submitIdentification } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [sketch, setSketch] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [featureWeights, setFeatureWeights] = useState({
    eyes: 50,
    nose: 50,
    mouth: 50,
    eyebrows: 50,
    faceShape: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSliderChange = (feature, value) => {
    setFeatureWeights((prev) => ({ ...prev, [feature]: value }));
  };

  const handleUpload = (file) => {
    setSketch(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!sketch) {
      setError('Please upload a sketch before submitting.');
      return;
    }
    setError(null);
    setLoading(true);
    const success = await submitIdentification(sketch, featureWeights);
    setLoading(false);
    if (success) navigate('/results');
    else setError('Failed to identify. Please try again.');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <SketchUploader onUpload={handleUpload} />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-64 h-64 object-contain rounded border mx-auto"
        />
      )}

      <FeatureSlider weights={featureWeights} onChange={handleSliderChange} />

      {error && <p className="text-red-500 font-medium">{error}</p>}
      {loading ? (
        <p className="text-blue-600 text-center">Processing... Please wait.</p>
      ) : (
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit for Identification
        </button>
      )}
    </div>
  );
}
