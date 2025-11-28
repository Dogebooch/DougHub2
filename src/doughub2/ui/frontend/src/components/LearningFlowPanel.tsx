/**
 * LearningFlowPanel Component
 *
 * Right panel displaying the AI Learning Flow with:
 * - Learning Flow header with progress indicator
 * - Progressive learning stages
 * - Active stage with text input
 * - Locked stages with unlock requirements
 */

import { Award, Brain, Eye, Lightbulb, Lock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import type { LearningStage, StageStatus } from '../types';

interface LearningFlowPanelProps {
    stages: LearningStage[];
    currentStageIndex: number;
    onSubmitResponse: (stageId: string, response: string) => void;
    onStageComplete: (stageId: string) => void;
    /** Width of the panel in pixels */
    width?: number;
}

/** Get the icon component for a stage */
function StageIcon({ icon, status }: { icon: string; status: StageStatus }) {
    const iconClass = status === 'active'
        ? 'text-emerald-400'
        : status === 'completed'
            ? 'text-emerald-500'
            : 'text-gray-500';

    const size = 20;

    switch (icon) {
        case 'lightbulb':
            return <Lightbulb size={size} className={iconClass} />;
        case 'eye':
            return <Eye size={size} className={iconClass} />;
        case 'brain':
            return <Brain size={size} className={iconClass} />;
        case 'message-square':
            return <MessageSquare size={size} className={iconClass} />;
        case 'award':
            return <Award size={size} className={iconClass} />;
        default:
            return <Lightbulb size={size} className={iconClass} />;
    }
}

/** Progress indicator showing stage completion */
function ProgressIndicator({ stages, currentIndex }: { stages: LearningStage[]; currentIndex: number }) {
    return (
        <div className="flex gap-1.5">
            {stages.map((stage, index) => (
                <div
                    key={stage.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${index < currentIndex
                            ? 'bg-emerald-500'
                            : index === currentIndex
                                ? 'bg-emerald-400'
                                : 'bg-gray-600'
                        }`}
                />
            ))}
        </div>
    );
}

/** Active stage card with input */
function ActiveStageCard({
    stage,
    onSubmit,
}: {
    stage: LearningStage;
    onSubmit: (response: string) => void;
}) {
    const [response, setResponse] = useState('');

    const handleSubmit = () => {
        if (response.trim()) {
            onSubmit(response);
            setResponse('');
        }
    };

    return (
        <div className="bg-[#1A2520] rounded-xl border-2 border-emerald-500/50 p-4 space-y-4">
            {/* Stage Header */}
            <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <StageIcon icon={stage.icon} status="active" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-emerald-300">{stage.title}</h3>
                </div>
            </div>

            {/* Stage Description */}
            {stage.description && (
                <p className="text-sm text-gray-300 leading-relaxed">
                    {stage.description}
                </p>
            )}

            {/* Response Input */}
            <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={stage.prompt || 'Type your response here...'}
                className="w-full h-24 px-4 py-3 bg-[#0F1512] rounded-lg border border-emerald-500/30 text-gray-100 text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!response.trim()}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${response.trim()
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Submit & Continue
            </button>
        </div>
    );
}

/** Locked stage card */
function LockedStageCard({ stage }: { stage: LearningStage }) {
    return (
        <div className="bg-[#252A30] rounded-xl border border-[#3A4048] p-4 opacity-60">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                    <StageIcon icon={stage.icon} status="locked" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-400">{stage.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 italic">
                        {stage.description || 'Complete the previous stage to unlock'}
                    </p>
                </div>
                <Lock size={16} className="text-gray-500 mt-1" />
            </div>
        </div>
    );
}

/** Completed stage card */
function CompletedStageCard({ stage }: { stage: LearningStage }) {
    return (
        <div className="bg-[#1A2520] rounded-xl border border-emerald-500/30 p-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <StageIcon icon={stage.icon} status="completed" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-emerald-400">{stage.title}</h3>
                    <p className="text-sm text-emerald-300/70 mt-1">Completed ✓</p>
                </div>
            </div>
        </div>
    );
}

export function LearningFlowPanel({
    stages,
    currentStageIndex,
    onSubmitResponse,
    onStageComplete,
    width = 320,
}: LearningFlowPanelProps) {
    const handleSubmitResponse = (stageId: string, response: string) => {
        onSubmitResponse(stageId, response);
        onStageComplete(stageId);
    };

    return (
        <aside
            className="bg-[#1E2328] flex flex-col h-full flex-shrink-0"
            style={{ width: `${width}px` }}
        >
            {/* Header */}
            <header className="p-4 border-b border-[#2A3038]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                        <Award size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Learning Flow</h2>
                        <p className="text-xs text-gray-400">Complete each stage to master this question</p>
                    </div>
                </div>
                <ProgressIndicator stages={stages} currentIndex={currentStageIndex} />
            </header>

            {/* Stages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {stages.map((stage, index) => {
                    if (index < currentStageIndex) {
                        return <CompletedStageCard key={stage.id} stage={stage} />;
                    } else if (index === currentStageIndex) {
                        return (
                            <ActiveStageCard
                                key={stage.id}
                                stage={stage}
                                onSubmit={(response) => handleSubmitResponse(stage.id, response)}
                            />
                        );
                    } else {
                        return <LockedStageCard key={stage.id} stage={stage} />;
                    }
                })}
            </div>
        </aside>
    );
}

export default LearningFlowPanel;
