'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface PodcastCardProps {
  podcast: {
    _id: string;
    title: string;
    author: string;
    trackImg: string;
    listenCount?: number;
    collaborators?: Array<{ name: string }>;
    isHidden?: boolean;
  };
  isOwner?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  onHideToggle?: () => void;
}

export default function PodcastCard({
  podcast,
  isOwner,
  onEdit,
  onRemove,
  onHideToggle,
}: PodcastCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-lg">
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden relative">
        {podcast.trackImg && (
          <img
            src={podcast.trackImg || "/placeholder.svg"}
            alt={podcast.title}
            className="w-full h-full object-cover"
          />
        )}
        {podcast.isHidden && (
          <div className="absolute top-2 right-2 bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
            Hidden
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/podcast/${podcast._id}`}>
          <h3 className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
            {podcast.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3">{podcast.author}</p>

        {/* Collaborators */}
        {podcast.collaborators && podcast.collaborators.length > 0 && (
          <div className="mb-3 pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Collaborators:</p>
            <div className="flex flex-wrap gap-1">
              {podcast.collaborators.map((collab, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {collab.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between items-center text-sm mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Headphones className="w-4 h-4" />
            <span>{(podcast.listenCount || 0).toLocaleString()} listens</span>
          </div>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="space-y-2">
            <Button
              onClick={onEdit}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={onHideToggle}
                variant="outline"
                className="flex-1 border-border text-muted-foreground hover:bg-secondary bg-transparent gap-2"
              >
                {podcast.isHidden ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Unhide
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide
                  </>
                )}
              </Button>
              <Button
                onClick={onRemove}
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10 bg-transparent gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
