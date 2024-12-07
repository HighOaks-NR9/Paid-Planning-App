import React from 'react';

interface ResultsHeaderProps {
  count: number;
}

export function ResultsHeader({ count }: ResultsHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Found {count} planning application{count !== 1 ? 's' : ''}
      </h2>
    </div>
  );
}