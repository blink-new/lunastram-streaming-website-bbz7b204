import React, { useState } from 'react';
import { Search, Menu, X, Film, Tv, TrendingUp, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
  currentView: 'home' | 'movies' | 'tv' | 'search';
  onViewChange: (view: 'home' | 'movies' | 'tv' | 'search') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onViewChange('search');
    }
  };

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: TrendingUp },
    { id: 'movies' as const, label: 'Movies', icon: Film },
    { id: 'tv' as const, label: 'TV Shows', icon: Tv },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl">
              <Star className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold gradient-text">LunaStram</h1>
              <p className="text-xs text-muted-foreground">Premium Streaming</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                Search
              </Button>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-start space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};