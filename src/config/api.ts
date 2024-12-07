export const API_CONFIG = {
  BASE_URL: 'https://api.planning.org.uk/v3',
  ENDPOINTS: {
    APPLICATIONS: '/applications',
    DOCUMENTS: '/documents',
    DECISIONS: '/decisions'
  },
  DEFAULT_LIMIT: 20,
  DEFAULT_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
} as const;

export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;