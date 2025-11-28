/**
 * Learning Flow Stage Configuration
 *
 * Defines the default stages for the AI-guided learning flow.
 * These stages guide the user through structured learning after answering a question.
 */

import type { LearningStage } from '../types';

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
