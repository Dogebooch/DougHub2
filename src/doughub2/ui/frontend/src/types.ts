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

// API Response Types
export interface QuestionInfo {
  question_id: number;
  source_name: string;
  source_question_key: string;
}

export interface QuestionListResponse {
  questions: QuestionInfo[];
}

export interface QuestionDetailResponse {
  question_id: number;
  source_name: string;
  source_question_key: string;
  raw_html: string;
}
