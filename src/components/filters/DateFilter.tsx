import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import type { DateFilter, DateMatchType } from '../../types/planning';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  label: string;
  value: DateFilter;
  onChange: (value: DateFilter) => void;
}

export function DateFilterComponent({ label, value, onChange }: DateFilterProps) {
  const dateMatches: DateMatchType[] = ['match', 'before', 'since', 'empty'];

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format the date into year, month, day components
      onChange({
        ...value,
        year: date.getFullYear(),
        month: date.getMonth() + 1, // JavaScript months are 0-based
        day: date.getDate(),
        match: value.match || 'match' // Ensure we have a default match type
      });
    } else {
      // Clear the date components
      onChange({
        match: value.match || 'match',
        year: undefined,
        month: undefined,
        day: undefined
      });
    }
  };

  const getCurrentDate = (): Date | null => {
    if (value.year && value.month && value.day) {
      // JavaScript months are 0-based, so subtract 1 from the month
      return new Date(value.year, value.month - 1, value.day);
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {label}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <DatePicker
            selected={getCurrentDate()}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
            isClearable
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        
        <div>
          <select
            value={value.match || 'match'}
            onChange={(e) => onChange({ ...value, match: e.target.value as DateMatchType })}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {dateMatches.map((match) => (
              <option key={match} value={match}>
                {match.charAt(0).toUpperCase() + match.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}