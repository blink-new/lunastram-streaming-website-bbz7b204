import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Clock, 
  Trophy, 
  LogOut, 
  Activity, 
  TrendingUp,
  Eye,
  Play,
  Tv,
  Film
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { tmdbService } from '../../services/tmdb';

export const AdminDashboard: React.FC = () => {
  const { logout, watchActivity, stats, refreshData } = useAdmin();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">LunaStream Admin</h1>
            <p className="text-muted-foreground">Real-time streaming analytics and monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Viewers</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalActiveViewers}</div>
              <p className="text-xs text-muted-foreground">Currently watching</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {formatDuration(stats.totalWatchTime)}
              </div>
              <p className="text-xs text-muted-foreground">Across all content</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Watched</CardTitle>
              <Trophy className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.mostWatchedContent?.watch_count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.mostWatchedContent?.title || 'No data'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Most Watched Content */}
        {stats.mostWatchedContent && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Most Streamed Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={tmdbService.getImageUrl(stats.mostWatchedContent.poster_path || '', 'w185')}
                    alt={stats.mostWatchedContent.title}
                    className="w-16 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/185x278/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    {stats.mostWatchedContent.type === 'movie' ? (
                      <Film className="w-3 h-3" />
                    ) : (
                      <Tv className="w-3 h-3" />
                    )}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{stats.mostWatchedContent.title}</h3>
                  <p className="text-muted-foreground capitalize">
                    {stats.mostWatchedContent.type} • {stats.mostWatchedContent.watch_count} views
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      TMDB ID: {stats.mostWatchedContent.tmdb_id}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Top Performer
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Real-time Activity</span>
              <Badge variant="secondary" className="ml-2">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watchActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active viewers at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {watchActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                    <div className="relative">
                      <img
                        src={tmdbService.getImageUrl(activity.poster_path || '', 'w92')}
                        alt={activity.title}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/92x138/e5e7eb/9ca3af?text=No+Image';
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        {activity.is_active && (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500">
                            <Play className="w-3 h-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>User: {activity.user_id}</span>
                        {activity.type === 'tv' && (
                          <span>S{activity.season}E{activity.episode}</span>
                        )}
                        <span>Watched: {formatDuration(activity.duration_watched)}</span>
                        <span>Last seen: {formatTimeAgo(activity.last_watched_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};