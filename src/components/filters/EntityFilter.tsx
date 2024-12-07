import React from 'react';
import { Building, Tag } from 'lucide-react';

interface EntityFilterProps {
  value: {
    typology?: string[];
    dataset?: string[];
    reference?: string[];
    organisation_entity?: number[];
  };
  onChange: (value: any) => void;
}

export function EntityFilter({ value, onChange }: EntityFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Building className="w-4 h-4" />
        Entity Details
      </h3>

      <div>
        <label className="block text-sm text-gray-600">Reference</label>
        <input
          type="text"
          value={value.reference?.[0] || ''}
          onChange={(e) => onChange({ ...value, reference: e.target.value ? [e.target.value] : undefined })}
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder="Enter reference"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Dataset</label>
        <input
          type="text"
          value={value.dataset?.[0] || ''}
          onChange={(e) => onChange({ ...value, dataset: e.target.value ? [e.target.value] : undefined })}
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder="Enter dataset"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Typology</label>
        <input
          type="text"
          value={value.typology?.[0] || ''}
          onChange={(e) => onChange({ ...value, typology: e.target.value ? [e.target.value] : undefined })}
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder="Enter typology"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Organisation ID</label>
        <input
          type="number"
          value={value.organisation_entity?.[0] || ''}
          onChange={(e) => onChange({ 
            ...value, 
            organisation_entity: e.target.value ? [parseInt(e.target.value)] : undefined 
          })}
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder="Enter organisation ID"
        />
      </div>
    </div>
  );
}