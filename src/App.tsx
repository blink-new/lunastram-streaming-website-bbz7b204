import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MovieGrid } from './components/MovieGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Movie, TVShow } from './types/movie';
import { tmdbService } from './services/tmdb';
import { Sparkles, TrendingUp, Star, Clock } from 'lucide-react';

type ViewType = 'home' | 'movies' | 'tv' | 'search';

interface PlayerState {
  isOpen: boolean;
  tmdbId: number;
  type: 'movie' | 'tv';
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState<{
    trending: (Movie | TVShow)[];
    popularMovies: Movie[];
    popularTVShows: TVShow[];
    searchResults: (Movie | TVShow)[];
  }>({
    trending: [],
    popularMovies: [],
    popularTVShows: [],
    searchResults: [],
  });
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<PlayerState>({
    isOpen: false,
    tmdbId: 0,
    type: 'movie',
  });

  // Load initial content
  useEffect(() => {
    const loadInitialContent = async () => {
      setLoading(true);
      try {
        const [trendingMovies, trendingTV, popularMovies, popularTV] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getTrendingTVShows(),
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows(),
        ]);

        // Combine trending movies and TV shows
        const trending = [
          ...trendingMovies.results.slice(0, 10),
          ...trendingTV.results.slice(0, 10),
        ].sort(() => Math.random() - 0.5); // Shuffle for variety

        setContent({
          trending,
          popularMovies: popularMovies.results,
          popularTVShows: popularTV.results,
          searchResults: [],
        });
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialContent();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const results = await tmdbService.searchMulti(query);
      setContent(prev => ({
        ...prev,
        searchResults: results.results,
      }));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view changes
  const handleViewChange = async (view: ViewType) => {
    setCurrentView(view);
    setLoading(true);

    try {
      if (view === 'movies') {
        const [popular, topRated, upcoming] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getUpcomingMovies(),
        ]);
        setContent(prev => ({
          ...prev,
          popularMovies: [...popular.results, ...topRated.results, ...upcoming.results],
        }));
      } else if (view === 'tv') {
        const [popular, topRated] = await Promise.all([
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedTVShows(),
        ]);
        setContent(prev => ({
          ...prev,
          popularTVShows: [...popular.results, ...topRated.results],
        }));
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle play action
  const handlePlay = (id: number, type: 'movie' | 'tv') => {
    setPlayer({
      isOpen: true,
      tmdbId: id,
      type,
    });
  };

  // Handle details action (same as play for now)
  const handleDetails = (id: number, type: 'movie' | 'tv') => {
    handlePlay(id, type);
  };

  // Close player
  const closePlayer = () => {
    setPlayer({
      isOpen: false,
      tmdbId: 0,
      type: 'movie',
    });
  };

  // Get current content to display
  const getCurrentContent = (): (Movie | TVShow)[] => {
    switch (currentView) {
      case 'movies':
        return content.popularMovies;
      case 'tv':
        return content.popularTVShows;
      case 'search':
        return content.searchResults;
      default:
        return content.trending;
    }
  };

  const getViewTitle = (): string => {
    switch (currentView) {
      case 'movies':
        return 'Movies';
      case 'tv':
        return 'TV Shows';
      case 'search':
        return `Search Results for "${searchQuery}"`;
      default:
        return 'Trending Now';
    }
  };

  const getViewDescription = (): string => {
    switch (currentView) {
      case 'movies':
        return 'Discover the latest and greatest movies';
      case 'tv':
        return 'Explore popular and top-rated TV shows';
      case 'search':
        return `Found ${content.searchResults.length} results`;
      default:
        return 'What\'s hot and trending this week';
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header
        onSearch={handleSearch}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {currentView === 'home' && (
          <section className="relative mb-12 py-16 px-8 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                  Welcome to LunaStram
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6 leading-tight">
                Stream Premium
                <br />
                Content Anywhere
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Discover thousands of movies and TV shows with our sleek, modern streaming platform. 
                Powered by TMDB for the most up-to-date content information.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  onClick={() => handleViewChange('movies')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground animate-glow"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Explore Movies
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleViewChange('tv')}
                  className="border-primary/30 hover:border-primary/50"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Browse TV Shows
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{getViewTitle()}</h2>
              <p className="text-muted-foreground">{getViewDescription()}</p>
            </div>
            
            {currentView === 'home' && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Updated daily</span>
              </div>
            )}
          </div>

          {/* Statistics Cards for Home */}
          {currentView === 'home' && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Trending Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {content.trending.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Hot picks this week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Popular Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {content.popularMovies.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Movies available</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">TV Shows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {content.popularTVShows.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Series to binge</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Grid */}
          <MovieGrid
            items={getCurrentContent()}
            onPlay={handlePlay}
            onDetails={handleDetails}
            loading={loading}
          />
        </section>
      </main>

      {/* Video Player Modal */}
      {player.isOpen && (
        <VideoPlayer
          tmdbId={player.tmdbId}
          type={player.type}
          onClose={closePlayer}
        />
      )}
    </div>
  );
}

export default App;