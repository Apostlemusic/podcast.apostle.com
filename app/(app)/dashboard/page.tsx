'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import router
import { getMyPodcasts, removePodcast, hidePodcast, unhidePodcast } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PodcastCard from '@/components/podcast-card';
import {
  Plus,
  Mic,
  Headphones,
  EyeOff,
  LayoutDashboard,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Podcast {
  _id: string;
  title: string;
  author: string;
  trackImg: string;
  listenCount: number;
  collaborators?: Array<{ name: string }>;
  isHidden?: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // Declare router

  useEffect(() => {
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

    loadPodcasts();
  }, []);

  const totalListens = podcasts.reduce((acc, p) => acc + (p.listenCount || 0), 0);
  const totalPodcasts = podcasts.length;
  const hiddenPodcasts = podcasts.filter(p => p.isHidden).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <Link href="/podcast/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Create Podcast
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Podcasts</p>
              <p className="text-3xl font-bold text-foreground">{totalPodcasts}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Listens</p>
              <p className="text-3xl font-bold text-foreground">{totalListens.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Headphones className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Hidden Podcasts</p>
              <p className="text-3xl font-bold text-foreground">{hiddenPodcasts}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <EyeOff className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Podcasts Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Your Podcasts</h2>

        {error && (
          <Card className="bg-destructive/10 border-destructive p-4 mb-4">
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
                onRemove={async () => {
                  if (confirm('Are you sure you want to remove this podcast?')) {
                    try {
                      await removePodcast(podcast._id);
                      setPodcasts(podcasts.filter((p) => p._id !== podcast._id));
                    } catch (err: any) {
                      setError(err.message || 'Failed to remove podcast');
                    }
                  }
                }}
                onHideToggle={async () => {
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
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
