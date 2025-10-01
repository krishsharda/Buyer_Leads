'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSimpleGet = async () => {
    setLoading(true);
    setResult('Testing simple GET...');
    
    try {
      const response = await fetch('/api/diagnostic');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`GET SUCCESS:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`GET ERROR:\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`GET FETCH ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResult('Running diagnostics...');
    
    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'diagnostic' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`DIAGNOSTIC SUCCESS:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`DIAGNOSTIC ERROR:\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`FETCH ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-x-4">
        <button 
          onClick={testSimpleGet}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test GET (Simple)'}
        </button>
        
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test POST (Full Diagnostic)'}
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
}