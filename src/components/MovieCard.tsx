import React from 'react';
import { Star, Play, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Movie, TVShow } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  item: Movie | TVShow;
  onPlay: (id: number, type: 'movie' | 'tv') => void;
  onDetails: (id: number, type: 'movie' | 'tv') => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, onPlay, onDetails }) => {
  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  return (
    <Card className="movie-card group relative overflow-hidden h-[400px] bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30">
      <CardContent className="p-0 h-full">
        <div className="relative h-full">
          {/* Poster Image */}
          <img
            src={tmdbService.getImageUrl(item.poster_path, 'w500')}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/500x750/e5e7eb/9ca3af?text=No+Image';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                {isMovie ? 'Movie' : 'TV Show'}
              </Badge>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{item.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
                {title}
              </h3>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
                {item.vote_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.vote_count} votes</span>
                  </div>
                )}
              </div>
              
              {/* Overview */}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {item.overview || 'No description available.'}
              </p>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onPlay(item.id, isMovie ? 'movie' : 'tv')}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDetails(item.id, isMovie ? 'movie' : 'tv')}
                  className="flex-1 border-primary/30 hover:border-primary/50"
                >
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};