/**
 * Core types for the Question Reviewer application
 */

/** Status of a question in the learning flow */
export type QuestionStatus = 'not-started' | 'in-progress' | 'completed';

/** A question from the question bank */
export interface Question {
    id: number;
    category: string;
    questionText: string;
    options: AnswerOption[];
    correctAnswer: string;
    status: QuestionStatus;
}

/** An answer option for a multiple choice question */
export interface AnswerOption {
    letter: string;
    text: string;
}

/** Learning flow stage status */
export type StageStatus = 'active' | 'locked' | 'completed';

/** A stage in the learning flow */
export interface LearningStage {
    id: string;
    title: string;
    icon: string;
    status: StageStatus;
    description?: string;
    prompt?: string;
}

/** User's response to a learning stage */
export interface StageResponse {
    stageId: string;
    response: string;
    timestamp: string;
}

/** Question bank filter options */
export interface QuestionFilters {
    status?: QuestionStatus;
    category?: string;
    search?: string;
}

/** Summary counts for the question bank */
export interface QuestionSummary {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
}
