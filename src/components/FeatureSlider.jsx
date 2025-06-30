import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Eye, Nose, Smile, Minus, User } from 'lucide-react';

const featureIcons = {
  eyes: Eye,
  nose: Nose,
  mouth: Smile,
  eyebrows: Minus,
  faceShape: User,
};

const featureDescriptions = {
  eyes: 'Eye shape, size, and positioning',
  nose: 'Nose structure and proportions',
  mouth: 'Mouth shape and lip characteristics',
  eyebrows: 'Eyebrow thickness and arch',
  faceShape: 'Overall facial structure and jawline',
};

export default function FeatureSlider({ weights, onChange }) {
  const getConfidenceColor = (value) => {
    if (value >= 80) return 'text-success-600 bg-success-50';
    if (value >= 60) return 'text-primary-600 bg-primary-50';
    if (value >= 40) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getConfidenceText = (value) => {
    if (value >= 80) return 'Very High';
    if (value >= 60) return 'High';
    if (value >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-secondary-900">Feature Confidence Levels</CardTitle>
        <p className="text-sm text-secondary-600">
          Adjust the confidence level for each facial feature based on sketch clarity
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(weights).map(([feature, value]) => {
          const Icon = featureIcons[feature];
          const confidenceClass = getConfidenceColor(value);
          const confidenceText = getConfidenceText(value);
          
          return (
            <div key={feature} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <Label className="text-base font-medium text-secondary-900">
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </Label>
                    <p className="text-xs text-secondary-500">
                      {featureDescriptions[feature]}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${confidenceClass}`}>
                    {confidenceText}
                  </span>
                  <span className="text-lg font-semibold text-secondary-900 min-w-[3rem] text-right">
                    {value}%
                  </span>
                </div>
              </div>
              
              <div className="px-2">
                <Slider
                  value={[value]}
                  onValueChange={(newValue) => onChange(feature, newValue[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-secondary-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <h4 className="font-medium text-secondary-900 mb-2">Quick Presets:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                Object.keys(weights).forEach(feature => onChange(feature, 75));
              }}
              className="px-3 py-1 text-xs bg-success-100 text-success-700 rounded-full hover:bg-success-200 transition-colors"
            >
              High Quality Sketch
            </button>
            <button
              onClick={() => {
                Object.keys(weights).forEach(feature => onChange(feature, 50));
              }}
              className="px-3 py-1 text-xs bg-warning-100 text-warning-700 rounded-full hover:bg-warning-200 transition-colors"
            >
              Average Quality
            </button>
            <button
              onClick={() => {
                Object.keys(weights).forEach(feature => onChange(feature, 25));
              }}
              className="px-3 py-1 text-xs bg-error-100 text-error-700 rounded-full hover:bg-error-200 transition-colors"
            >
              Poor Quality Sketch
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}