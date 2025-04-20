// api.js – Handles API calls to backend

export async function submitIdentification(sketch, weights) {
    const formData = new FormData();
    formData.append("sketch", sketch);
    formData.append("weights", JSON.stringify(weights));
  
    try {
      const response = await fetch("http://localhost:8080/api/identify", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Result from backend:", result);
      return result;
    } catch (error) {
      console.error("Error submitting identification:", error);
      return null;
    }
  }
  