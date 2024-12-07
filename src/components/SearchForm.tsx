import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import type { PlanningSearchParams, DateFilter, GeometryFilter } from '../types/api';
import { DateFilterComponent } from './filters/DateFilter';
import { LocationFilter } from './filters/LocationFilter';
import { EntityFilter } from './filters/EntityFilter';

interface SearchFormProps {
  onSearch: (params: PlanningSearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<PlanningSearchParams>({
    limit: 20,
    start_date: {},
    end_date: {},
    entry_date: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: PlanningSearchParams = { ...filters };
    
    // Clean up empty filters
    Object.keys(params).forEach((key) => {
      if (params[key] && typeof params[key] === 'object' && Object.keys(params[key]).length === 0) {
        delete params[key];
      }
    });

    onSearch(params);
  };

  const handleDateChange = (type: 'start_date' | 'end_date' | 'entry_date') => (value: DateFilter) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleLocationChange = (value: GeometryFilter) => {
    setFilters(prev => ({
      ...prev,
      ...value
    }));
  };

  const handleEntityChange = (value: any) => {
    setFilters(prev => ({
      ...prev,
      ...value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <EntityFilter value={filters} onChange={handleEntityChange} />

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <Filter className="w-4 h-4" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {showAdvanced && (
        <div className="space-y-6 border-t pt-4">
          <LocationFilter 
            value={filters} 
            onChange={handleLocationChange}
          />

          <DateFilterComponent
            label="Start Date"
            value={filters.start_date || {}}
            onChange={handleDateChange('start_date')}
          />

          <DateFilterComponent
            label="End Date"
            value={filters.end_date || {}}
            onChange={handleDateChange('end_date')}
          />

          <DateFilterComponent
            label="Entry Date"
            value={filters.entry_date || {}}
            onChange={handleDateChange('entry_date')}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Search className="w-5 h-5" />
            Search Applications
          </>
        )}
      </button>
    </form>
  );
}