'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMyPodcasts, removePodcast, hidePodcast, unhidePodcast } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PodcastCard from '@/components/podcast-card';

interface Podcast {
  _id: string;
  title: string;
  author: string;
  trackImg: string;
  listenCount: number;
  collaborators?: Array<{ name: string }>;
  isHidden?: boolean;
}

export default function MyPodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await getMyPodcasts();
      const data = response.data;
      const podcastsData = Array.isArray(data) ? data : (data?.podcasts || []);
      setPodcasts(podcastsData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load podcasts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  const handleRemove = async (podcastId: string) => {
    if (confirm('Are you sure you want to remove this podcast?')) {
      try {
        await removePodcast(podcastId);
        setPodcasts(podcasts.filter((p) => p._id !== podcastId));
      } catch (err: any) {
        setError(err.message || 'Failed to remove podcast');
      }
    }
  };

  const handleHideToggle = async (podcast: Podcast) => {
    try {
      if (podcast.isHidden) {
        await unhidePodcast(podcast._id);
      } else {
        await hidePodcast(podcast._id);
      }
      setPodcasts(
        podcasts.map((p) =>
          p._id === podcast._id ? { ...p, isHidden: !p.isHidden } : p
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update podcast visibility');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Podcasts</h1>
          <p className="text-muted-foreground">Manage all your podcasts</p>
        </div>
        <Link href="/podcast/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            ➕ Create New
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="bg-destructive/10 border-destructive p-4">
          <p className="text-destructive-foreground">{error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your podcasts...</p>
        </div>
      ) : podcasts.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven&apos;t created any podcasts yet.</p>
          <Link href="/podcast/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Your First Podcast
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              podcast={podcast}
              isOwner
              onEdit={() => router.push(`/podcast/edit/${podcast._id}`)}
              onRemove={() => handleRemove(podcast._id)}
              onHideToggle={() => handleHideToggle(podcast)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
