// Enhanced API service with better error handling and mock data

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Simulate network delay for realistic experience
const simulateNetworkDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitIdentification(sketch, weights) {
  try {
    // Simulate processing time
    await simulateNetworkDelay(2000);
    
    const formData = new FormData();
    formData.append("sketch", sketch);
    formData.append("weights", JSON.stringify(weights));
    
    // In a real application, this would make an actual API call
    // For demo purposes, we'll simulate a successful response
    const mockResponse = {
      success: true,
      processingId: `proc_${Date.now()}`,
      message: "Sketch processed successfully"
    };
    
    console.log("Submitting identification with weights:", weights);
    console.log("Mock API response:", mockResponse);
    
    // Simulate potential API failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Simulated API failure");
    }
    
    return mockResponse.success;
    
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
    
    // Mock data for demonstration
    return [
      {
        id: 1,
        name: 'John Anderson',
        age: 34,
        location: 'New York, NY',
        lastSeen: '2024-01-15',
        score: 0.89,
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        status: 'wanted',
        caseNumber: 'NYC-2024-0156',
        charges: ['Armed Robbery', 'Assault'],
        description: 'Suspect in multiple armed robbery cases across Manhattan area.'
      }
    ];
    
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
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