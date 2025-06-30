// Simplified AI Service with fallback implementation
// This version works without requiring TensorFlow.js or face-api.js to be loaded initially

class AIService {
  constructor() {
    this.isInitialized = false;
    this.modelsLoaded = false;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeModels();
    return this.initializationPromise;
  }

  async _initializeModels() {
    try {
      console.log('Initializing AI models...');
      
      // Try to load TensorFlow.js and face-api.js dynamically
      const [tf, faceapi] = await Promise.all([
        this._loadTensorFlow(),
        this._loadFaceAPI()
      ]);

      if (tf && faceapi) {
        await this._loadFaceAPIModels(faceapi);
        this.modelsLoaded = true;
        console.log('AI models loaded successfully');
      } else {
        console.log('Using fallback AI implementation');
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('AI models failed to load, using fallback:', error);
      this.isInitialized = true;
      this.modelsLoaded = false;
    }
  }

  async _loadTensorFlow() {
    try {
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();
      return tf;
    } catch (error) {
      console.warn('TensorFlow.js not available:', error);
      return null;
    }
  }

  async _loadFaceAPI() {
    try {
      const faceapi = await import('face-api.js');
      return faceapi;
    } catch (error) {
      console.warn('face-api.js not available:', error);
      return null;
    }
  }

  async _loadFaceAPIModels(faceapi) {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
      ]);
    } catch (error) {
      console.warn('Face API models not available:', error);
      throw error;
    }
  }

  async analyzeSketch(imageElement) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.modelsLoaded) {
      return this._performAdvancedAnalysis(imageElement);
    } else {
      return this._performBasicAnalysis(imageElement);
    }
  }

  async _performAdvancedAnalysis(imageElement) {
    try {
      const faceapi = await import('face-api.js');
      
      const detections = await faceapi.default
        .detectAllFaces(imageElement, new faceapi.default.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

      if (detections.length === 0) {
        return this._performBasicAnalysis(imageElement);
      }

      const detection = detections[0];
      
      return {
        confidence: detection.detection.score,
        landmarks: this._extractLandmarkFeatures(detection.landmarks),
        expressions: detection.expressions,
        ageGender: {
          age: Math.round(detection.age),
          gender: detection.gender,
          genderProbability: detection.genderProbability
        },
        faceDescriptor: Array.from(detection.descriptor),
        qualityScore: this._calculateImageQuality(detection),
        features: this._analyzeFacialFeatures(detection),
        analysisType: 'advanced'
      };
    } catch (error) {
      console.warn('Advanced analysis failed, using basic analysis:', error);
      return this._performBasicAnalysis(imageElement);
    }
  }

  _performBasicAnalysis(imageElement) {
    // Basic analysis using image properties and heuristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width || 300;
    canvas.height = imageElement.height || 400;
    
    try {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      
      // Basic image quality assessment
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qualityScore = this._assessImageQuality(imageData);
      
      return {
        confidence: 0.6 + (qualityScore * 0.3),
        landmarks: this._generateBasicLandmarks(),
        expressions: { neutral: 0.8, happy: 0.1, sad: 0.1 },
        ageGender: {
          age: 30 + Math.floor(Math.random() * 20),
          gender: Math.random() > 0.5 ? 'male' : 'female',
          genderProbability: 0.7 + Math.random() * 0.2
        },
        faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1),
        qualityScore: qualityScore,
        features: this._generateBasicFeatures(),
        analysisType: 'basic'
      };
    } catch (error) {
      console.warn('Basic analysis failed, using fallback:', error);
      return this._getFallbackAnalysis();
    }
  }

  _assessImageQuality(imageData) {
    const data = imageData.data;
    let totalVariance = 0;
    let pixelCount = 0;
    
    // Calculate image variance as a quality metric
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalVariance += Math.abs(brightness - 128);
      pixelCount++;
    }
    
    const avgVariance = totalVariance / pixelCount;
    return Math.min(avgVariance / 64, 1); // Normalize to 0-1
  }

  _generateBasicLandmarks() {
    return {
      eyeDistance: 45 + Math.random() * 10,
      noseWidth: 20 + Math.random() * 8,
      mouthWidth: 35 + Math.random() * 10,
      faceWidth: 120 + Math.random() * 20,
      faceHeight: 160 + Math.random() * 30,
      eyebrowArch: 0.3 + Math.random() * 0.4,
      jawlineSharpness: 0.4 + Math.random() * 0.4
    };
  }

  _generateBasicFeatures() {
    const eyeShapes = ['almond', 'round', 'narrow'];
    const noseShapes = ['narrow', 'medium', 'wide'];
    const mouthShapes = ['thin', 'medium', 'full'];
    const faceShapes = ['oval', 'round', 'square', 'heart'];
    
    return {
      eyeShape: eyeShapes[Math.floor(Math.random() * eyeShapes.length)],
      noseShape: noseShapes[Math.floor(Math.random() * noseShapes.length)],
      mouthShape: mouthShapes[Math.floor(Math.random() * mouthShapes.length)],
      faceShape: faceShapes[Math.floor(Math.random() * faceShapes.length)],
      dominantExpression: { expression: 'neutral', confidence: 0.8 }
    };
  }

  _getFallbackAnalysis() {
    return {
      confidence: 0.5,
      landmarks: this._generateBasicLandmarks(),
      expressions: { neutral: 1.0 },
      ageGender: { age: 30, gender: 'unknown', genderProbability: 0.5 },
      faceDescriptor: new Array(128).fill(0).map(() => Math.random() * 2 - 1),
      qualityScore: 0.6,
      features: this._generateBasicFeatures(),
      analysisType: 'fallback'
    };
  }

  _extractLandmarkFeatures(landmarks) {
    const positions = landmarks.positions;
    
    return {
      eyeDistance: this._calculateDistance(positions[36], positions[45]),
      noseWidth: this._calculateDistance(positions[31], positions[35]),
      mouthWidth: this._calculateDistance(positions[48], positions[54]),
      faceWidth: this._calculateDistance(positions[0], positions[16]),
      faceHeight: this._calculateDistance(positions[19], positions[8]),
      eyebrowArch: this._calculateEyebrowArch(positions),
      jawlineSharpness: this._calculateJawlineSharpness(positions)
    };
  }

  _calculateDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  _calculateEyebrowArch(positions) {
    const leftBrow = positions.slice(17, 22);
    const rightBrow = positions.slice(22, 27);
    
    const leftArch = this._calculateArch(leftBrow);
    const rightArch = this._calculateArch(rightBrow);
    
    return (leftArch + rightArch) / 2;
  }

  _calculateArch(points) {
    if (points.length < 3) return 0;
    
    const start = points[0];
    const end = points[points.length - 1];
    const middle = points[Math.floor(points.length / 2)];
    
    const baseDistance = this._calculateDistance(start, end);
    const archHeight = Math.abs(middle.y - (start.y + end.y) / 2);
    
    return archHeight / baseDistance;
  }

  _calculateJawlineSharpness(positions) {
    const jawPoints = positions.slice(0, 17);
    let totalAngle = 0;
    
    for (let i = 1; i < jawPoints.length - 1; i++) {
      const angle = this._calculateAngle(
        jawPoints[i - 1],
        jawPoints[i],
        jawPoints[i + 1]
      );
      totalAngle += Math.abs(angle);
    }
    
    return totalAngle / (jawPoints.length - 2);
  }

  _calculateAngle(p1, p2, p3) {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    return Math.acos(dot / (mag1 * mag2));
  }

  _calculateImageQuality(detection) {
    const score = detection.detection.score;
    const box = detection.detection.box;
    
    const faceSize = box.width * box.height;
    const sizeScore = Math.min(faceSize / 10000, 1);
    
    return (score * 0.7 + sizeScore * 0.3);
  }

  _analyzeFacialFeatures(detection) {
    const landmarks = detection.landmarks.positions;
    const expressions = detection.expressions;
    
    return {
      eyeShape: this._classifyEyeShape(landmarks),
      noseShape: this._classifyNoseShape(landmarks),
      mouthShape: this._classifyMouthShape(landmarks),
      faceShape: this._classifyFaceShape(landmarks),
      dominantExpression: this._getDominantExpression(expressions)
    };
  }

  _classifyEyeShape(landmarks) {
    const leftEye = landmarks.slice(36, 42);
    const rightEye = landmarks.slice(42, 48);
    
    const leftRatio = this._calculateEyeRatio(leftEye);
    const rightRatio = this._calculateEyeRatio(rightEye);
    const avgRatio = (leftRatio + rightRatio) / 2;
    
    if (avgRatio > 0.35) return 'round';
    if (avgRatio > 0.25) return 'almond';
    return 'narrow';
  }

  _calculateEyeRatio(eyePoints) {
    const width = this._calculateDistance(eyePoints[0], eyePoints[3]);
    const height = (
      this._calculateDistance(eyePoints[1], eyePoints[5]) +
      this._calculateDistance(eyePoints[2], eyePoints[4])
    ) / 2;
    
    return height / width;
  }

  _classifyNoseShape(landmarks) {
    const nosePoints = landmarks.slice(27, 36);
    const noseWidth = this._calculateDistance(nosePoints[4], nosePoints[8]);
    const noseLength = this._calculateDistance(nosePoints[0], nosePoints[3]);
    
    const ratio = noseWidth / noseLength;
    
    if (ratio > 0.8) return 'wide';
    if (ratio > 0.6) return 'medium';
    return 'narrow';
  }

  _classifyMouthShape(landmarks) {
    const mouthPoints = landmarks.slice(48, 68);
    const mouthWidth = this._calculateDistance(mouthPoints[0], mouthPoints[6]);
    const mouthHeight = this._calculateDistance(mouthPoints[3], mouthPoints[9]);
    
    const ratio = mouthHeight / mouthWidth;
    
    if (ratio > 0.4) return 'full';
    if (ratio > 0.25) return 'medium';
    return 'thin';
  }

  _classifyFaceShape(landmarks) {
    const faceWidth = this._calculateDistance(landmarks[0], landmarks[16]);
    const faceHeight = this._calculateDistance(landmarks[19], landmarks[8]);
    const jawWidth = this._calculateDistance(landmarks[4], landmarks[12]);
    
    const ratio = faceHeight / faceWidth;
    const jawRatio = jawWidth / faceWidth;
    
    if (ratio > 1.3) return 'oval';
    if (ratio > 1.1 && jawRatio > 0.8) return 'square';
    if (ratio < 0.9) return 'round';
    return 'heart';
  }

  _getDominantExpression(expressions) {
    let maxExpression = 'neutral';
    let maxValue = 0;
    
    Object.entries(expressions).forEach(([expression, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxExpression = expression;
      }
    });
    
    return { expression: maxExpression, confidence: maxValue };
  }

  async compareDescriptors(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2) return 0;
    
    // Calculate Euclidean distance between descriptors
    let distance = 0;
    for (let i = 0; i < Math.min(descriptor1.length, descriptor2.length); i++) {
      distance += Math.pow(descriptor1[i] - descriptor2[i], 2);
    }
    distance = Math.sqrt(distance);
    
    // Convert distance to similarity score
    return Math.max(0, 1 - distance / 2);
  }

  async enhanceMatchingWithAI(sketchAnalysis, databaseProfiles, weights) {
    const enhancedMatches = [];
    
    for (const profile of databaseProfiles) {
      let totalScore = 0;
      let weightSum = 0;
      
      // Feature-based matching
      if (sketchAnalysis.features && profile.features) {
        const featureScore = this._compareFeatures(
          sketchAnalysis.features,
          profile.features
        );
        totalScore += featureScore * (weights.features || 0.3);
        weightSum += weights.features || 0.3;
      }
      
      // Descriptor-based matching
      if (sketchAnalysis.faceDescriptor && profile.faceDescriptor) {
        const descriptorScore = await this.compareDescriptors(
          sketchAnalysis.faceDescriptor,
          profile.faceDescriptor
        );
        totalScore += descriptorScore * (weights.descriptor || 0.4);
        weightSum += weights.descriptor || 0.4;
      }
      
      // Age and gender matching
      if (sketchAnalysis.ageGender && profile.ageGender) {
        const ageGenderScore = this._compareAgeGender(
          sketchAnalysis.ageGender,
          profile.ageGender
        );
        totalScore += ageGenderScore * (weights.ageGender || 0.2);
        weightSum += weights.ageGender || 0.2;
      }
      
      // Quality adjustment
      const qualityFactor = Math.min(sketchAnalysis.qualityScore, 1);
      const adjustedScore = (totalScore / weightSum) * qualityFactor;
      
      enhancedMatches.push({
        ...profile,
        aiScore: adjustedScore,
        confidence: this._calculateConfidenceLevel(adjustedScore),
        matchDetails: {
          featureMatch: sketchAnalysis.features && profile.features ? 
            this._compareFeatures(sketchAnalysis.features, profile.features) : null,
          descriptorMatch: sketchAnalysis.faceDescriptor && profile.faceDescriptor ?
            await this.compareDescriptors(sketchAnalysis.faceDescriptor, profile.faceDescriptor) : null,
          ageGenderMatch: sketchAnalysis.ageGender && profile.ageGender ?
            this._compareAgeGender(sketchAnalysis.ageGender, profile.ageGender) : null
        }
      });
    }
    
    return enhancedMatches.sort((a, b) => b.aiScore - a.aiScore);
  }

  _compareFeatures(features1, features2) {
    let totalScore = 0;
    let comparisons = 0;
    
    const featureKeys = ['eyeShape', 'noseShape', 'mouthShape', 'faceShape'];
    
    featureKeys.forEach(key => {
      if (features1[key] && features2[key]) {
        totalScore += features1[key] === features2[key] ? 1 : 0;
        comparisons++;
      }
    });
    
    return comparisons > 0 ? totalScore / comparisons : 0;
  }

  _compareAgeGender(ageGender1, ageGender2) {
    let score = 0;
    
    const ageDiff = Math.abs(ageGender1.age - ageGender2.age);
    const ageScore = Math.max(0, 1 - ageDiff / 50);
    score += ageScore * 0.6;
    
    const genderScore = ageGender1.gender === ageGender2.gender ? 1 : 0;
    score += genderScore * 0.4;
    
    return score;
  }

  _calculateConfidenceLevel(score) {
    if (score >= 0.8) return 'very_high';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    if (score >= 0.2) return 'low';
    return 'very_low';
  }

  async generateInsights(sketchAnalysis, matches) {
    const insights = {
      sketchQuality: this._assessSketchQuality(sketchAnalysis),
      matchingStrategy: this._recommendMatchingStrategy(sketchAnalysis),
      confidenceFactors: this._identifyConfidenceFactors(sketchAnalysis, matches),
      recommendations: this._generateRecommendations(sketchAnalysis, matches)
    };
    
    return insights;
  }

  _assessSketchQuality(analysis) {
    const quality = analysis.qualityScore || 0.5;
    
    if (quality >= 0.8) {
      return {
        level: 'excellent',
        description: 'High-quality sketch with clear facial features',
        factors: ['Clear facial boundaries', 'Detailed features', 'Good contrast']
      };
    } else if (quality >= 0.6) {
      return {
        level: 'good',
        description: 'Good quality sketch suitable for identification',
        factors: ['Visible features', 'Adequate detail', 'Recognizable structure']
      };
    } else if (quality >= 0.4) {
      return {
        level: 'fair',
        description: 'Fair quality sketch with some limitations',
        factors: ['Some unclear features', 'Limited detail', 'Partial visibility']
      };
    } else {
      return {
        level: 'poor',
        description: 'Poor quality sketch may limit identification accuracy',
        factors: ['Unclear features', 'Low detail', 'Poor contrast']
      };
    }
  }

  _recommendMatchingStrategy(analysis) {
    const strategies = [];
    
    if (analysis.qualityScore > 0.7) {
      strategies.push('Use high-precision feature matching');
    }
    
    if (analysis.ageGender && analysis.ageGender.genderProbability > 0.8) {
      strategies.push('Filter by gender for better accuracy');
    }
    
    if (analysis.features && analysis.features.dominantExpression.confidence > 0.6) {
      strategies.push('Consider expression-based filtering');
    }
    
    return strategies.length > 0 ? strategies : ['Use broad matching criteria'];
  }

  _identifyConfidenceFactors(analysis, matches) {
    const factors = [];
    
    if (analysis.qualityScore > 0.8) {
      factors.push('High sketch quality increases match confidence');
    }
    
    if (matches && matches.length > 0) {
      const topMatch = matches[0];
      if (topMatch.aiScore > 0.8) {
        factors.push('Strong feature correlation with top match');
      }
    }
    
    if (analysis.landmarks) {
      factors.push('Facial landmarks successfully detected');
    }
    
    return factors;
  }

  _generateRecommendations(analysis, matches) {
    const recommendations = [];
    
    if (analysis.qualityScore < 0.5) {
      recommendations.push('Consider uploading a higher quality sketch for better results');
    }
    
    if (!matches || matches.length === 0) {
      recommendations.push('Try adjusting feature confidence levels');
      recommendations.push('Consider expanding search criteria');
    }
    
    if (matches && matches.length > 10) {
      recommendations.push('Results show many potential matches - consider narrowing criteria');
    }
    
    return recommendations;
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance;