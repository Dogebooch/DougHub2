import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { CardTable } from "./CardTable";
import { CardPreview } from "./CardPreview";
import { QuickEditDialog } from "./QuickEditDialog";
import { generateMockCards } from "../utils/mockData";
import { Card, SavedFilter } from "../types";

// Mock data structure for medical flashcards
const mockDecks = [
  { id: 1, name: "Cardiology", cardCount: 12450 },
  { id: 2, name: "Neurology", cardCount: 8920 },
  { id: 3, name: "Pharmacology", cardCount: 15600 },
  { id: 4, name: "Anatomy", cardCount: 18200 },
  { id: 5, name: "Pathology", cardCount: 9830 },
];

const mockTags = [
  "High-Yield",
  "Step 1",
  "Step 2",
  "Step 3",
  "Clinical",
  "Basic Science",
  "Mechanism",
  "Side Effects",
  "Diagnosis",
  "Treatment",
  "Pathophysiology",
  "Pharmacokinetics",
  "Toxicity",
  "First Aid",
  "Boards",
  "Shelf Exam",
];

const defaultSavedFilters: SavedFilter[] = [
  {
    id: "1",
    name: "High-Yield Cards",
    searchQuery: "",
    selectedDecks: [],
    selectedTags: ["High-Yield"],
  },
  {
    id: "2",
    name: "Recently Added",
    searchQuery: "added:1",
    selectedDecks: [],
    selectedTags: [],
  },
  {
    id: "3",
    name: "Difficult Cards",
    searchQuery: "prop:ease<2.5",
    selectedDecks: [],
    selectedTags: [],
  },
];

