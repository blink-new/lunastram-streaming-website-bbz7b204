import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MovieDetails, TVShowDetails, Episode } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface SeasonData {
  episodes: Episode[];
}

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ tmdbId, type, onClose }) => {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (details) {
      const trackViewing = () => {
        const userId = `anonymous_${Math.random().toString(36).substr(2, 9)}`;
        const title = 'title' in details ? details.title : details.name;
        
        // In a real implementation, this would send tracking data to the server
        console.log('Tracking view:', {
          userId,
          tmdbId,
          title,
          type,
          season: type === 'tv' ? currentSeason : undefined,
          episode: type === 'tv' ? currentEpisode : undefined,
          timestamp: new Date().toISOString(),
        });
      };

      trackViewing();
      
      // Track every 30 seconds while playing
      const interval = setInterval(trackViewing, 30000);
      return () => clearInterval(interval);
    }
  }, [details, tmdbId, type, currentSeason, currentEpisode]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let detailsData;
        if (type === 'movie') {
          detailsData = await tmdbService.getMovieDetails(tmdbId);
        } else {
          detailsData = await tmdbService.getTVShowDetails(tmdbId);
          // For TV shows, also fetch season 1 data
          const seasonInfo = await tmdbService.getTVSeasonDetails(tmdbId, 1);
          setSeasonData(seasonInfo);
        }
        
        setDetails(detailsData);
      } catch (err) {
        setError('Failed to load content details');
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tmdbId, type]);

  useEffect(() => {
    if (type === 'tv' && details) {
      const fetchSeasonData = async () => {
        try {
          const seasonInfo = await tmdbService.getTVSeasonDetails(tmdbId, currentSeason);
          setSeasonData(seasonInfo);
        } catch (err) {
          console.error('Error fetching season data:', err);
        }
      };
      fetchSeasonData();
    }
  }, [tmdbId, currentSeason, type, details]);

  const getPlayerUrl = () => {
    if (type === 'movie') {
      return `https://player.videasy.net/${tmdbId}`;
    } else {
      return `https://player.videasy.net/tv/${tmdbId}/${currentSeason}/${currentEpisode}`;
    }
  };

  const getMaxEpisodes = () => {
    if (seasonData?.episodes) {
      return seasonData.episodes.length;
    }
    return 1;
  };

  const getMaxSeasons = () => {
    if (details && 'number_of_seasons' in details) {
      return details.number_of_seasons;
    }
    return 1;
  };

  const handleSeasonChange = (season: string) => {
    setCurrentSeason(parseInt(season));
    setCurrentEpisode(1); // Reset to first episode when changing season
  };

  const handleEpisodeChange = (episode: string) => {
    setCurrentEpisode(parseInt(episode));
  };

  const navigateEpisode = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    } else if (direction === 'next' && currentEpisode < getMaxEpisodes()) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || 'Failed to load content details'}
            </p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="hover:bg-primary/10"
              >
                <X className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{title}</h1>
                <p className="text-muted-foreground">
                  {year} • {type === 'movie' ? 'Movie' : 'TV Show'}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getPlayerUrl(), '_blank')}
              className="hidden md:flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </Button>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6 shadow-2xl">
            <iframe
              src={getPlayerUrl()}
              className="w-full h-full player-iframe"
              allowFullScreen
              title={`${title} Player`}
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* TV Show Controls */}
          {type === 'tv' && (
            <Card className="mb-6 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Episode Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Season Selector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Season</label>
                    <Select value={currentSeason.toString()} onValueChange={handleSeasonChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: getMaxSeasons() }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Season {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Episode Selector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Episode</label>
                    <Select value={currentEpisode.toString()} onValueChange={handleEpisodeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: getMaxEpisodes() }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Episode {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Episode Navigation */}
                  <div className="flex items-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateEpisode('prev')}
                      disabled={currentEpisode <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateEpisode('next')}
                      disabled={currentEpisode >= getMaxEpisodes()}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Details */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{type === 'movie' ? 'Movie' : 'TV Show'}</Badge>
                  <Badge variant="outline">{year}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Poster */}
                <div>
                  <img
                    src={tmdbService.getImageUrl(details.poster_path, 'w500')}
                    alt={title}
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/500x750/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Overview</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {details.overview || 'No description available.'}
                      </p>
                    </div>

                    {details.genres && details.genres.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {details.genres.map((genre) => (
                            <Badge key={genre.id} variant="outline">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Rating:</span>
                        <span className="ml-2">{details.vote_average.toFixed(1)}/10</span>
                      </div>
                      <div>
                        <span className="font-medium">Votes:</span>
                        <span className="ml-2">{details.vote_count.toLocaleString()}</span>
                      </div>
                      {type === 'movie' && 'runtime' in details && (
                        <div>
                          <span className="font-medium">Runtime:</span>
                          <span className="ml-2">{details.runtime} minutes</span>
                        </div>
                      )}
                      {type === 'tv' && 'number_of_seasons' in details && (
                        <div>
                          <span className="font-medium">Seasons:</span>
                          <span className="ml-2">{details.number_of_seasons}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};