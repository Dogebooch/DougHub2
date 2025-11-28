/**
 * Centralized API configuration for DougHub2 frontend.
 * 
 * All API endpoints should be defined here to ensure maintainability
 * and consistency across the application.
 */

const BASE_URL = '/api';

export const API_ENDPOINTS = {
    /** List all questions */
    questionsList: `${BASE_URL}/questions`,
    
    /** Get details for a specific question by ID */
    questionDetail: (id: number) => `${BASE_URL}/questions/${id}`,
} as const;
