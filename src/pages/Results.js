import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, User, Calendar, MapPin, Phone } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatScore, getConfidenceLevel } from '../lib/utils';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        {
          id: 1,
          name: 'John Anderson',
          age: 34,
          location: 'New York, NY',
          lastSeen: '2024-01-15',
          score: 0.89,
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
          status: 'wanted',
          caseNumber: 'NYC-2024-0156',
          charges: ['Armed Robbery', 'Assault'],
          description: 'Suspect in multiple armed robbery cases across Manhattan area.'
        },
        {
          id: 2,
          name: 'Michael Rodriguez',
          age: 28,
          location: 'Brooklyn, NY',
          lastSeen: '2024-01-20',
          score: 0.76,
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
          status: 'person_of_interest',
          caseNumber: 'BRK-2024-0089',
          charges: ['Theft', 'Vandalism'],
          description: 'Person of interest in recent vandalism incidents.'
        },
        {
          id: 3,
          name: 'David Thompson',
          age: 42,
          location: 'Queens, NY',
          lastSeen: '2024-01-10',
          score: 0.68,
          image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
          status: 'missing',
          caseNumber: 'QNS-2024-0034',
          charges: [],
          description: 'Missing person case, last seen in Queens area.'
        }
      ];
      
      setResults(mockResults);
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

  const handleExportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `facial_recognition_results_${new Date().toISOString().split('T')[0]}.json`;
    
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
              <LoadingSpinner size="xl" text="Analyzing facial features and searching database..." />
              <div className="mt-8 space-y-2 text-center">
                <p className="text-sm text-secondary-600">Processing your sketch...</p>
                <p className="text-xs text-secondary-500">This may take a few moments</p>
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
              <ErrorMessage message={error} onRetry={fetchResults} />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-secondary-900">Identification Results</h1>
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

        {/* Results Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">{results.length}</div>
                <div className="text-sm text-secondary-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  {results.filter(r => r.score >= 0.7).length}
                </div>
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
            </div>
          </CardContent>
        </Card>

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
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(result.status)}
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
                        <p className={`text-sm font-medium ${confidence.color}`}>
                          {confidence.level} Confidence
                        </p>
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