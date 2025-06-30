import React, { useState, useEffect } from 'react';
import { Brain, Eye, Zap, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LoadingSpinner from './LoadingSpinner';

export default function AIAnalysisPanel({ sketchAnalysis, insights, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState('overview');

  const getQualityColor = (level) => {
    switch (level) {
      case 'excellent': return 'text-success-600 bg-success-50 border-success-200';
      case 'good': return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'fair': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'poor': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-secondary-600 bg-secondary-50 border-secondary-200';
    }
  };

  const getConfidenceIcon = (level) => {
    switch (level) {
      case 'very_high': return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-primary-600" />;
      case 'medium': return <Info className="w-4 h-4 text-warning-600" />;
      case 'low': return <AlertCircle className="w-4 h-4 text-warning-600" />;
      case 'very_low': return <AlertCircle className="w-4 h-4 text-error-600" />;
      default: return <Info className="w-4 h-4 text-secondary-600" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-8">
          <LoadingSpinner size="lg" text="AI is analyzing the sketch..." />
          <div className="mt-4 space-y-2 text-center">
            <p className="text-sm text-secondary-600">Detecting facial features...</p>
            <p className="text-xs text-secondary-500">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sketchAnalysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">AI Analysis Ready</h3>
          <p className="text-secondary-600">Upload a sketch to begin AI-powered analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary-600" />
          <span>AI Analysis Results</span>
        </CardTitle>
        
        <div className="flex space-x-1 bg-secondary-100 rounded-lg p-1">
          {['overview', 'features', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quality Assessment */}
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Sketch Quality</h4>
              <div className={`p-4 rounded-lg border ${getQualityColor(insights?.sketchQuality?.level || 'fair')}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {insights?.sketchQuality?.level?.charAt(0).toUpperCase() + insights?.sketchQuality?.level?.slice(1) || 'Fair'}
                  </span>
                  <span className="text-sm">
                    {Math.round((sketchAnalysis.qualityScore || 0.5) * 100)}%
                  </span>
                </div>
                <p className="text-sm mb-2">
                  {insights?.sketchQuality?.description || 'Quality assessment in progress'}
                </p>
                {insights?.sketchQuality?.factors && (
                  <ul className="text-xs space-y-1">
                    {insights.sketchQuality.factors.map((factor, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Detection Confidence */}
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Detection Confidence</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Eye className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium">Face Detection</span>
                  </div>
                  <div className="text-lg font-bold text-secondary-900">
                    {Math.round((sketchAnalysis.confidence || 0.5) * 100)}%
                  </div>
                </div>
                
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-success-600" />
                    <span className="text-sm font-medium">Feature Clarity</span>
                  </div>
                  <div className="text-lg font-bold text-secondary-900">
                    {Math.round((sketchAnalysis.qualityScore || 0.5) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Age and Gender */}
            {sketchAnalysis.ageGender && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Estimated Demographics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <div className="text-sm text-primary-600 mb-1">Estimated Age</div>
                    <div className="text-lg font-bold text-primary-900">
                      {sketchAnalysis.ageGender.age} years
                    </div>
                  </div>
                  
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <div className="text-sm text-primary-600 mb-1">Gender</div>
                    <div className="text-lg font-bold text-primary-900 capitalize">
                      {sketchAnalysis.ageGender.gender}
                    </div>
                    <div className="text-xs text-primary-600">
                      {Math.round(sketchAnalysis.ageGender.genderProbability * 100)}% confidence
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            {/* Facial Features */}
            {sketchAnalysis.features && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Detected Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(sketchAnalysis.features).map(([feature, value]) => {
                    if (feature === 'dominantExpression') return null;
                    
                    return (
                      <div key={feature} className="p-3 bg-secondary-50 rounded-lg">
                        <div className="text-sm text-secondary-600 mb-1 capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-base font-medium text-secondary-900 capitalize">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Facial Landmarks */}
            {sketchAnalysis.landmarks && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Facial Measurements</h4>
                <div className="space-y-3">
                  {Object.entries(sketchAnalysis.landmarks).map(([measurement, value]) => (
                    <div key={measurement} className="flex justify-between items-center p-2 bg-secondary-50 rounded">
                      <span className="text-sm text-secondary-600 capitalize">
                        {measurement.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-medium text-secondary-900">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expression Analysis */}
            {sketchAnalysis.expressions && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Expression Analysis</h4>
                <div className="space-y-2">
                  {Object.entries(sketchAnalysis.expressions)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([expression, confidence]) => (
                      <div key={expression} className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600 capitalize">{expression}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 transition-all duration-300"
                              style={{ width: `${confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-secondary-500 w-10 text-right">
                            {Math.round(confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Matching Strategy */}
            {insights?.matchingStrategy && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Recommended Strategy</h4>
                <div className="space-y-2">
                  {insights.matchingStrategy.map((strategy, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-primary-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-primary-800">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Factors */}
            {insights?.confidenceFactors && insights.confidenceFactors.length > 0 && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Confidence Factors</h4>
                <div className="space-y-2">
                  {insights.confidenceFactors.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-success-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-success-800">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights?.recommendations && insights.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-warning-50 rounded-lg">
                      <Info className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-warning-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}