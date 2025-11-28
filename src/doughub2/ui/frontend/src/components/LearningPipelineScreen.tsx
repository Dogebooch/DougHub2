import { Sparkles, BookOpen, Stethoscope, ClipboardCheck } from 'lucide-react';

export function LearningPipelineScreen() {
  const mockQuestion = {
    text: `A 45-year-old male presents to the emergency department with a 2-hour history of severe, crushing substernal chest pain radiating to the left arm. He reports associated diaphoresis and nausea. Past medical history is significant for hypertension and hyperlipidemia. Vital signs reveal a blood pressure of 150/90 mmHg, heart rate of 110 bpm, and respiratory rate of 22/min. An ECG is performed immediately.`,
    source: "Harrison's Principles of Internal Medicine"
  };

  return (
    <div className="h-full flex bg-[#2C3134] overflow-hidden">
      {/* Left Panel - Question Source */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-[#506256]">
        <div className="bg-[#2F3A48] rounded-lg border border-[#506256] p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-[#C8A92A]">
            <BookOpen size={20} />
            <span className="text-sm uppercase tracking-wider font-bold">Case Study Source</span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-[#F0DED3] leading-relaxed font-serif">
              {mockQuestion.text}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#506256] flex items-center justify-between text-sm text-[#A79385]">
            <span>Source: {mockQuestion.source}</span>
            <button className="flex items-center gap-2 text-[#DEC28C] hover:text-[#F0DED3]">
              <Sparkles size={16} />
              Analyze with AI
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Learning Pipeline */}
      <div className="w-1/2 flex flex-col bg-[#252A2D]">
        <div className="p-4 bg-[#2F3A48] border-b border-[#506256]">
          <h3 className="text-[#F0DED3] font-medium flex items-center gap-2">
            <Sparkles size={18} className="text-[#C8A92A]" />
            AI Learning Pipeline
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Pane 1 */}
          <div className="bg-[#2F3A48] rounded-lg border border-[#506256] overflow-hidden">
            <div className="p-3 bg-[#254341] border-b border-[#506256] flex items-center justify-between">
              <span className="text-[#DEC28C] font-medium flex items-center gap-2">
                <BookOpen size={16} />
                1. Concept Extraction
              </span>
              <span className="text-xs text-[#A79385]">Waiting...</span>
            </div>
            <div className="p-4 h-32 flex items-center justify-center text-[#506256]">
              <p>Identify key medical concepts and terminology</p>
            </div>
          </div>

          {/* Pane 2 */}
          <div className="bg-[#2F3A48] rounded-lg border border-[#506256] overflow-hidden">
            <div className="p-3 bg-[#254341] border-b border-[#506256] flex items-center justify-between">
              <span className="text-[#DEC28C] font-medium flex items-center gap-2">
                <Stethoscope size={16} />
                2. Clinical Reasoning
              </span>
              <span className="text-xs text-[#A79385]">Waiting...</span>
            </div>
            <div className="p-4 h-32 flex items-center justify-center text-[#506256]">
              <p>Connect symptoms to potential pathologies</p>
            </div>
          </div>

          {/* Pane 3 */}
          <div className="bg-[#2F3A48] rounded-lg border border-[#506256] overflow-hidden">
            <div className="p-3 bg-[#254341] border-b border-[#506256] flex items-center justify-between">
              <span className="text-[#DEC28C] font-medium flex items-center gap-2">
                <ClipboardCheck size={16} />
                3. Knowledge Consolidation
              </span>
              <span className="text-xs text-[#A79385]">Waiting...</span>
            </div>
            <div className="p-4 h-32 flex items-center justify-center text-[#506256]">
              <p>Generate flashcards and summary points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
