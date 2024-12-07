import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/results/ResultsList';
import { searchPlanningApplications } from './services/planningApi';
import type { PlanningSearchParams, PlanningApplication } from './types/planning';
import { Building2 } from 'lucide-react';

function App() {
  const [results, setResults] = useState<PlanningApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    url?: string;
    response?: any;
    error?: string;
  }>({});

  const handleSearch = async (params: PlanningSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      setApiStatus({});

      const url = `https://www.planning.data.gov.uk/entity.json?${new URLSearchParams(params as any).toString()}`;
      setApiStatus(prev => ({ ...prev, url }));

      const response = await searchPlanningApplications(params);
      console.log('Search response:', response); // Debug log
      
      if (response && Array.isArray(response.results)) {
        setResults(response.results);
        setApiStatus(prev => ({ 
          ...prev, 
          response: { count: response.results.length } 
        }));
      } else {
        setResults([]);
        setError('Invalid response format from API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch planning applications';
      setError(errorMessage);
      setApiStatus(prev => ({ ...prev, error: errorMessage }));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">UK Planning Portal Search</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            
            {/* API Status Panel */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">API Status</h3>
              
              <div className="space-y-2 text-sm">
                <div className={`p-2 rounded ${apiStatus.url ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="font-medium">Connection Status:</p>
                  <p className="text-gray-600">{apiStatus.url ? 'Connected' : 'Waiting for search...'}</p>
                </div>

                {apiStatus.url && (
                  <div className="p-2 rounded bg-blue-50">
                    <p className="font-medium">API URL:</p>
                    <p className="text-gray-600 break-all">{apiStatus.url}</p>
                  </div>
                )}

                {apiStatus.error && (
                  <div className="p-2 rounded bg-red-50">
                    <p className="font-medium">Error:</p>
                    <p className="text-red-600">{apiStatus.error}</p>
                  </div>
                )}

                {apiStatus.response && (
                  <div className="p-2 rounded bg-green-50">
                    <p className="font-medium">Results Found:</p>
                    <p className="text-gray-600">{apiStatus.response.count || 0}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <ResultsList results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;