import React, { createContext, useContext, useState, useEffect } from 'react';

interface WatchActivity {
  id: string;
  user_id: string;
  tmdb_id: number;
  title: string;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  poster_path?: string;
  started_at: string;
  last_watched_at: string;
  duration_watched: number;
  is_active: boolean;
}

interface AdminStats {
  totalActiveViewers: number;
  totalWatchTime: number;
  mostWatchedContent: {
    title: string;
    type: 'movie' | 'tv';
    tmdb_id: number;
    watch_count: number;
    poster_path?: string;
  } | null;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  watchActivity: WatchActivity[];
  stats: AdminStats;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'lunastream2024';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [watchActivity, setWatchActivity] = useState<WatchActivity[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalActiveViewers: 0,
    totalWatchTime: 0,
    mostWatchedContent: null,
  });

  useEffect(() => {
    // Check if admin is already logged in
    const savedAuth = localStorage.getItem('lunastream-admin-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      // Set up real-time updates every 5 seconds
      const interval = setInterval(refreshData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('lunastream-admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lunastream-admin-auth');
  };

  const refreshData = async () => {
    try {
      // For now, we'll simulate data since we don't have the database set up yet
      // In a real implementation, this would query the database
      const mockActivity: WatchActivity[] = [
        {
          id: '1',
          user_id: 'user_123',
          tmdb_id: 550,
          title: 'Fight Club',
          type: 'movie',
          poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
          started_at: new Date().toISOString(),
          last_watched_at: new Date().toISOString(),
          duration_watched: 1800,
          is_active: true,
        },
        {
          id: '2',
          user_id: 'user_456',
          tmdb_id: 1399,
          title: 'Game of Thrones',
          type: 'tv',
          season: 1,
          episode: 1,
          poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
          started_at: new Date(Date.now() - 300000).toISOString(),
          last_watched_at: new Date().toISOString(),
          duration_watched: 2400,
          is_active: true,
        },
      ];

      setWatchActivity(mockActivity);
      setStats({
        totalActiveViewers: mockActivity.filter(a => a.is_active).length,
        totalWatchTime: mockActivity.reduce((sum, a) => sum + a.duration_watched, 0),
        mostWatchedContent: {
          title: 'Game of Thrones',
          type: 'tv',
          tmdb_id: 1399,
          watch_count: 15,
          poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        },
      });
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        watchActivity,
        stats,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};