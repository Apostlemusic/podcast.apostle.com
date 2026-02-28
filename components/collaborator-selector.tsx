'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Artist {
  _id: string;
  name: string;
  email: string;
}

interface CollaboratorSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function CollaboratorSelector({
  selectedIds,
  onSelectionChange,
}: CollaboratorSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  // Search artists when query changes
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await api.searchArtists(searchQuery);
        setResults(response.data || response || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [searchQuery]);

  const toggleArtist = (artist: Artist) => {
    const isSelected = selectedIds.includes(artist._id);

    if (isSelected) {
      const newIds = selectedIds.filter((id) => id !== artist._id);
      onSelectionChange(newIds);
      setSelectedArtists(selectedArtists.filter((a) => a._id !== artist._id));
    } else {
      onSelectionChange([...selectedIds, artist._id]);
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const removeArtist = (artistId: string) => {
    const newIds = selectedIds.filter((id) => id !== artistId);
    onSelectionChange(newIds);
    setSelectedArtists(selectedArtists.filter((a) => a._id !== artistId));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Add Collaborators</label>

        {/* Search Input */}
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for artists..."
            className="bg-input border-border text-foreground"
          />

          {isSearching && (
            <div className="absolute right-3 top-3 text-muted-foreground text-sm">
              Searching...
            </div>
          )}

          {/* Dropdown Results */}
          {isOpen && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 max-h-64 overflow-y-auto">
              {results.length === 0 && !isSearching ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No artists found
                </div>
              ) : (
                results.map((artist) => (
                  <button
                    key={artist._id}
                    type="button"
                    onClick={() => {
                      toggleArtist(artist);
                      setSearchQuery('');
                      setResults([]);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${
                      selectedIds.includes(artist._id)
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : ''
                    }`}
                  >
                    <p className="font-medium text-foreground">{artist.name}</p>
                    <p className="text-xs text-muted-foreground">{artist.email}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Selected Collaborators */}
      {selectedArtists.length > 0 && (
        <Card className="bg-secondary border-border p-4">
          <p className="text-sm font-medium text-foreground mb-3">Selected Collaborators:</p>
          <div className="flex flex-wrap gap-2">
            {selectedArtists.map((artist) => (
              <div
                key={artist._id}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                <span>{artist.name}</span>
                <button
                  type="button"
                  onClick={() => removeArtist(artist._id)}
                  className="hover:opacity-70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
