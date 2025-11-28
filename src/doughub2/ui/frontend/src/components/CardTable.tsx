import { ArrowUpDown, CheckSquare, Edit2, Square } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Card } from '../types';

type SortField = 'created' | 'modified' | 'reviews' | 'ease' | 'interval' | 'deck' | 'tags' | 'front';

interface CardTableProps {
  cards: Card[];
  selectedCardIds: number[];
  focusedCardId: number | null;
  onCardSelect: (card: Card) => void;
  onCardToggleSelect: (cardId: number) => void;
  onCardEdit: (card: Card) => void;
  sortBy: SortField;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: SortField) => void;
  searchQuery: string;
}

// Virtual scrolling for performance with large datasets
const ROW_HEIGHT = 60;
const VISIBLE_ROWS = 12;

// Helper to highlight matched text
const HighlightText = ({ text, highlight }: { text: string; highlight: string[] }) => {
  if (!highlight.length) return <span className="truncate">{text}</span>;

  const parts = text.split(new RegExp(`(${highlight.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi'));

  return (
    <span className="truncate">
      {parts.map((part, i) =>
        highlight.some(h => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="bg-[#C8A92A]/30 text-[#F0DED3] font-medium rounded-[1px] px-0.5 -mx-0.5 border-b border-[#C8A92A]">{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export function CardTable({
  cards,
  selectedCardIds,
  focusedCardId,
  onCardSelect,
  onCardToggleSelect,
  onCardEdit,
  sortBy,
  sortDirection,
  onSortChange,
  searchQuery,
}: CardTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = Math.min(startIndex + VISIBLE_ROWS + 2, cards.length);
  const visibleCards = cards.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  // Extract text terms from search query for highlighting
  const searchTerms = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const parts = searchQuery.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    return parts
      .filter(p => !p.includes(':') && !p.startsWith('-')) // Exclude fields/ops
      .map(p => p.replace(/"/g, ''));
  }, [searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Scroll to focused card
  useEffect(() => {
    if (focusedCardId && containerRef.current) {
      const index = cards.findIndex(c => c.id === focusedCardId);
      if (index >= 0) {
        const targetScroll = index * ROW_HEIGHT;
        const currentScroll = scrollTop;
        const containerHeight = VISIBLE_ROWS * ROW_HEIGHT;

        // Only scroll if card is not in view
        if (targetScroll < currentScroll || targetScroll > currentScroll + containerHeight - ROW_HEIGHT) {
          containerRef.current.scrollTop = targetScroll;
        }
      }
    }
  }, [focusedCardId, cards]);

  const SortButton = ({ field, label }: { field: typeof sortBy; label: string }) => (
    <button
      onClick={() => onSortChange(field)}
      className="flex items-center gap-1 hover:text-[#F0DED3] transition-colors"
    >
      {label}
      {sortBy === field && (
        <ArrowUpDown size={14} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
      )}
    </button>
  );

  return (
    <div className="bg-[#2F3A48] rounded-lg shadow-lg border border-[#506256] flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="border-b border-[#506256] bg-[#254341]">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[#A79385]">
          <div className="col-span-1 flex items-center">
            <button
              onClick={() => {
                if (selectedCardIds.length === cards.length) {
                  cards.forEach(c => onCardToggleSelect(c.id));
                } else {
                  cards.forEach(c => {
                    if (!selectedCardIds.includes(c.id)) {
                      onCardToggleSelect(c.id);
                    }
                  });
                }
              }}
              className="p-1 hover:bg-[#315C62] rounded transition-colors"
            >
              {selectedCardIds.length === cards.length && cards.length > 0 ? (
                <CheckSquare size={16} className="text-[#C8A92A]" />
              ) : (
                <Square size={16} />
              )}
            </button>
          </div>
          <div className="col-span-5 flex items-center gap-2">
            <SortButton field="front" label="Front" />
            <span className="text-[#506256] text-xs">|</span>
            <SortButton field="deck" label="Deck" />
            <span className="text-[#506256] text-xs">|</span>
            <SortButton field="tags" label="Tags" />
          </div>
          <div className="col-span-2">
            <SortButton field="reviews" label="Reviews" />
          </div>
          <div className="col-span-2">
            <SortButton field="ease" label="Ease" />
          </div>
          <div className="col-span-2">
            <SortButton field="modified" label="Modified" />
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#506256] scrollbar-track-[#09232A]"
        style={{ height: VISIBLE_ROWS * ROW_HEIGHT }}
      >
        <div style={{ height: cards.length * ROW_HEIGHT, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleCards.map((card, index) => {
              const actualIndex = startIndex + index;
              const isSelected = selectedCardIds.includes(card.id);
              const isFocused = focusedCardId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={(e) => {
                    if (e.shiftKey && focusedCardId) {
                      // Range selection
                      const focusedIndex = cards.findIndex(c => c.id === focusedCardId);
                      const start = Math.min(focusedIndex, actualIndex);
                      const end = Math.max(focusedIndex, actualIndex);
                      for (let i = start; i <= end; i++) {
                        if (!selectedCardIds.includes(cards[i].id)) {
                          onCardToggleSelect(cards[i].id);
                        }
                      }
                    } else if (e.ctrlKey || e.metaKey) {
                      // Multi-select
                      onCardToggleSelect(card.id);
                    } else {
                      // Single select
                      onCardSelect(card);
                    }
                  }}
                  onDoubleClick={() => onCardEdit(card)}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#506256]/30 cursor-pointer transition-colors group
                    ${isFocused ? 'bg-[#315C62] border-l-4 border-l-[#C8A92A]' : ''}
                    ${isSelected && !isFocused ? 'bg-[#254341]' : ''}
                    ${!isFocused && !isSelected ? 'hover:bg-[#254341]' : ''}
                    ${card.suspended ? 'opacity-60' : ''}
                  `}
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="col-span-1 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardToggleSelect(card.id);
                      }}
                      className="p-1 hover:bg-[#315C62] rounded transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-[#C8A92A]" />
                      ) : (
                        <Square size={16} className="text-[#858A7E]" />
                      )}
                    </button>
                  </div>

                  <div className="col-span-5 flex items-center">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#F0DED3] truncate">
                        <HighlightText text={card.front} highlight={searchTerms} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0 bg-[#9C593A] text-[#F0DED3] rounded inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap leading-tight" title={card.deck}>
                          {card.deck}
                        </span>
                        {card.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 bg-[#254341] text-[#CEA48C] rounded inline-block max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap leading-3"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 2 && (
                          <span className="text-[10px] text-[#858A7E]">
                            +{card.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center text-[#DEC28C]">
                    {card.reviews}
                    {card.lapses > 0 && (
                      <span className="ml-2 text-xs text-[#DE634D]">
                        ({card.lapses} lapses)
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className={`${card.ease < 2.0 ? 'text-[#DE634D]' :
                        card.ease < 2.5 ? 'text-[#E1A102]' :
                          'text-[#BCBA90]'
                      }`}>
                      {(card.ease * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-[#A79385] text-sm">
                      {new Date(card.modified).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardEdit(card);
                      }}
                      className="p-1.5 hover:bg-[#315C62] rounded opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Edit2 size={14} className="text-[#C8A92A]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#506256] px-4 py-2 bg-[#254341] text-sm text-[#A79385]">
        {cards.length === 0 ? (
          <p>No cards found. Try adjusting your filters.</p>
        ) : (
          <p>
            Showing {startIndex + 1}-{Math.min(endIndex, cards.length)} of {cards.length} cards
            {selectedCardIds.length > 0 && ` • ${selectedCardIds.length} selected`}
          </p>
        )}
      </div>
    </div>
  );
}