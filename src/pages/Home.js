import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, TrendingUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SketchUploader from '../components/SketchUploader';
import FeatureSlider from '../components/FeatureSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Card, CardContent } from '../components/ui/card';
import { submitIdentification } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [sketch, setSketch] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [featureWeights, setFeatureWeights] = useState({
    eyes: 60,
    nose: 55,
    mouth: 50,
    eyebrows: 45,
    faceShape: 65,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSliderChange = (feature, value) => {
    setFeatureWeights((prev) => ({ ...prev, [feature]: value }));
  };

  const handleUpload = (file) => {
    setSketch(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleRemoveSketch = () => {
    setSketch(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!sketch) {
      setError('Please upload a facial sketch before submitting.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const success = await submitIdentification(sketch, featureWeights);
      if (success) {
        navigate('/results');
      } else {
        setError('Failed to process identification. Please check your connection and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit();
  };

  const averageConfidence = Math.round(
    Object.values(featureWeights).reduce((sum, val) => sum + val, 0) / Object.values(featureWeights).length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 text-balance">
            Advanced Facial Recognition
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto text-balance">
            Upload a facial sketch and leverage AI-powered identification technology to find potential matches in our secure database.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Precision Matching</h3>
              <p className="text-sm text-secondary-600">Advanced algorithms ensure accurate facial feature comparison</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-secondary-600">Get identification results in seconds, not hours</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-secondary-600">All data is encrypted and handled with maximum security</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Section */}
          <div className="space-y-6">
            <SketchUploader
              onUpload={handleUpload}
              sketch={sketch}
              previewUrl={previewUrl}
              onRemove={handleRemoveSketch}
            />
            
            {sketch && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">Analysis Summary</h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-primary-600">
                        {averageConfidence}% Average Confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Image Quality:</span>
                      <span className="font-medium text-secondary-900">
                        {averageConfidence >= 70 ? 'Excellent' : averageConfidence >= 50 ? 'Good' : 'Fair'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Expected Accuracy:</span>
                      <span className="font-medium text-secondary-900">
                        {averageConfidence >= 70 ? 'High' : averageConfidence >= 50 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Processing Time:</span>
                      <span className="font-medium text-secondary-900">~2-5 seconds</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Feature Weights Section */}
          <div>
            <FeatureSlider weights={featureWeights} onChange={handleSliderChange} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <Card className="border-error-200 bg-error-50">
              <CardContent className="p-6">
                <ErrorMessage message={error} onRetry={loading ? null : handleRetry} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submit Section */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            {loading ? (
              <div className="space-y-4">
                <LoadingSpinner size="xl" text="Processing facial sketch..." />
                <div className="space-y-2">
                  <p className="text-sm text-secondary-600">Analyzing facial features...</p>
                  <p className="text-xs text-secondary-500">This may take a few moments</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary-900">Ready to Identify</h3>
                <p className="text-secondary-600 max-w-2xl mx-auto">
                  Click the button below to start the identification process. Our AI will analyze the uploaded sketch 
                  and search for potential matches in the database.
                </p>
                <button
                  className={`btn-primary text-lg px-8 py-4 ${!sketch ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={!sketch || loading}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Start Identification Process
                </button>
                {!sketch && (
                  <p className="text-sm text-secondary-500">Please upload a sketch first</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}