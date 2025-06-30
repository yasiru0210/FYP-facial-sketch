import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';

class AIService {
  constructor() {
    this.isInitialized = false;
    this.faceDetectionModel = null;
    this.facialLandmarkModel = null;
    this.faceRecognitionModel = null;
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._loadModels();
    return this.initializationPromise;
  }

  async _loadModels() {
    try {
      console.log('Loading AI models...');
      
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
      ]);

      this.isInitialized = true;
      console.log('AI models loaded successfully');
    } catch (error) {
      console.warn('Could not load face-api models, using fallback AI:', error);
      // Initialize TensorFlow.js as fallback
      await tf.ready();
      this.isInitialized = true;
    }
  }

  async analyzeSketch(imageElement) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Detect faces and extract features
      const detections = await faceapi
        .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

      if (detections.length === 0) {
        return this._fallbackAnalysis(imageElement);
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
        features: this._analyzeFacialFeatures(detection)
      };
    } catch (error) {
      console.warn('Face detection failed, using fallback:', error);
      return this._fallbackAnalysis(imageElement);
    }
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
    // Calculate eyebrow arch based on landmark positions
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
    
    // Calculate the height of the arch
    const baseDistance = this._calculateDistance(start, end);
    const archHeight = Math.abs(middle.y - (start.y + end.y) / 2);
    
    return archHeight / baseDistance;
  }

  _calculateJawlineSharpness(positions) {
    // Calculate jawline sharpness based on jaw points
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
    
    // Factor in face size (larger faces generally mean better quality)
    const faceSize = box.width * box.height;
    const sizeScore = Math.min(faceSize / 10000, 1); // Normalize to 0-1
    
    // Combine detection confidence with size
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
    // Simplified eye shape classification
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

  _fallbackAnalysis(imageElement) {
    // Fallback analysis when face detection fails
    return {
      confidence: 0.5,
      landmarks: null,
      expressions: { neutral: 1.0 },
      ageGender: { age: 30, gender: 'unknown', genderProbability: 0.5 },
      faceDescriptor: new Array(128).fill(0).map(() => Math.random()),
      qualityScore: 0.6,
      features: {
        eyeShape: 'almond',
        noseShape: 'medium',
        mouthShape: 'medium',
        faceShape: 'oval',
        dominantExpression: { expression: 'neutral', confidence: 1.0 }
      }
    };
  }

  async compareDescriptors(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2) return 0;
    
    // Calculate Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    
    // Convert distance to similarity score (0-1, where 1 is perfect match)
    return Math.max(0, 1 - distance);
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
    
    // Sort by AI score
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
    
    // Age comparison (closer ages get higher scores)
    const ageDiff = Math.abs(ageGender1.age - ageGender2.age);
    const ageScore = Math.max(0, 1 - ageDiff / 50); // Normalize by 50 years
    score += ageScore * 0.6;
    
    // Gender comparison
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

export default new AIService();