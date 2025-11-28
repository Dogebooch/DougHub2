/**
 * Centralized API Configuration
 *
 * This file contains all API endpoint URLs used by the frontend.
 * Centralizing these makes it easy to update paths as the API evolves.
 */

/** Base URL for all API endpoints */
const API_BASE_URL = '/api';

/**
 * API Endpoints Configuration
 *
 * Contains all API endpoint URLs used throughout the application.
 * Static endpoints are strings, dynamic endpoints are functions.
 */
export const API_ENDPOINTS = {
    /** List all questions */
    questionsList: `${API_BASE_URL}/questions`,

    /** Get a single question by ID */
    questionDetail: (id: string | number) => `${API_BASE_URL}/questions/${id}`,

    /** Extract endpoint for userscript */
    extract: `${API_BASE_URL}/extract`,

    /** List all extractions */
    extractionsList: `${API_BASE_URL}/extractions`,

    /** Get a single extraction by filename */
    extractionDetail: (filename: string) => `${API_BASE_URL}/extractions/${filename}`,

    /** Clear all extractions */
    clearExtractions: `${API_BASE_URL}/extractions/clear`,
} as const;

export default API_ENDPOINTS;
