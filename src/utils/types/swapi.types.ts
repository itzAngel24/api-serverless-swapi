// src/types/swapi.types.ts
export interface SWAPIPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SWAPIResponse<T> {
  results: {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
  isCached: boolean;
}

export type SWAPIResource = 'people' | 'films' | 'planets' | 'species' | 'vehicles' | 'starships';
