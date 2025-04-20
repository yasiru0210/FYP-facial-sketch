// Results.jsx – Display matched criminal mugshots with scores using Tailwind only

import React, { useEffect, useState } from 'react';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/results')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch results');
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading results:', err);
        setError('Failed to load results. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Identification Results</h2>

      {loading && <p className="text-blue-600 text-center">Loading results...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-center text-gray-600">No matches found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div key={index} className="bg-white rounded shadow p-4 space-y-4">
            <img
              src={`data:image/jpeg;base64,${item.image}`}
              alt="match"
              className="rounded w-full h-64 object-cover"
            />
            <p className="text-lg font-medium">Score: {item.score}</p>
            <p className="text-sm text-gray-600">Name: {item.name || 'Unknown'}</p>
            <p className="text-sm text-gray-600">Age: {item.age || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
