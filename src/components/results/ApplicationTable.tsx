import React from 'react';
import { ExternalLink, FileSearch, Calendar, MapPin, FileText, UserCircle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getDecisionStatusColor } from '../../utils/statusUtils';
import type { PlanningApplication } from '../../types/planning';

interface ApplicationTableProps {
  applications: PlanningApplication[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference & Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Dates
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents & Links
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application, index) => (
              <tr key={`${application.reference}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {application.reference}
                  </div>
                  {application.application_type && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.application_type}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {application.name}
                  </div>
                  {application.description && (
                    <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {application.description}
                    </div>
                  )}
                  {application.case_officer && (
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <UserCircle className="w-4 h-4 mr-1" />
                      {application.case_officer}
                    </div>
                  )}
                  {application.organisation && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {application.organisation}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {application.decision?.status && (
                    <div className="flex items-center text-sm mb-2">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-gray-500" />
                      <span className={getDecisionStatusColor(application.decision.status)}>
                        {application.decision.status}
                      </span>
                    </div>
                  )}
                  {application.entry_date && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Received: {formatDate(application.entry_date)}
                    </div>
                  )}
                  {application.decision?.date && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Decision: {formatDate(application.decision.date)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    {application.documents && application.documents.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {application.documents.length} document{application.documents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      {application.url && (
                        <a
                          href={application.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          title="View Application Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="ml-1 text-sm">Details</span>
                        </a>
                      )}
                      {application.entity_id && (
                        <a
                          href={`https://www.planning.data.gov.uk/entity/${application.entity_id}.json`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 flex items-center"
                          title="View Raw API Data"
                        >
                          <FileSearch className="w-4 h-4" />
                          <span className="ml-1 text-sm">API</span>
                        </a>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}