/// <reference types="react-scripts" />

// Suppress source map warnings for face-api.js
declare module 'face-api.js' {
  const faceapi: any;
  export = faceapi;
}