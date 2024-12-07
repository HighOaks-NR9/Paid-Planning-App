import React from 'react';
import { ResultsHeader } from './ResultsHeader';
import { ApplicationCard } from './ApplicationCard';
import type { PlanningApplication } from '../../types/planning';

interface ResultsListProps {
  results: PlanningApplication[];
}

export function ResultsList({ results }: ResultsListProps) {
  if (!Array.isArray(results)) {
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
      <ResultsHeader count={results.length} />
      <div className="grid gap-4">
        {results.map((application, index) => (
          <ApplicationCard 
            key={`${application.reference}-${index}`} 
            application={application} 
          />
        ))}
      </div>
    </div>
  );
}