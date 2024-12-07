export type DateMatchType = 'match' | 'before' | 'since' | 'empty';
export type GeometryRelationType = 
  | 'within' 
  | 'equals' 
  | 'disjoint' 
  | 'intersects' 
  | 'touches' 
  | 'contains' 
  | 'covers' 
  | 'coveredby' 
  | 'overlaps' 
  | 'crosses';

export type PeriodType = 'all' | 'current' | 'historical';

export interface DateFilter {
  year?: number;
  month?: number;
  day?: number;
  match?: DateMatchType;
}

export interface GeometryFilter {
  longitude?: number;
  latitude?: number;
  geometry?: string[];
  geometry_entity?: number[];
  geometry_reference?: string[];
  geometry_curie?: string[];
  geometry_relation?: GeometryRelationType;
}

export interface PlanningSearchParams extends GeometryFilter {
  typology?: string[];
  dataset?: string[];
  organisation_entity?: number[];
  entity?: number[];
  curie?: string[];
  prefix?: string[];
  reference?: string[];
  start_date?: DateFilter;
  end_date?: DateFilter;
  entry_date?: DateFilter;
  period?: PeriodType;
  limit?: number;
  offset?: number;
  field?: string[];
  exclude_field?: string[];
  extension?: string;
}

export interface PlanningResult {
  reference: string;
  name: string;
  description?: string;
  dataset: string;
  entry_date: string;
  start_date?: string;
  end_date?: string;
  organisation?: string;
  url?: string;
  typology?: string;
  geometry?: any;
}

export interface SearchResponse {
  count: number;
  results: PlanningResult[];
}