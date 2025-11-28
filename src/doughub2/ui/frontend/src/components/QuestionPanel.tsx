/**
 * QuestionPanel Component
 *
 * Center panel displaying the current question with:
 * - Category badge and question counter
 * - Question text
 * - Multiple choice answer options (A, B, C, D)
 * - Submit Answer button
 * - Previous/Next navigation
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnswerOption, Question } from '../types';

interface QuestionPanelProps {
    question: Question | null;
    currentIndex: number;
    totalQuestions: number;
    selectedAnswer: string | null;
    onSelectAnswer: (letter: string) => void;
    onSubmitAnswer: () => void;
    onPrevious: () => void;
    onNext: () => void;
    isSubmitted: boolean;
}

/** Category badge with appropriate styling */
function CategoryBadge({ category }: { category: string }) {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {category}
        </span>
    );
}

/** Answer option button */
function AnswerOptionButton({
    option,
    isSelected,
    isCorrect,
    isSubmitted,
    onClick,
}: {
    option: AnswerOption;
    isSelected: boolean;
    isCorrect: boolean;
    isSubmitted: boolean;
    onClick: () => void;
}) {
    let bgColor = 'bg-[#2A3038] hover:bg-[#323840]';
    let borderColor = 'border-[#3A4048]';
    let textColor = 'text-gray-200';

    if (isSubmitted) {
        if (isCorrect) {
            bgColor = 'bg-emerald-600/20';
            borderColor = 'border-emerald-500/50';
            textColor = 'text-emerald-300';
        } else if (isSelected) {
            bgColor = 'bg-red-600/20';
            borderColor = 'border-red-500/50';
            textColor = 'text-red-300';
        }
    } else if (isSelected) {
        bgColor = 'bg-blue-600/20';
        borderColor = 'border-blue-500/50';
        textColor = 'text-blue-300';
    }

    return (
        <button
            onClick={onClick}
            disabled={isSubmitted}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${bgColor} ${borderColor} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
        >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${borderColor} text-sm font-medium ${textColor}`}>
                {option.letter}
            </span>
            <span className={`text-left ${textColor}`}>{option.text}</span>
        </button>
    );
}

export function QuestionPanel({
    question,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    onSelectAnswer,
    onSubmitAnswer,
    onPrevious,
    onNext,
    isSubmitted,
}: QuestionPanelProps) {
    if (!question) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#1A1E23]">
                <p className="text-gray-400 text-lg">Select a question to begin</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#1A1E23] overflow-hidden">
            {/* Header with category and counter */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-[#2A3038]">
                <CategoryBadge category={question.category} />
                <span className="text-gray-400 text-sm">
                    Question {currentIndex + 1} of {totalQuestions}
                </span>
            </header>

            {/* Question content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-2xl mx-auto">
                    {/* Question Card */}
                    <div className="bg-[#252A30] rounded-2xl border border-[#3A4048] p-6 mb-6">
                        <p className="text-lg text-gray-100 leading-relaxed">
                            {question.questionText}
                        </p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3 mb-6">
                        {question.options.map((option) => (
                            <AnswerOptionButton
                                key={option.letter}
                                option={option}
                                isSelected={selectedAnswer === option.letter}
                                isCorrect={option.letter === question.correctAnswer}
                                isSubmitted={isSubmitted}
                                onClick={() => onSelectAnswer(option.letter)}
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    {!isSubmitted && (
                        <button
                            onClick={onSubmitAnswer}
                            disabled={!selectedAnswer}
                            className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${selectedAnswer
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Submit Answer
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <footer className="flex items-center justify-between px-8 py-4 border-t border-[#2A3038]">
                <button
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${currentIndex === 0
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-[#2A3038]'
                        }`}
                >
                    <ChevronLeft size={18} />
                    Previous
                </button>

                <button
                    onClick={onNext}
                    disabled={currentIndex >= totalQuestions - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${currentIndex >= totalQuestions - 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-[#2A3038]'
                        }`}
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </footer>
        </div>
    );
}

export default QuestionPanel;
