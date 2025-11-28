import { HelpCircle, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  selectedCount?: number;
  onClearSelection?: () => void;
}

// Parse search query into visual tokens
type SearchToken = {
  type: 'deck' | 'tag' | 'field' | 'operator' | 'text';
  operator?: string;
  value: string;
  raw: string;
  color: string;
};

const parseSearchTokens = (query: string): SearchToken[] => {
  if (!query.trim()) return [];

  const tokens: SearchToken[] = [];
  const parts = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

  parts.forEach(part => {
    const cleanPart = part.replace(/"/g, '');

    if (part.startsWith('deck:')) {
      tokens.push({
        type: 'deck',
        operator: 'deck',
        value: cleanPart.substring(5),
        raw: part,
        color: 'bg-[#9C593A] text-[#F0DED3]'
      });
    } else if (part.startsWith('tag:')) {
      tokens.push({
        type: 'tag',
        operator: 'tag',
        value: cleanPart.substring(4),
        raw: part,
        color: 'bg-[#AB613C] text-[#F0DED3]'
      });
    } else if (part.startsWith('front:')) {
      tokens.push({
        type: 'field',
        operator: 'front',
        value: cleanPart.substring(6),
        raw: part,
        color: 'bg-[#315C62] text-[#DEC28C]'
      });
    } else if (part.startsWith('back:')) {
      tokens.push({
        type: 'field',
        operator: 'back',
        value: cleanPart.substring(5),
        raw: part,
        color: 'bg-[#315C62] text-[#DEC28C]'
      });
    } else if (part.startsWith('is:')) {
      tokens.push({
        type: 'operator',
        operator: 'is',
        value: cleanPart.substring(3),
        raw: part,
        color: 'bg-[#C8A92A] text-[#09232A]'
      });
    } else if (part.startsWith('added:') || part.startsWith('rated:') || part.startsWith('prop:')) {
      const [op, val] = cleanPart.split(':');
      tokens.push({
        type: 'operator',
        operator: op,
        value: val,
        raw: part,
        color: 'bg-[#759194] text-[#F0DED3]'
      });
    } else if (part.startsWith('-')) {
      tokens.push({
        type: 'operator',
        operator: 'NOT',
        value: cleanPart.substring(1),
        raw: part,
        color: 'bg-[#DE634D] text-[#F0DED3]'
      });
    } else {
      tokens.push({
        type: 'text',
        value: cleanPart,
        raw: part,
        color: 'bg-[#254341] text-[#DEC28C]'
      });
    }
  });

  return tokens;
};

const searchSuggestions = [
  { syntax: 'deck:', description: 'Filter by deck name', example: 'deck:Cardiology' },
  { syntax: 'tag:', description: 'Filter by tag', example: 'tag:High-Yield' },
  { syntax: '-tag:', description: 'Exclude tag', example: '-tag:Easy' },
  { syntax: 'front:', description: 'Search front field', example: 'front:ECG' },
  { syntax: 'back:', description: 'Search back field', example: 'back:treatment' },
  { syntax: 'prop:due=0', description: 'Show cards due today', example: 'prop:due=0' },
  { syntax: 'is:suspended', description: 'Show suspended cards', example: 'is:suspended' },
  { syntax: 'is:new', description: 'Show new cards', example: 'is:new' },
  { syntax: 'is:review', description: 'Show review cards', example: 'is:review' },
  { syntax: 'is:due', description: 'Show due cards', example: 'is:due' },
  { syntax: 'added:', description: 'Cards added N days ago', example: 'added:7' },
  { syntax: 'rated:', description: 'Cards reviewed N days ago', example: 'rated:30' },
  { syntax: '-', description: 'Exclude term (NOT)', example: '-tag:Skip' },
];

export function SearchBar({
  value,
  onChange,
  resultCount,
  totalCount,
  selectedCount = 0,
  onClearSelection
}: SearchBarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tokens = parseSearchTokens(value);

  const handleRemoveToken = (tokenToRemove: SearchToken) => {
    const parts = value.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const newParts = parts.filter(part => part !== tokenToRemove.raw);
    onChange(newParts.join(' '));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length > 0);
    if (newValue.length > 0) {
      setShowHelp(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newQuery = value ? `${value} ${inputValue.trim()}` : inputValue.trim();
      onChange(newQuery);
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
      // Remove last token on backspace
      handleRemoveToken(tokens[tokens.length - 1]);
    }
  };

  const filteredSuggestions = searchSuggestions.filter(s =>
    inputValue && s.syntax.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="bg-[#2F3A48] rounded-lg shadow-lg border border-[#506256] p-4">
      <div className="relative">
        <div className="flex items-center gap-2 w-full pl-10 pr-20 py-2 bg-[#09232A] border border-[#315C62] rounded-lg focus-within:ring-2 focus-within:ring-[#C8A92A] focus-within:border-transparent min-h-[48px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858A7E] pointer-events-none" size={20} />

          {/* Search Tokens */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {tokens.map((token, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm ${token.color} group`}
              >
                {token.operator && (
                  <span className="opacity-75">{token.operator}:</span>
                )}
                <span>{token.value}</span>
                <button
                  onClick={() => handleRemoveToken(token)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Input for new terms */}
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              placeholder={tokens.length === 0 ? "Search cards..." : ""}
              className="flex-1 min-w-[120px] bg-transparent border-none text-[#F0DED3] placeholder-[#858A7E] focus:outline-none"
            />
          </div>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            onClick={() => {
              setShowHelp(!showHelp);
              setShowSuggestions(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[#858A7E] hover:text-[#C8A92A] hover:bg-[#315C62]/50 transition-colors text-sm"
            title="Search syntax help"
          >
            <HelpCircle size={16} />
            <span>Search Functions</span>
          </button>
          {(value || inputValue) && (
            <button
              onClick={() => {
                onChange('');
                setInputValue('');
              }}
              className="text-[#858A7E] hover:text-[#DE634D] transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#254341] border border-[#506256] rounded-lg shadow-xl z-20 max-h-72 overflow-y-auto">
            {filteredSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newQuery = value ? `${value} ${suggestion.syntax}` : suggestion.syntax;
                  onChange(newQuery);
                  setInputValue('');
                  setShowSuggestions(false);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#315C62] transition-colors border-b border-[#506256]/30 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <code className="text-[#C8A92A]">{suggestion.syntax}</code>
                    <p className="text-sm text-[#A79385] mt-0.5">{suggestion.description}</p>
                  </div>
                  <span className="text-xs text-[#858A7E] whitespace-nowrap">{suggestion.example}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showHelp && (
        <div className="mt-3 p-4 bg-[#254341] border border-[#315C62] rounded text-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#F4B696]">Search Functions</p>
            <button
              onClick={() => setShowHelp(false)}
              className="text-[#858A7E] hover:text-[#F0DED3]"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {searchSuggestions.slice(0, 8).map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <button
                  onClick={() => {
                    const newQuery = value ? `${value} ${suggestion.syntax}` : suggestion.syntax;
                    onChange(newQuery);
                    setInputValue('');
                    setShowHelp(false);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="text-[#C8A92A] text-xs whitespace-nowrap hover:text-[#E1A102] hover:bg-[#315C62] px-1.5 py-0.5 rounded transition-colors cursor-pointer font-mono"
                >
                  {suggestion.syntax}
                </button>
                <span className="text-[#DEC28C] text-xs">{suggestion.description}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#506256]/50">
            <p className="text-[#F4B696] text-xs font-medium mb-2">Search Tips</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#DEC28C] mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-[#09232A] px-1.5 py-0.5 rounded text-[#C8A92A]">"text"</span>
                <span>Exact match</span>
              </div>
            </div>
            <p className="text-[#858A7E] text-xs">
              💡 Type an operator and press Enter to add. Use Backspace to remove tokens.
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[#A79385]">
        <span>
          Showing <span className="text-[#C8A92A]">{resultCount.toLocaleString()}</span> of {totalCount.toLocaleString()} cards
          {selectedCount > 0 && (
            <>
              {' • '}
              <span className="text-[#E1A102]">{selectedCount}</span> selected
            </>
          )}
        </span>
        {selectedCount > 0 && onClearSelection && (
          <button
            onClick={onClearSelection}
            className="text-[#C8A92A] hover:text-[#E1A102] text-sm transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}