import React from 'react';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import type { PlanningResult } from '../types/api';

interface ResultsListProps {
  results: PlanningResult[];
}

export function ResultsList({ results }: ResultsListProps) {
  console.log('ResultsList received:', results);

  if (!Array.isArray(results)) {
    console.error('Results is not an array:', results);
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>Error: Invalid results format</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>No planning applications found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Found {results.length} planning application{results.length !== 1 ? 's' : ''}
        </h2>
      </div>
      
      {results.map((result, index) => (
        <div
          key={`${result.reference}-${index}`}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {result.name || 'Unnamed Application'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Reference: {result.reference}
              </p>
            </div>
            {result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">View Details</span>
              </a>
            )}
          </div>

          {result.description && (
            <p className="mt-2 text-gray-700 line-clamp-3">{result.description}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {result.entry_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(result.entry_date).toLocaleDateString()}</span>
              </div>
            )}
            {result.organisation && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{result.organisation}</span>
              </div>
            )}
          </div>

          {(result.dataset || result.typology) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.dataset && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {result.dataset}
                </span>
              )}
              {result.typology && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {result.typology}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}