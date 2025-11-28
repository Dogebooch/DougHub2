/**
 * QuestionSidebar Component
 *
 * Left panel displaying the Question Bank with:
 * - Header with title and completion count
 * - Status filter counts (Completed, In Progress, Not Started)
 * - Scrollable list of questions with category badges
 */

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Question, QuestionStatus } from '../types';

interface QuestionSidebarProps {
    questions: Question[];
    selectedQuestionId: number | null;
    onSelectQuestion: (questionId: number) => void;
    statusFilter?: QuestionStatus | null;
    onFilterChange?: (status: QuestionStatus | null) => void;
}

/** Status icon component */
function StatusIcon({ status }: { status: QuestionStatus }) {
    switch (status) {
        case 'completed':
            return <CheckCircle2 size={18} className="text-emerald-400" />;
        case 'in-progress':
            return <Clock size={18} className="text-amber-400" />;
        case 'not-started':
            return <Circle size={18} className="text-gray-400" />;
    }
}

/** Category badge colors based on category name */
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'Cardiology': 'bg-emerald-600/80 text-emerald-100',
        'Infectious Disease': 'bg-orange-600/80 text-orange-100',
        'Endocrinology': 'bg-purple-600/80 text-purple-100',
        'Neurology': 'bg-blue-600/80 text-blue-100',
        'Pulmonology': 'bg-cyan-600/80 text-cyan-100',
        'Gastroenterology': 'bg-yellow-600/80 text-yellow-100',
    };
    return colors[category] || 'bg-gray-600/80 text-gray-100';
}

export function QuestionSidebar({
    questions,
    selectedQuestionId,
    onSelectQuestion,
    statusFilter,
    onFilterChange,
}: QuestionSidebarProps) {
    // Calculate counts
    const completedCount = questions.filter(q => q.status === 'completed').length;
    const inProgressCount = questions.filter(q => q.status === 'in-progress').length;
    const notStartedCount = questions.filter(q => q.status === 'not-started').length;

    // Filter questions based on selected filter
    const filteredQuestions = statusFilter
        ? questions.filter(q => q.status === statusFilter)
        : questions;

    return (
        <aside className="w-[280px] bg-[#1E2328] flex flex-col h-full border-r border-[#2A3038]">
            {/* Header */}
            <header className="p-4 border-b border-[#2A3038]">
                <h1 className="text-lg font-semibold text-white">Question Bank</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {completedCount} of {questions.length} completed
                </p>
            </header>

            {/* Status Filters */}
            <div className="px-4 py-3 space-y-1 border-b border-[#2A3038]">
                <button
                    onClick={() => onFilterChange?.(statusFilter === 'completed' ? null : 'completed')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === 'completed'
                            ? 'bg-emerald-600/20 text-emerald-400'
                            : 'text-gray-300 hover:bg-[#2A3038]'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        Completed
                    </span>
                    <span className="font-medium">{completedCount}</span>
                </button>

                <button
                    onClick={() => onFilterChange?.(statusFilter === 'in-progress' ? null : 'in-progress')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === 'in-progress'
                            ? 'bg-amber-600/20 text-amber-400'
                            : 'text-gray-300 hover:bg-[#2A3038]'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <Clock size={16} className="text-amber-400" />
                        In Progress
                    </span>
                    <span className="font-medium">{inProgressCount}</span>
                </button>

                <button
                    onClick={() => onFilterChange?.(statusFilter === 'not-started' ? null : 'not-started')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === 'not-started'
                            ? 'bg-gray-600/20 text-gray-300'
                            : 'text-gray-300 hover:bg-[#2A3038]'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <Circle size={16} className="text-gray-400" />
                        Not Started
                    </span>
                    <span className="font-medium">{notStartedCount}</span>
                </button>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {filteredQuestions.map((question, index) => (
                        <button
                            key={question.id}
                            onClick={() => onSelectQuestion(question.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                                selectedQuestionId === question.id
                                    ? 'bg-[#254341] border border-emerald-500/50'
                                    : 'bg-[#252A30] hover:bg-[#2A3038] border border-transparent'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <StatusIcon status={question.status} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-gray-400 text-xs font-medium">Q{index + 1}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(question.category)}`}>
                                            {question.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-200 line-clamp-2">
                                        {question.questionText}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default QuestionSidebar;
