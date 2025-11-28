import { AlertCircle, ChevronDown, ChevronRight, Clock, Filter, FolderOpen, Layers, PauseCircle, Pen, PlayCircle, RotateCw, Search, Settings, Share, Star, Tag, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { SavedFilter } from '../types';

interface FilterPanelProps {
  decks: Array<{ id: number; name: string; cardCount: number }>;
  tags: string[];
  selectedDecks: number[];
  selectedTags: string[];
  savedFilters: SavedFilter[];
  onDeckToggle: (deckId: number) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  onApplySavedFilter: (filter: SavedFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#506256] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#254341] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#BA9137]" />
          <h4 className="text-[#DEC28C] font-medium">{title}</h4>
        </div>
        {isOpen ? (
          <ChevronDown size={16} className="text-[#858A7E]" />
        ) : (
          <ChevronRight size={16} className="text-[#858A7E]" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export function FilterPanel({
  decks,
  tags,
  selectedDecks,
  selectedTags,
  savedFilters,
  onDeckToggle,
  onTagToggle,
  onClearFilters,
  onApplySavedFilter,
  searchQuery,
  onSearchQueryChange,
}: FilterPanelProps) {
  const [deckQuery, setDeckQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    deckId: number;
    deckName: string;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = selectedDecks.length > 0 || selectedTags.length > 0 || searchQuery.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSearchToken = (token: string) => {
    const parts = searchQuery.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const exists = parts.some(p => p.toLowerCase() === token.toLowerCase());

    if (exists) {
      onSearchQueryChange(parts.filter(p => p.toLowerCase() !== token.toLowerCase()).join(' '));
    } else {
      onSearchQueryChange(searchQuery ? `${searchQuery} ${token}` : token);
    }
  };

  const hasToken = (token: string) => {
    return (searchQuery.match(/(?:[^\s"]+|"[^"]*")+/g) || [])
      .some(p => p.toLowerCase() === token.toLowerCase());
  };

  const handleContextMenu = (e: React.MouseEvent, deckId: number, deckName: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      deckId,
      deckName
    });
  };

  // Filter and format decks
  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(deckQuery.toLowerCase())
  );

  const getDeckDisplay = (fullName: string) => {
    const parts = fullName.split('::');
    const leaf = parts[parts.length - 1];
    const path = parts.slice(0, -1).join(' / ');
    return { leaf, path };
  };

  return (
    <div className="bg-[#2F3A48] rounded-lg shadow-lg border border-[#506256] sticky top-4 max-h-[calc(100vh-100px)] flex flex-col relative">
      <div className="p-4 border-b border-[#506256] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#C8A92A]" />
            <h3 className="text-[#F0DED3] font-medium">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[#C8A92A] hover:text-[#E1A102] flex items-center gap-1 text-sm transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#506256] scrollbar-track-[#2F3A48]">
        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <CollapsibleSection title="Saved Filters" icon={Star} defaultOpen={true}>
            <div className="space-y-1">
              {savedFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => onApplySavedFilter(filter)}
                  className="w-full text-left px-3 py-2 rounded bg-[#254341]/50 hover:bg-[#315C62] text-[#DEC28C] hover:text-[#F4B696] transition-colors text-sm flex items-center gap-2"
                >
                  <Star size={12} className="text-[#E1A102]" />
                  {filter.name}
                </button>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Card State */}
        <CollapsibleSection title="Card State" icon={Clock} defaultOpen={true}>
          <div className="space-y-1">
            {[
              { id: 'is:new', label: 'New', icon: PlayCircle, color: 'text-green-500' },
              { id: 'is:learning', label: 'Learning', icon: RotateCw, color: 'text-blue-500' },
              { id: 'is:review', label: 'Review', icon: Clock, color: 'text-purple-400' },
              { id: 'is:suspended', label: 'Suspended', icon: PauseCircle, color: 'text-[#C8A92A]' },
              { id: 'is:due', label: 'Due', icon: AlertCircle, color: 'text-[#DE634D]' },
            ].map(state => {
              const isActive = hasToken(state.id);
              return (
                <button
                  key={state.id}
                  onClick={() => toggleSearchToken(state.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm
                    ${isActive
                      ? 'bg-[#315C62] text-[#F0DED3]'
                      : 'hover:bg-[#254341] text-[#A79385]'
                    }`}
                >
                  <state.icon size={14} className={isActive ? 'text-[#F0DED3]' : state.color} />
                  <span>{state.label}</span>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Decks Section */}
        <CollapsibleSection title="Decks" icon={FolderOpen} defaultOpen={true}>
          <div className="mb-3 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858A7E]" size={14} />
            <input
              type="text"
              placeholder="Filter decks..."
              value={deckQuery}
              onChange={(e) => setDeckQuery(e.target.value)}
              className="w-full bg-[#254341] border border-[#506256] rounded pl-8 pr-3 py-1.5 text-xs text-[#F0DED3] placeholder-[#506256] focus:outline-none focus:border-[#C8A92A]"
            />
          </div>
          <div className="space-y-1 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#506256] scrollbar-track-transparent pr-1">
            {filteredDecks.length > 0 ? (
              filteredDecks.map(deck => {
                const { leaf, path } = getDeckDisplay(deck.name);
                return (
                  <div
                    key={deck.id}
                    onContextMenu={(e) => handleContextMenu(e, deck.id, deck.name)}
                    className="flex items-start gap-2 p-2 rounded hover:bg-[#254341] cursor-pointer group transition-colors relative"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDecks.includes(deck.id)}
                      onChange={() => onDeckToggle(deck.id)}
                      className="mt-0.5 w-4 h-4 text-[#C8A92A] bg-[#09232A] border-[#506256] rounded focus:ring-2 focus:ring-[#C8A92A] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0" onClick={() => onDeckToggle(deck.id)}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#DEC28C] group-hover:text-[#F0DED3] text-sm font-medium truncate transition-colors">
                          {leaf}
                        </span>
                        <span className="text-[#858A7E] text-[10px] bg-[#09232A] px-1.5 py-0.5 rounded flex-shrink-0">
                          {deck.cardCount.toLocaleString()}
                        </span>
                      </div>
                      {path && (
                        <p className="text-[#506256] group-hover:text-[#858A7E] text-xs truncate transition-colors">
                          {path}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-[#506256] text-xs italic">
                No decks found
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Tags Section */}
        <CollapsibleSection title="Tags" icon={Tag} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${selectedTags.includes(tag)
                    ? 'bg-[#AB613C] border-[#AB613C] text-[#F0DED3]'
                    : 'bg-[#254341] border-[#506256] text-[#A79385] hover:border-[#AB613C] hover:text-[#DEC28C]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="p-3 border-t border-[#506256] bg-[#09232A] text-xs text-[#858A7E] flex-shrink-0 rounded-b-lg">
        <p className="mb-1 text-[#A79385]">Keyboard shortcuts:</p>
        <ul className="space-y-0.5 ml-3">
          <li>Ctrl+F - Focus search</li>
          <li>Ctrl+A - Select all</li>
          <li>Ctrl+E - Quick edit</li>
          <li>Esc - Clear selection</li>
        </ul>
      </div>

      {/* Context Menu Portal */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 w-48 bg-[#2F3A48] border border-[#506256] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-2 border-b border-[#506256] mb-1">
            <p className="text-[#C8A92A] text-xs font-medium truncate">{contextMenu.deckName}</p>
          </div>
          <button className="w-full text-left px-3 py-1.5 text-[#DEC28C] hover:bg-[#315C62] hover:text-[#F0DED3] text-sm flex items-center gap-2 transition-colors">
            <Pen size={14} />
            <span>Rename</span>
          </button>
          <button className="w-full text-left px-3 py-1.5 text-[#DEC28C] hover:bg-[#315C62] hover:text-[#F0DED3] text-sm flex items-center gap-2 transition-colors">
            <Settings size={14} />
            <span>Options</span>
          </button>
          <button className="w-full text-left px-3 py-1.5 text-[#DEC28C] hover:bg-[#315C62] hover:text-[#F0DED3] text-sm flex items-center gap-2 transition-colors">
            <Share size={14} />
            <span>Export</span>
          </button>
          <button className="w-full text-left px-3 py-1.5 text-[#DEC28C] hover:bg-[#315C62] hover:text-[#F0DED3] text-sm flex items-center gap-2 transition-colors">
            <Layers size={14} />
            <span>Custom Study</span>
          </button>
          <div className="my-1 border-t border-[#506256]" />
          <button className="w-full text-left px-3 py-1.5 text-[#DE634D] hover:bg-[#DE634D]/10 text-sm flex items-center gap-2 transition-colors">
            <Trash size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}