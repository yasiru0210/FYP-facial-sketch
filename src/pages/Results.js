import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, User, Calendar, MapPin, Phone, Brain, Zap } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatScore, getConfidenceLevel } from '../lib/utils';
import { fetchResults, getAIInsights } from '../services/api';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    fetchResultsData();
  }, []);

  const fetchResultsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both results and AI insights
      const [resultsData, aiInsights] = await Promise.all([
        fetchResults(),
        getAIInsights()
      ]);
      
      setResults(resultsData);
      setAiData(aiInsights);
      
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load identification results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      wanted: { color: 'bg-error-100 text-error-700 border-error-200', icon: AlertTriangle, text: 'Wanted' },
      person_of_interest: { color: 'bg-warning-100 text-warning-700 border-warning-200', icon: User, text: 'Person of Interest' },
      missing: { color: 'bg-primary-100 text-primary-700 border-primary-200', icon: User, text: 'Missing Person' }
    };
    
    const config = statusConfig[status] || statusConfig.person_of_interest;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span>{config.text}</span>
      </span>
    );
  };

  const getAIEnhancementBadge = (result) => {
    if (result.aiEnhanced) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
          <Brain className="w-3 h-3" />
          <span>AI Enhanced</span>
        </span>
      );
    }
    return null;
  };

  const handleExportResults = () => {
    const exportData = {
      results,
      aiAnalysis: aiData?.sketchAnalysis,
      insights: aiData?.insights,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ai_facial_recognition_results_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50/30">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-16">
              <LoadingSpinner size="xl" text="AI is analyzing facial features and searching database..." />
              <div className="mt-8 space-y-2 text-center">
                <p className="text-sm text-secondary-600">Processing with machine learning algorithms...</p>
                <p className="text-xs text-secondary-500">Enhanced matching in progress</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50/30">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-16">
              <ErrorMessage message={error} onRetry={fetchResultsData} />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const aiEnhancedCount = results.filter(r => r.aiEnhanced).length;
  const highConfidenceCount = results.filter(r => r.score >= 0.7).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>
            <div className="h-6 w-px bg-secondary-300"></div>
            <h1 className="text-2xl font-bold text-secondary-900">AI-Enhanced Results</h1>
            {aiData && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                <Brain className="w-4 h-4" />
                <span>AI Powered</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportResults}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">{results.length}</div>
                <div className="text-sm text-secondary-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{highConfidenceCount}</div>
                <div className="text-sm text-secondary-600">High Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {results.filter(r => r.status === 'wanted').length}
                </div>
                <div className="text-sm text-secondary-600">Wanted Persons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {results.filter(r => r.status === 'missing').length}
                </div>
                <div className="text-sm text-secondary-600">Missing Persons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{aiEnhancedCount}</div>
                <div className="text-sm text-secondary-600">AI Enhanced</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        {aiData?.insights && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sketch Quality */}
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Sketch Quality Assessment</h4>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {aiData.insights.sketchQuality?.level || 'Good'}
                      </span>
                      <span className="text-sm text-secondary-600">
                        {Math.round((aiData.sketchAnalysis?.qualityScore || 0.7) * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-secondary-600">
                      {aiData.insights.sketchQuality?.description || 'Quality assessment complete'}
                    </p>
                  </div>
                </div>

                {/* Matching Strategy */}
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">AI Recommendations</h4>
                  <div className="space-y-1">
                    {(aiData.insights.recommendations || ['AI analysis complete']).slice(0, 3).map((rec, index) => (
                      <div key={index} className="text-xs text-secondary-600 flex items-start space-x-1">
                        <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {results.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Matches Found</h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                No potential matches were found in the database. Try adjusting the feature confidence levels or uploading a different sketch.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((result) => {
              const confidence = getConfidenceLevel(result.score);
              
              return (
                <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="relative">
                    <img
                      src={result.image}
                      alt={`Match for ${result.name}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 space-y-2">
                      {getStatusBadge(result.status)}
                      {getAIEnhancementBadge(result)}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm ${confidence.color}`}>
                        {formatScore(result.score)} Match
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                          {result.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium ${confidence.color}`}>
                            {confidence.level} Confidence
                          </p>
                          {result.aiEnhanced && (
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                              AI Enhanced
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-secondary-600">
                          <User className="w-4 h-4" />
                          <span>Age: {result.age}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-secondary-600">
                          <MapPin className="w-4 h-4" />
                          <span>{result.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-secondary-600">
                          <Calendar className="w-4 h-4" />
                          <span>Last seen: {new Date(result.lastSeen).toLocaleDateString()}</span>
                        </div>
                        {result.caseNumber && (
                          <div className="flex items-center space-x-2 text-secondary-600">
                            <Phone className="w-4 h-4" />
                            <span>Case: {result.caseNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* AI Match Details */}
                      {result.matchDetails && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="text-xs font-medium text-purple-900 mb-2">AI Analysis</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {result.matchDetails.featureMatch !== null && (
                              <div>
                                <span className="text-purple-600">Features:</span>
                                <span className="ml-1 font-medium">
                                  {Math.round(result.matchDetails.featureMatch * 100)}%
                                </span>
                              </div>
                            )}
                            {result.matchDetails.descriptorMatch !== null && (
                              <div>
                                <span className="text-purple-600">Facial:</span>
                                <span className="ml-1 font-medium">
                                  {Math.round(result.matchDetails.descriptorMatch * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {result.charges && result.charges.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-secondary-900 mb-2">Charges:</h4>
                          <div className="flex flex-wrap gap-1">
                            {result.charges.map((charge, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-error-100 text-error-700 text-xs rounded-full"
                              >
                                {charge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.description && (
                        <div>
                          <h4 className="text-sm font-medium text-secondary-900 mb-1">Description:</h4>
                          <p className="text-xs text-secondary-600 leading-relaxed">
                            {result.description}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-secondary-200">
                        <button className="w-full btn-primary text-sm py-2">
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}