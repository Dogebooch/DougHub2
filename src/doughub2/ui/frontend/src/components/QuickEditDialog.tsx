import { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import type { Card } from '../types';

interface QuickEditDialogProps {
  card: Card;
  onClose: () => void;
  onSave: (card: Card) => void;
  availableTags: string[];
}

export function QuickEditDialog({ card, onClose, onSave, availableTags }: QuickEditDialogProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [tags, setTags] = useState(card.tags);
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const handleSave = () => {
    onSave({
      ...card,
      front,
      back,
      tags,
      modified: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const filteredTagSuggestions = availableTags.filter(
    tag => !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2F3A48] rounded-lg shadow-2xl border border-[#506256] max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#506256] flex items-center justify-between">
          <h2 className="text-[#F0DED3]">Quick Edit Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#254341] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#A79385]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#506256] scrollbar-track-[#09232A]">
          {/* Deck */}
          <div className="mb-4">
            <label className="block text-[#A79385] mb-2">Deck</label>
            <div className="px-3 py-2 bg-[#9C593A] text-[#F0DED3] rounded inline-block">
              {card.deck}
            </div>
          </div>

          {/* Front */}
          <div className="mb-4">
            <label className="block text-[#A79385] mb-2">Front</label>
            <div className="flex gap-2">
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#09232A] border border-[#506256] rounded-lg text-[#F0DED3] placeholder-[#858A7E] focus:outline-none focus:ring-2 focus:ring-[#C8A92A] focus:border-transparent resize-none"
                rows={4}
                autoFocus
              />
              <button
                className="px-3 py-2 bg-[#254341] border border-[#506256] text-[#DEC28C] rounded-lg hover:bg-[#315C62] transition-colors flex flex-col items-center justify-center gap-2 w-24"
                title="Improve Card"
              >
                <Sparkles size={20} />
                <span className="text-xs text-center leading-tight">Improve Card</span>
              </button>
            </div>
          </div>

          {/* Back */}
          <div className="mb-4">
            <label className="block text-[#A79385] mb-2">Back</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full px-3 py-2 bg-[#09232A] border border-[#506256] rounded-lg text-[#F0DED3] placeholder-[#858A7E] focus:outline-none focus:ring-2 focus:ring-[#C8A92A] focus:border-transparent resize-none"
              rows={6}
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-[#A79385] mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[#AB613C] text-[#F0DED3] rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[#DE634D] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setShowTagSuggestions(true);
                }}
                onFocus={() => setShowTagSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTag) {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                placeholder="Add tag..."
                className="w-full px-3 py-2 bg-[#09232A] border border-[#506256] rounded-lg text-[#F0DED3] placeholder-[#858A7E] focus:outline-none focus:ring-2 focus:ring-[#C8A92A] focus:border-transparent"
              />
              {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#254341] border border-[#506256] rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                  {filteredTagSuggestions.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="w-full text-left px-3 py-2 hover:bg-[#315C62] text-[#DEC28C] hover:text-[#F0DED3] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats (read-only) */}
          <div className="border-t border-[#506256] pt-4 text-sm text-[#858A7E]">
            <p>Created: {new Date(card.created).toLocaleDateString()}</p>
            <p>Reviews: {card.reviews} • Ease: {(card.ease * 100).toFixed(0)}% • Interval: {card.interval} days</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#506256] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#DEC28C] hover:bg-[#254341] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#AB613C] text-[#F0DED3] rounded-lg hover:bg-[#C76439] transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
