'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPodcast } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import CollaboratorSelector from '@/components/collaborator-selector';
import FileUpload from '@/components/file-upload';

export default function CreatePodcastPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [trackImg, setTrackImg] = useState('');
  const [category, setCategory] = useState<string[]>(['podcast']);
  const [genre, setGenre] = useState<string[]>(['talk']);
  const [artistIds, setArtistIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await uploadPodcast({
        title,
        author,
        trackUrl,
        trackImg,
        category,
        genre,
        artistIds,
      });

      router.push('/dashboard?success=Podcast created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create podcast');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Create Podcast</h1>
        <p className="text-muted-foreground">Share your voice with the world</p>
      </div>

      <Card className="bg-card border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive-foreground rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Episode Title"
              required
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author</label>
            <Input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your Name"
              required
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Audio URL</label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="url"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <FileUpload
                onUpload={(url) => setTrackUrl(url)}
                resourceType="video"
                accept="audio/*,video/*"
                buttonText="Upload Audio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cover Image URL</label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="url"
                  value={trackImg}
                  onChange={(e) => setTrackImg(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <FileUpload
                onUpload={(url) => setTrackImg(url)}
                resourceType="image"
                accept="image/*"
                buttonText="Upload Image"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <Input
                type="text"
                value={category[0] || ''}
                onChange={(e) => setCategory([e.target.value || 'podcast'])}
                placeholder="podcast"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Genre</label>
              <Input
                type="text"
                value={genre[0] || ''}
                onChange={(e) => setGenre([e.target.value || 'talk'])}
                placeholder="talk"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          {/* Collaborator Selection */}
          <CollaboratorSelector
            selectedIds={artistIds}
            onSelectionChange={setArtistIds}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Podcast'}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
