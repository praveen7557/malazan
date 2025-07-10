import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RotateCcw, Clock, BookOpen, MapPin, List, Calendar } from 'lucide-react';
import TimelineEvent from '../components/TimelineEvent';

interface TimelineEventData {
  id: string;
  title: string;
  year: number;
  book: string;
  location: string;
  characters: string[];
  description: string;
}

const TimelinePage: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookFilter, setBookFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'chronological' | 'book'>('chronological');
  const [isAlternating, setIsAlternating] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/timeline.json');
        const data = await response.json();
        setTimelineData(data);
      } catch (error) {
        console.error('Error loading timeline data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique books and locations for filters
  const books = useMemo(() => {
    const uniqueBooks = [...new Set(timelineData.map(event => event.book))];
    return uniqueBooks.sort();
  }, [timelineData]);

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(timelineData.map(event => event.location))];
    return uniqueLocations.sort();
  }, [timelineData]);

  // Book order for sorting
  const bookOrder = [
    'Gardens of the Moon',
    'Deadhouse Gates', 
    'Memories of Ice',
    'House of Chains',
    'Midnight Tides',
    'The Bonehunters',
    'Reaper\'s Gale',
    'Toll the Hounds',
    'Dust of Dreams',
    'The Crippled God',
    'Night of Knives',
    'Return of the Crimson Guard'
  ];

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = timelineData.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBook = bookFilter === 'all' || event.book === bookFilter;
      const matchesLocation = locationFilter === 'all' || event.location === locationFilter;
      
      return matchesSearch && matchesBook && matchesLocation;
    });

    // Sort events
    if (sortOrder === 'chronological') {
      filtered.sort((a, b) => a.year - b.year);
    } else {
      filtered.sort((a, b) => {
        const aIndex = bookOrder.indexOf(a.book);
        const bIndex = bookOrder.indexOf(b.book);
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        return a.year - b.year;
      });
    }

    return filtered;
  }, [timelineData, searchTerm, bookFilter, locationFilter, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setBookFilter('all');
    setLocationFilter('all');
    setSortOrder('chronological');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Malazan Timeline
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the major events that shaped the Malazan world, from ancient convergences to empire-defining battles.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Book Filter */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={bookFilter}
                onChange={(e) => setBookFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Books</option>
                {books.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'chronological' | 'book')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="chronological">Chronological</option>
                <option value="book">Book Order</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filters
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredAndSortedEvents.length} events
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Layout:</span>
                <button
                  onClick={() => setIsAlternating(!isAlternating)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    isAlternating 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {isAlternating ? <Calendar className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  {isAlternating ? 'Alternating' : 'Linear'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Continuous Timeline Line for alternating layout */}
          {isAlternating && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 dark:bg-gray-600 -z-10"></div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${bookFilter}-${locationFilter}-${sortOrder}-${isAlternating}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
              {filteredAndSortedEvents.length > 0 ? (
                filteredAndSortedEvents.map((event, index) => (
                  <TimelineEvent
                    key={event.id}
                    event={event}
                    index={index}
                    isAlternating={isAlternating}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Calendar className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No events found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Timeline Navigator (Bonus Feature) */}
        {filteredAndSortedEvents.length > 5 && (
          <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-w-xs">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Navigation</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredAndSortedEvents.slice(0, 8).map((event, index) => (
                <button
                  key={event.id}
                  onClick={() => {
                    const element = document.getElementById(event.id);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block w-full text-left px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                >
                  {event.year} - {event.title.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage; 