import React from 'react';
import { Movie, TVShow } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  items: (Movie | TVShow)[];
  onPlay: (id: number, type: 'movie' | 'tv') => void;
  onDetails: (id: number, type: 'movie' | 'tv') => void;
  loading?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ items, onPlay, onDetails, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎬</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any movies or TV shows matching your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <MovieCard
          key={item.id}
          item={item}
          onPlay={onPlay}
          onDetails={onDetails}
        />
      ))}
    </div>
  );
};