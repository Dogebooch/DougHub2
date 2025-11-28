export interface Card {
  id: number;
  deck: string;
  front: string;
  back: string;
  tags: string[];
  created: string;
  modified: string;
  reviews: number;
  ease: number;
  lapses: number;
  interval: number;
  suspended: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  searchQuery: string;
  selectedDecks: number[];
  selectedTags: string[];
  suspended?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
  links: string[]; // IDs of notes linked to
}
