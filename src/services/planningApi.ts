import type { PlanningApplication, SearchFilters } from '../types/planning';
import { API_CONFIG } from '../config/api';

function transformApiResponse(data: any): PlanningApplication {
  return {
    reference: data.reference || '',
    name: data.proposal || data.description || 'No Description Available',
    description: data.proposal || data.description || '',
    application_type: data.type || '',
    entry_date: data.received_date || data.registration_date || '',
    organisation: data.local_planning_authority || '',
    url: data.url || '',
    decision: {
      status: data.decision?.status || data.status || 'Pending',
      date: data.decision?.date || data.decision_date || null
    },
    case_officer: data.case_officer || '',
    documents: Array.isArray(data.documents) ? data.documents.map((doc: any) => ({
      url: doc.url,
      title: doc.title || 'Planning Document',
      type: doc.type || 'application/pdf',
      date: doc.date || null
    })) : [],
    status: data.status || '',
    validation_date: data.validation_date || '',
    consultation_end_date: data.consultation_end_date || '',
    geometry: data.location?.geometry || null,
    address: data.location?.address || '',
    postcode: data.location?.postcode || ''
  };
}

export async function searchPlanningApplications(params: SearchFilters) {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params.reference) {
      queryParams.append('reference', params.reference[0]);
    }
    
    if (params.postcode) {
      queryParams.append('postcode', params.postcode);
    }

    if (params.application_type?.length) {
      params.application_type.forEach(type => {
        queryParams.append('type', type);
      });
    }

    if (params.status?.length) {
      params.status.forEach(status => {
        queryParams.append('status', status);
      });
    }

    // Date filters
    if (params.entry_date?.year) {
      const date = new Date(
        params.entry_date.year,
        (params.entry_date.month || 1) - 1,
        params.entry_date.day || 1
      );
      queryParams.append('received_after', date.toISOString().split('T')[0]);
    }

    // Pagination
    queryParams.append('limit', (params.limit || API_CONFIG.DEFAULT_LIMIT).toString());
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS}?${queryParams.toString()}`;
    console.log('API Request URL:', url);

    const response = await fetch(url, {
      headers: API_CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);

    if (!data || !Array.isArray(data.results)) {
      throw new Error('Invalid API response format');
    }

    const results = data.results.map(transformApiResponse);
    
    return {
      count: data.total || results.length,
      results,
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getApplicationDetails(reference: string) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS}/${reference}`;
    
    const response = await fetch(url, {
      headers: API_CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return transformApiResponse(data);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getApplicationDocuments(reference: string) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS}/${reference}`;
    
    const response = await fetch(url, {
      headers: API_CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}