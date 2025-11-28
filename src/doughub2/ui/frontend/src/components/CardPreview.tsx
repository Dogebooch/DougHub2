import { Calendar, BarChart3, TrendingUp, Tag, Eye, Edit2, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Card } from '../types';

interface CardPreviewProps {
  card: Card | null;
  onEdit?: (card: Card) => void;
}

export function CardPreview({ card, onEdit }: CardPreviewProps) {
  const [showBack, setShowBack] = useState(false);

  if (!card) {
    return (
      <div className="bg-[#2F3A48] rounded-lg shadow-lg border border-[#506256] p-8 sticky top-4">
        <div className="text-center text-[#858A7E]">
          <Eye size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-[#A79385]">Select a card to preview</p>
          <p className="text-sm mt-2">Double-click to edit, or use Ctrl + E</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2F3A48] rounded-lg shadow-lg border border-[#506256] sticky top-4">
      <div className="p-4 border-b border-[#506256] flex items-center justify-between">
        <h3 className="text-[#F0DED3]">Card Preview</h3>
        {onEdit && (
          <button
            onClick={() => onEdit(card)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#AB613C] text-[#F0DED3] rounded-lg hover:bg-[#C76439] transition-colors text-sm"
          >
            <Edit2 size={14} />
            Edit
          </button>
        )}
      </div>

      <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#506256] scrollbar-track-[#09232A]">
        {/* Deck Badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block px-3 py-1.5 bg-[#9C593A] text-[#F0DED3] rounded">
            {card.deck}
          </span>
          {card.suspended && (
            <span className="inline-block px-3 py-1.5 bg-[#BA9137] text-[#09232A] rounded text-sm">
              Suspended
            </span>
          )}
        </div>

        {/* Front of Card */}
        <div className="mb-4">
          <label className="block text-[#A79385] mb-2 text-sm">Front</label>
          <div className="p-4 bg-[#254341] rounded-lg border border-[#315C62]">
            <p className="text-[#F0DED3]">{card.front}</p>
          </div>
        </div>

        {/* Back of Card */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[#A79385] text-sm">Back</label>
            <button
              onClick={() => setShowBack(!showBack)}
              className="text-[#C8A92A] hover:text-[#E1A102] text-sm transition-colors"
            >
              {showBack ? 'Hide' : 'Show'} Answer
            </button>
          </div>
          <div className={`p-4 rounded-lg border transition-all ${
            showBack 
              ? 'bg-[#254341] border-[#759194]' 
              : 'bg-[#09232A] border-[#506256]'
          }`}>
            {showBack ? (
              <p className="text-[#F0DED3]">{card.back}</p>
            ) : (
              <p className="text-[#858A7E] italic">Click "Show Answer" to reveal</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-[#DE9C73]" />
            <label className="block text-[#A79385] text-sm">Tags</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-[#AB613C] text-[#F0DED3] rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t border-[#506256] pt-4">
          <h4 className="text-[#DEC28C] mb-3">Statistics</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A79385]">
                <Calendar size={16} />
                <span>Created</span>
              </div>
              <span className="text-[#DEC28C]">
                {new Date(card.created).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A79385]">
                <Clock size={16} />
                <span>Modified</span>
              </div>
              <span className="text-[#DEC28C]">
                {new Date(card.modified).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A79385]">
                <BarChart3 size={16} />
                <span>Reviews</span>
              </div>
              <span className="text-[#DEC28C]">
                {card.reviews}
                {card.lapses > 0 && (
                  <span className="ml-2 text-[#DE634D]">({card.lapses} lapses)</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A79385]">
                <TrendingUp size={16} />
                <span>Ease Factor</span>
              </div>
              <span className={`${
                card.ease < 2.0 ? 'text-[#DE634D]' :
                card.ease < 2.5 ? 'text-[#E1A102]' :
                'text-[#BCBA90]'
              }`}>
                {(card.ease * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A79385]">
                <Clock size={16} />
                <span>Interval</span>
              </div>
              <span className="text-[#DEC28C]">
                {card.interval} {card.interval === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
