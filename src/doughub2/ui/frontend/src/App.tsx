/**
 * Main Application Component
 *
 * Implements the 3-panel Question Reviewer layout:
 * - Left: Question Bank sidebar with filters and question list
 * - Center: Question display with multiple choice answers
 * - Right: Learning Flow panel with AI teaching stages
 */

import { useCallback, useState } from 'react';
import { LearningFlowPanel } from './components/LearningFlowPanel';
import { QuestionPanel } from './components/QuestionPanel';
import { QuestionSidebar } from './components/QuestionSidebar';
import { defaultLearningStages, mockQuestions } from './data/mockData';
import type { LearningStage, Question, QuestionStatus } from './types';

function App() {
    // Question state
    const [questions, setQuestions] = useState<Question[]>(mockQuestions);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(mockQuestions[0]?.id ?? null);
    const [statusFilter, setStatusFilter] = useState<QuestionStatus | null>(null);

    // Answer state
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Learning flow state
    const [learningStages] = useState<LearningStage[]>(defaultLearningStages);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);

    // Get current question
    const currentQuestion = questions.find(q => q.id === selectedQuestionId) ?? null;
    const currentIndex = questions.findIndex(q => q.id === selectedQuestionId);

    // Handle question selection
    const handleSelectQuestion = useCallback((questionId: number) => {
        setSelectedQuestionId(questionId);
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setCurrentStageIndex(0);
    }, []);

    // Handle answer selection
    const handleSelectAnswer = useCallback((letter: string) => {
        if (!isSubmitted) {
            setSelectedAnswer(letter);
        }
    }, [isSubmitted]);

    // Handle answer submission
    const handleSubmitAnswer = useCallback(() => {
        if (selectedAnswer && currentQuestion) {
            setIsSubmitted(true);
            // Update question status to in-progress when first answered
            setQuestions(prev => prev.map(q =>
                q.id === currentQuestion.id && q.status === 'not-started'
                    ? { ...q, status: 'in-progress' as QuestionStatus }
                    : q
            ));
        }
    }, [selectedAnswer, currentQuestion]);

    // Handle navigation
    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            handleSelectQuestion(questions[currentIndex - 1].id);
        }
    }, [currentIndex, questions, handleSelectQuestion]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            handleSelectQuestion(questions[currentIndex + 1].id);
        }
    }, [currentIndex, questions, handleSelectQuestion]);

    // Handle learning flow
    const handleSubmitResponse = useCallback((stageId: string, response: string) => {
        console.log('Stage response:', { stageId, response });
        // In real app, this would send to AI backend
    }, []);

    const handleStageComplete = useCallback((_stageId: string) => {
        // Move to next stage
        if (currentStageIndex < learningStages.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
        } else {
            // All stages completed - mark question as completed
            if (currentQuestion) {
                setQuestions(prev => prev.map(q =>
                    q.id === currentQuestion.id
                        ? { ...q, status: 'completed' as QuestionStatus }
                        : q
                ));
            }
        }
    }, [currentStageIndex, learningStages.length, currentQuestion]);

    // Handle filter change
    const handleFilterChange = useCallback((status: QuestionStatus | null) => {
        setStatusFilter(status);
    }, []);

    return (
        <div className="flex h-screen bg-[#1A1E23] text-gray-100 overflow-hidden">
            {/* Left Sidebar - Question Bank */}
            <QuestionSidebar
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={handleSelectQuestion}
                statusFilter={statusFilter}
                onFilterChange={handleFilterChange}
            />

            {/* Center Panel - Question Display */}
            <QuestionPanel
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
                onSubmitAnswer={handleSubmitAnswer}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isSubmitted={isSubmitted}
            />

            {/* Right Panel - Learning Flow */}
            <LearningFlowPanel
                stages={learningStages}
                currentStageIndex={currentStageIndex}
                onSubmitResponse={handleSubmitResponse}
                onStageComplete={handleStageComplete}
            />
        </div>
    );
}

export default App;
