export type CategoryType = 'plants' | 'animals' | 'insects' | 'fish';
export type InfoType = 'habitat' | 'adaptation' | 'funFacts' | 'behavior';

export interface Species {
  id: string;
  name: string;
  image: string;
  description: string;
  habitat: string;
  adaptation: string;
  funFacts: string;
  behavior: string;
}

export interface SpeciesData {
  [key: string]: Species[];
}