export function BrowserScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDecks, setSelectedDecks] = useState<number[]>(
    [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    [],
  );
  const [selectedCardIds, setSelectedCardIds] = useState<
    number[]
  >([]);
  const [focusedCard, setFocusedCard] = useState<Card | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<
    "created" | "modified" | "reviews" | "ease" | "interval" | "deck" | "tags" | "front"
  >("modified");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [showSuspended, setShowSuspended] = useState(false);
  const [savedFilters] = useState<SavedFilter[]>(
    defaultSavedFilters,
  );
  const [editingCard, setEditingCard] = useState<Card | null>(
    null,
  );

  // Generate large dataset (will be replaced with AnkiConnect data)
  const allCards = useMemo(() => generateMockCards(1000), []); // Start with 1000 for demo

  // Advanced search parser
  const parseSearchQuery = (query: string) => {
    const terms: string[] = [];
    const deckFilter: string[] = [];
    const tagFilter: string[] = [];
    const fieldFilters: { field: string; value: string }[] = [];
    const stateFilters: string[] = [];

    // Parse search operators: deck:, tag:, front:, back:, is:
    const parts = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    parts.forEach((part) => {
      if (part.startsWith("deck:")) {
        deckFilter.push(part.substring(5).replace(/"/g, ""));
      } else if (part.startsWith("tag:")) {
        tagFilter.push(part.substring(4).replace(/"/g, ""));
      } else if (part.startsWith("front:")) {
        fieldFilters.push({
          field: "front",
          value: part.substring(6).replace(/"/g, ""),
        });
      } else if (part.startsWith("back:")) {
        fieldFilters.push({
          field: "back",
          value: part.substring(5).replace(/"/g, ""),
        });
      } else if (part.startsWith("is:")) {
        stateFilters.push(part.substring(3).toLowerCase());
      } else {
        terms.push(part.replace(/"/g, ""));
      }
    });

    return {
      terms,
      deckFilter,
      tagFilter,
      fieldFilters,
      stateFilters,
    };
  };

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    const {
      terms,
      deckFilter,
      tagFilter,
      fieldFilters,
      stateFilters,
    } = parseSearchQuery(searchQuery);

    return allCards
      .filter((card) => {
        // State filters (is:new, is:review, is:suspended)
        if (stateFilters.length > 0) {
          const matchesState = stateFilters.every((state) => {
            switch (state) {
              case "new":
                return card.reviews === 0;
              case "review":
                return card.reviews > 0;
              case "suspended":
                return card.suspended;
              case "learning":
                return card.interval < 1 && card.reviews > 0; // Approximation
              case "due":
                return true; // Mock assumption
              default:
                return true;
            }
          });
          if (!matchesState) return false;
        }

        // Suspended filter (independent of search query unless is:suspended is used)
        if (
          !showSuspended &&
          card.suspended &&
          !stateFilters.includes("suspended")
        )
          return false;

        // Search terms (search in front, back, tags)
        const matchesSearch =
          terms.length === 0 ||
          terms.every((term) => {
            const lowerTerm = term.toLowerCase();
            return (
              card.front.toLowerCase().includes(lowerTerm) ||
              card.back.toLowerCase().includes(lowerTerm) ||
              card.tags.some((tag) =>
                tag.toLowerCase().includes(lowerTerm),
              )
            );
          });

        // Deck filters from search
        const matchesDeckSearch =
          deckFilter.length === 0 ||
          deckFilter.some((d) =>
            card.deck.toLowerCase().includes(d.toLowerCase()),
          );

        // Tag filters from search
        const matchesTagSearch =
          tagFilter.length === 0 ||
          tagFilter.every((t) =>
            card.tags.some((tag) =>
              tag.toLowerCase().includes(t.toLowerCase()),
            ),
          );

        // Field-specific filters
        const matchesFieldFilters = fieldFilters.every(
          (filter) => {
            const value = card[filter.field as keyof Card];
            return (
              typeof value === "string" &&
              value
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            );
          },
        );

        // Selected deck filter
        const matchesDeck =
          selectedDecks.length === 0 ||
          selectedDecks.includes(
            mockDecks.find((d) => d.name === card.deck)?.id ||
              0,
          );

        // Selected tag filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => card.tags.includes(tag));

        return (
          matchesSearch &&
          matchesDeckSearch &&
          matchesTagSearch &&
          matchesFieldFilters &&
          matchesDeck &&
          matchesTags
        );
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "created":
            comparison =
              new Date(a.created).getTime() -
              new Date(b.created).getTime();
            break;
          case "modified":
            comparison =
              new Date(a.modified).getTime() -
              new Date(b.modified).getTime();
            break;
          case "reviews":
            comparison = a.reviews - b.reviews;
            break;
          case "ease":
            comparison = a.ease - b.ease;
            break;
          case "interval":
            comparison = a.interval - b.interval;
            break;
          case "deck":
            comparison = a.deck.localeCompare(b.deck);
            break;
          case "front":
            comparison = a.front.localeCompare(b.front);
            break;
          case "tags":
            // Sort by number of tags, then alphabetically by first tag
            comparison = a.tags.length - b.tags.length;
            if (comparison === 0 && a.tags.length > 0) {
              comparison = a.tags[0].localeCompare(b.tags[0]);
            }
            break;
        }

        return sortDirection === "asc"
          ? comparison
          : -comparison;
      });
  }, [
    allCards,
    searchQuery,
    selectedDecks,
    selectedTags,
    sortBy,
    sortDirection,
    showSuspended,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }

      // Ctrl/Cmd + A: Select all visible cards
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "a" &&
        !e.shiftKey
      ) {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== "INPUT" &&
          activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          setSelectedCardIds(filteredCards.map((c) => c.id));
        }
      }

      // Escape: Clear selection or filters
      if (e.key === "Escape") {
        if (selectedCardIds.length > 0) {
          setSelectedCardIds([]);
        } else if (
          searchQuery ||
          selectedDecks.length ||
          selectedTags.length
        ) {
          setSearchQuery("");
          setSelectedDecks([]);
          setSelectedTags([]);
        }
      }

      // Ctrl/Cmd + E: Quick edit focused card
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "e" &&
        focusedCard
      ) {
        e.preventDefault();
        setEditingCard(focusedCard);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [
    filteredCards,
    selectedCardIds,
    searchQuery,
    selectedDecks,
    selectedTags,
    focusedCard,
  ]);

  const handleApplySavedFilter = (filter: SavedFilter) => {
    setSearchQuery(filter.searchQuery);
    setSelectedDecks(filter.selectedDecks);
    setSelectedTags(filter.selectedTags);
  };

  const handleToggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc",
      );
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[#F0DED3]">Card Browser</h1>
            <p className="text-[#A79385]">
              {allCards.length.toLocaleString()} cards total •{" "}
              {filteredCards.length.toLocaleString()} shown
              {selectedCardIds.length > 0 &&
                ` • ${selectedCardIds.length} selected`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-[#DEC28C] cursor-pointer">
              <input
                type="checkbox"
                checked={showSuspended}
                onChange={(e) =>
                  setShowSuspended(e.target.checked)
                }
                className="w-4 h-4 text-[#C8A92A] bg-[#2F3A48] border-[#506256] rounded focus:ring-2 focus:ring-[#C8A92A]"
              />
              Show suspended
            </label>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredCards.length}
          totalCount={allCards.length}
          selectedCount={selectedCardIds.length}
          onClearSelection={() => setSelectedCardIds([])}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Filters */}
        <div className="col-span-3">
          <FilterPanel
            decks={mockDecks}
            tags={mockTags}
            selectedDecks={selectedDecks}
            selectedTags={selectedTags}
            savedFilters={savedFilters}
            onDeckToggle={(deckId) => {
              setSelectedDecks((prev) =>
                prev.includes(deckId)
                  ? prev.filter((id) => id !== deckId)
                  : [...prev, deckId],
              );
            }}
            onTagToggle={(tag) => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag],
              );
            }}
            onClearFilters={() => {
              setSelectedDecks([]);
              setSelectedTags([]);
              setSearchQuery("");
            }}
            onApplySavedFilter={handleApplySavedFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Card Table */}
        <div className="col-span-6">
          <CardTable
            cards={filteredCards}
            selectedCardIds={selectedCardIds}
            focusedCardId={focusedCard?.id || null}
            onCardSelect={(card) => setFocusedCard(card)}
            onCardToggleSelect={(cardId) => {
              setSelectedCardIds((prev) =>
                prev.includes(cardId)
                  ? prev.filter((id) => id !== cardId)
                  : [...prev, cardId],
              );
            }}
            onCardEdit={(card) => setEditingCard(card)}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleToggleSort}
            searchQuery={searchQuery}
          />
        </div>

        {/* Preview */}
        <div className="col-span-3 bg-[rgba(0,0,0,0)]">
          <CardPreview
            card={focusedCard}
            onEdit={(card) => setEditingCard(card)}
          />
        </div>
      </div>

      {/* Quick Edit Dialog */}
      {editingCard && (
        <QuickEditDialog
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={(updatedCard) => {
            // Here you would update via AnkiConnect
            console.log("Saving card:", updatedCard);
            setEditingCard(null);
          }}
          availableTags={mockTags}
        />
      )}
    </div>
  );
}
