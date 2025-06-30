// Enhanced API service with AI integration

import aiService from './aiService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Simulate network delay for realistic experience
const simulateNetworkDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database of profiles with AI-enhanced data
const mockDatabase = [
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
    description: 'Suspect in multiple armed robbery cases across Manhattan area.',
    // AI-enhanced profile data
    features: {
      eyeShape: 'almond',
      noseShape: 'medium',
      mouthShape: 'thin',
      faceShape: 'oval'
    },
    ageGender: {
      age: 34,
      gender: 'male',
      genderProbability: 0.95
    },
    faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1)
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
    description: 'Person of interest in recent vandalism incidents.',
    features: {
      eyeShape: 'round',
      noseShape: 'wide',
      mouthShape: 'full',
      faceShape: 'square'
    },
    ageGender: {
      age: 28,
      gender: 'male',
      genderProbability: 0.92
    },
    faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1)
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
    description: 'Missing person case, last seen in Queens area.',
    features: {
      eyeShape: 'narrow',
      noseShape: 'narrow',
      mouthShape: 'medium',
      faceShape: 'heart'
    },
    ageGender: {
      age: 42,
      gender: 'male',
      genderProbability: 0.88
    },
    faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1)
  },
  {
    id: 4,
    name: 'Sarah Williams',
    age: 29,
    location: 'Manhattan, NY',
    lastSeen: '2024-01-18',
    score: 0.72,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    status: 'missing',
    caseNumber: 'MAN-2024-0078',
    charges: [],
    description: 'Missing person, last seen near Central Park.',
    features: {
      eyeShape: 'almond',
      noseShape: 'narrow',
      mouthShape: 'full',
      faceShape: 'oval'
    },
    ageGender: {
      age: 29,
      gender: 'female',
      genderProbability: 0.96
    },
    faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1)
  },
  {
    id: 5,
    name: 'Robert Chen',
    age: 35,
    location: 'Bronx, NY',
    lastSeen: '2024-01-12',
    score: 0.65,
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    status: 'person_of_interest',
    caseNumber: 'BRX-2024-0045',
    charges: ['Fraud', 'Identity Theft'],
    description: 'Person of interest in financial fraud cases.',
    features: {
      eyeShape: 'narrow',
      noseShape: 'medium',
      mouthShape: 'thin',
      faceShape: 'round'
    },
    ageGender: {
      age: 35,
      gender: 'male',
      genderProbability: 0.91
    },
    faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1)
  }
];

export async function submitIdentification(sketch, weights) {
  try {
    // Initialize AI service
    await aiService.initialize();
    
    // Create image element for AI analysis
    const imageElement = await createImageElement(sketch);
    
    // Perform AI analysis on the sketch
    const sketchAnalysis = await aiService.analyzeSketch(imageElement);
    
    // Store analysis results for later use
    sessionStorage.setItem('sketchAnalysis', JSON.stringify(sketchAnalysis));
    sessionStorage.setItem('featureWeights', JSON.stringify(weights));
    
    // Simulate processing time
    await simulateNetworkDelay(2000);
    
    const formData = new FormData();
    formData.append("sketch", sketch);
    formData.append("weights", JSON.stringify(weights));
    formData.append("aiAnalysis", JSON.stringify(sketchAnalysis));
    
    console.log("AI Analysis Results:", sketchAnalysis);
    console.log("Submitting identification with weights:", weights);
    
    // Simulate potential API failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Simulated API failure");
    }
    
    return true;
    
    // Uncomment below for real API integration:
    /*
    const response = await fetch(`${API_BASE_URL}/identify`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Result from backend:", result);
    return result.success;
    */
    
  } catch (error) {
    console.error("Error submitting identification:", error);
    throw error;
  }
}

export async function fetchResults() {
  try {
    await simulateNetworkDelay(1500);
    
    // Get stored analysis data
    const sketchAnalysisData = sessionStorage.getItem('sketchAnalysis');
    const featureWeightsData = sessionStorage.getItem('featureWeights');
    
    let enhancedResults = [...mockDatabase];
    
    if (sketchAnalysisData && featureWeightsData) {
      const sketchAnalysis = JSON.parse(sketchAnalysisData);
      const weights = JSON.parse(featureWeightsData);
      
      // Use AI to enhance matching
      const aiWeights = {
        features: 0.4,
        descriptor: 0.4,
        ageGender: 0.2
      };
      
      enhancedResults = await aiService.enhanceMatchingWithAI(
        sketchAnalysis,
        mockDatabase,
        aiWeights
      );
      
      // Update scores with AI-enhanced scores
      enhancedResults = enhancedResults.map(result => ({
        ...result,
        score: result.aiScore || result.score,
        aiEnhanced: true
      }));
    }
    
    // Sort by score and return top matches
    return enhancedResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Return top 8 matches
    
    // Uncomment below for real API integration:
    /*
    const response = await fetch(`${API_BASE_URL}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    */
    
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

export async function getAIInsights() {
  try {
    const sketchAnalysisData = sessionStorage.getItem('sketchAnalysis');
    
    if (!sketchAnalysisData) {
      return null;
    }
    
    const sketchAnalysis = JSON.parse(sketchAnalysisData);
    const results = await fetchResults();
    
    // Generate AI insights
    const insights = await aiService.generateInsights(sketchAnalysis, results);
    
    return {
      sketchAnalysis,
      insights
    };
    
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return null;
  }
}

// Helper function to create image element from file
function createImageElement(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Health check function
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

// AI service health check
export async function checkAIHealth() {
  try {
    await aiService.initialize();
    return aiService.isInitialized;
  } catch (error) {
    console.error("AI service health check failed:", error);
    return false;
  }
}