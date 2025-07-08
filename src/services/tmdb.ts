import axios from 'axios';
import { Movie, TVShow, MovieDetails, TVShowDetails, TMDBResponse, Genre, Episode } from '../types/movie';

const TMDB_API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // Free API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const tmdbService = {
  // Get image URL
  getImageUrl: (path: string, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
    if (!path) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Search movies and TV shows
  searchMulti: async (query: string, page: number = 1): Promise<TMDBResponse<Movie | TVShow>> => {
    const response = await tmdbApi.get('/search/multi', {
      params: { query, page },
    });
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Search TV shows
  searchTVShows: async (query: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await tmdbApi.get('/search/tv', {
      params: { query, page },
    });
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get popular TV shows
  getPopularTVShows: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  },

  // Get trending TV shows
  getTrendingTVShows: async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<TVShow>> => {
    const response = await tmdbApi.get(`/trending/tv/${timeWindow}`);
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get TV show details
  getTVShowDetails: async (tvId: number): Promise<TVShowDetails> => {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  },

  // Get TV show season details
  getTVSeasonDetails: async (tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> => {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  },

  // Get genres
  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  },

  getTVGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data.genres;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  // Get TV shows by genre
  getTVShowsByGenre: async (genreId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await tmdbApi.get('/discover/tv', {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await tmdbApi.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },
};

export default tmdbService;