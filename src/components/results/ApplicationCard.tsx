import React, { useState } from 'react';
import { ExternalLink, FileSearch, Calendar, MapPin, FileText, UserCircle, CheckCircle2, Map } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getDecisionStatusColor } from '../../utils/statusUtils';
import { GeometryMap } from '../map/GeometryMap';
import type { PlanningApplication } from '../../types/planning';

interface ApplicationCardProps {
  application: PlanningApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const [showMap, setShowMap] = useState(false);
  const viewUrl = application.url;
  const apiUrl = application.entity_id 
    ? `https://www.planning.data.gov.uk/entity/${application.entity_id}.json`
    : null;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {application.name || 'Unnamed Application'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Ref: {application.reference}
              </span>
              {application.application_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {application.application_type}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {application.geometry && (
              <button
                onClick={() => setShowMap(true)}
                className="text-gray-500 hover:text-gray-700"
                title="View Location"
              >
                <Map className="w-5 h-5" />
              </button>
            )}
            {apiUrl && (
              <a
                href={apiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                title="View Raw API Data"
              >
                <FileSearch className="w-5 h-5" />
              </a>
            )}
            {viewUrl && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                title="View Application Details"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {application.description && (
          <p className="text-gray-700 mb-4 line-clamp-2">{application.description}</p>
        )}

        {/* Status and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            {application.decision?.status && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500" />
                <span className={getDecisionStatusColor(application.decision.status)}>
                  {application.decision.status}
                </span>
              </div>
            )}
            {application.entry_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Received: {formatDate(application.entry_date)}</span>
              </div>
            )}
            {application.decision?.date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Decision: {formatDate(application.decision.date)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {application.case_officer && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserCircle className="w-4 h-4" />
                <span>{application.case_officer}</span>
              </div>
            )}
            {application.organisation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{application.organisation}</span>
              </div>
            )}
            {application.documents && application.documents.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{application.documents.length} document{application.documents.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {(application.dataset || application.typology) && (
          <div className="flex flex-wrap gap-2">
            {application.dataset && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {application.dataset}
              </span>
            )}
            {application.typology && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {application.typology}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMap && application.geometry && (
        <GeometryMap
          geometry={application.geometry}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
}