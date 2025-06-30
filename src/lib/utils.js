import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatScore(score) {
  return `${(score * 100).toFixed(1)}%`;
}

export function getConfidenceLevel(score) {
  if (score >= 0.9) return { level: 'Very High', color: 'text-success-600' };
  if (score >= 0.7) return { level: 'High', color: 'text-success-500' };
  if (score >= 0.5) return { level: 'Medium', color: 'text-warning-500' };
  if (score >= 0.3) return { level: 'Low', color: 'text-warning-600' };
  return { level: 'Very Low', color: 'text-error-500' };
}

export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  return { valid: true };
}