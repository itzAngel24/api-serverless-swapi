// src/types/swapi.types.ts
export interface QuoteAPIQuote {
  quote: string;
  author: string;
}

export interface QuoteAPIResponse<T> {
  results: T[];
  isCached: boolean;
}

export type SWAPIResource = 'people' | 'films' | 'planets' | 'species' | 'vehicles' | 'starships';
