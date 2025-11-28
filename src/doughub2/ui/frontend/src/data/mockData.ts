/**
 * Mock data for development and testing
 * This will be replaced with API calls in production
 */

import type { Question, LearningStage } from '../types';

/** Mock questions for the question bank */
export const mockQuestions: Question[] = [
    {
        id: 1,
        category: 'Cardiology',
        questionText: 'A 45-year-old male presents with acute chest pain radiating to the left arm. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?',
        options: [
            { letter: 'A', text: 'Left anterior descending artery' },
            { letter: 'B', text: 'Right coronary artery' },
            { letter: 'C', text: 'Left circumflex artery' },
            { letter: 'D', text: 'Left main coronary artery' },
        ],
        correctAnswer: 'B',
        status: 'in-progress',
    },
    {
        id: 2,
        category: 'Infectious Disease',
        questionText: 'Which of the following is the most common cause of community-acquired pneumonia in adults?',
        options: [
            { letter: 'A', text: 'Streptococcus pneumoniae' },
            { letter: 'B', text: 'Haemophilus influenzae' },
            { letter: 'C', text: 'Mycoplasma pneumoniae' },
            { letter: 'D', text: 'Staphylococcus aureus' },
        ],
        correctAnswer: 'A',
        status: 'not-started',
    },
    {
        id: 3,
        category: 'Endocrinology',
        questionText: 'A patient with type 2 diabetes mellitus has an HbA1c of 9.5%. Which of the following is the most appropriate initial management?',
        options: [
            { letter: 'A', text: 'Lifestyle modifications alone' },
            { letter: 'B', text: 'Metformin monotherapy' },
            { letter: 'C', text: 'Metformin plus a second agent' },
            { letter: 'D', text: 'Insulin therapy' },
        ],
        correctAnswer: 'C',
        status: 'not-started',
    },
];

/** Default learning flow stages */
export const defaultLearningStages: LearningStage[] = [
    {
        id: 'elaborative',
        title: 'Elaborative Interrogation & Self-Explanation',
        icon: 'lightbulb',
        status: 'active',
        description: 'Why is this answer correct? Explain in your own words the reasoning behind the correct answer.',
        prompt: 'Type your response here...',
    },
    {
        id: 'multimodal',
        title: 'Multi-modal Reinforcement',
        icon: 'eye',
        status: 'locked',
        description: 'Complete the previous stage to unlock',
    },
    {
        id: 'recall',
        title: 'Active Recall Practice',
        icon: 'brain',
        status: 'locked',
        description: 'Complete the previous stage to unlock',
    },
    {
        id: 'discussion',
        title: 'Peer Discussion (Teach the AI)',
        icon: 'message-square',
        status: 'locked',
        description: 'Complete the previous stage to unlock',
    },
    {
        id: 'grading',
        title: 'Grading & Clarifications',
        icon: 'award',
        status: 'locked',
        description: 'Complete all stages to receive your grade',
    },
];

/** Calculate question summary from question list */
export function calculateQuestionSummary(questions: Question[]) {
    return {
        completed: questions.filter(q => q.status === 'completed').length,
        inProgress: questions.filter(q => q.status === 'in-progress').length,
        notStarted: questions.filter(q => q.status === 'not-started').length,
        total: questions.length,
    };
}
