export interface PlanningApplication {
  reference: string;
  name: string;
  description?: string;
  application_type?: string;
  entry_date?: string;
  organisation?: string;
  url?: string;
  decision?: {
    status: string;
    date?: string | null;
  };
  case_officer?: string;
  documents?: Array<{
    url: string;
    title: string;
    type: string;
    date?: string | null;
  }>;
  status?: string;
  validation_date?: string;
  consultation_end_date?: string;
  geometry?: any;
  address?: string;
  postcode?: string;
}

export interface SearchFilters {
  reference?: string[];
  postcode?: string;
  application_type?: string[];
  status?: string[];
  entry_date?: DateFilter;
  limit?: number;
}

export interface DateFilter {
  year?: number;
  month?: number;
  day?: number;
  match?: DateMatchType;
}

export type DateMatchType = 'match' | 'before' | 'since' | 'empty';

export interface SearchResponse {
  count: number;
  results: PlanningApplication[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_results: number;
    next_page?: string;
    prev_page?: string;
  };
}