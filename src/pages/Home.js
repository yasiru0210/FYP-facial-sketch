import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, TrendingUp, Brain } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SketchUploader from '../components/SketchUploader';
import FeatureSlider from '../components/FeatureSlider';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Card, CardContent } from '../components/ui/card';
import { submitIdentification, getAIInsights } from '../services/api';
import aiService from '../services/aiService';

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
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [sketchAnalysis, setSketchAnalysis] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    // Initialize AI service on component mount
    aiService.initialize().catch(console.error);
  }, []);

  const handleSliderChange = (feature, value) => {
    setFeatureWeights((prev) => ({ ...prev, [feature]: value }));
  };

  const handleUpload = async (file) => {
    setSketch(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    
    // Start AI analysis
    setAiAnalyzing(true);
    try {
      await aiService.initialize();
      
      // Create image element for analysis
      const img = new Image();
      img.onload = async () => {
        try {
          const analysis = await aiService.analyzeSketch(img);
          setSketchAnalysis(analysis);
          
          // Generate insights
          const insights = await aiService.generateInsights(analysis, []);
          setAiInsights(insights);
        } catch (error) {
          console.error('AI analysis failed:', error);
          setError('AI analysis failed. The system will use manual settings.');
        } finally {
          setAiAnalyzing(false);
        }
      };
      img.onerror = () => {
        setAiAnalyzing(false);
        setError('Failed to load image for AI analysis.');
      };
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('AI initialization failed:', error);
      setAiAnalyzing(false);
      setError('AI system unavailable. Using manual analysis mode.');
    }
  };

  const handleRemoveSketch = () => {
    setSketch(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSketchAnalysis(null);
    setAiInsights(null);
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

  const getAIConfidenceBoost = () => {
    if (!sketchAnalysis) return 0;
    return Math.round(sketchAnalysis.qualityScore * 30); // Up to 30% boost
  };

  const totalConfidence = Math.min(100, averageConfidence + getAIConfidenceBoost());

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 text-balance">
            AI-Powered Facial Recognition
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto text-balance">
            Upload a facial sketch and leverage advanced AI technology to find potential matches with enhanced accuracy and intelligent analysis.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">AI Enhanced</h3>
              <p className="text-sm text-secondary-600">Machine learning improves accuracy with every analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <SketchUploader
              onUpload={handleUpload}
              sketch={sketch}
              previewUrl={previewUrl}
              onRemove={handleRemoveSketch}
            />
            
            <FeatureSlider weights={featureWeights} onChange={handleSliderChange} />
            
            {sketch && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">Analysis Summary</h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-primary-600">
                        {totalConfidence}% Total Confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Manual Settings:</span>
                      <span className="font-medium text-secondary-900">{averageConfidence}%</span>
                    </div>
                    {sketchAnalysis && (
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">AI Enhancement:</span>
                        <span className="font-medium text-success-600">+{getAIConfidenceBoost()}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Image Quality:</span>
                      <span className="font-medium text-secondary-900">
                        {sketchAnalysis 
                          ? (sketchAnalysis.qualityScore >= 0.7 ? 'Excellent' : 
                             sketchAnalysis.qualityScore >= 0.5 ? 'Good' : 'Fair')
                          : (averageConfidence >= 70 ? 'Excellent' : averageConfidence >= 50 ? 'Good' : 'Fair')
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Expected Accuracy:</span>
                      <span className="font-medium text-secondary-900">
                        {totalConfidence >= 80 ? 'Very High' : totalConfidence >= 60 ? 'High' : totalConfidence >= 40 ? 'Medium' : 'Low'}
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

          {/* AI Analysis Panel */}
          <div className="lg:col-span-1">
            <AIAnalysisPanel 
              sketchAnalysis={sketchAnalysis}
              insights={aiInsights}
              isAnalyzing={aiAnalyzing}
            />
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
                <LoadingSpinner size="xl" text="Processing with AI enhancement..." />
                <div className="space-y-2">
                  <p className="text-sm text-secondary-600">Analyzing facial features with machine learning...</p>
                  <p className="text-xs text-secondary-500">AI is enhancing match accuracy</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary-900">Ready for AI-Enhanced Identification</h3>
                <p className="text-secondary-600 max-w-2xl mx-auto">
                  Click the button below to start the AI-powered identification process. Our advanced machine learning 
                  algorithms will analyze the uploaded sketch and search for potential matches with enhanced accuracy.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    className={`btn-primary text-lg px-8 py-4 ${!sketch ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={!sketch || loading}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start AI Identification
                  </button>
                  {sketchAnalysis && (
                    <div className="text-sm text-success-600 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>AI Analysis Complete</span>
                    </div>
                  )}
                </div>
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