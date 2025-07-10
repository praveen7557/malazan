import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, MapPin, BookOpen, Calendar } from 'lucide-react';

interface TimelineEventProps {
  event: {
    id: string;
    title: string;
    year: number;
    book: string;
    location: string;
    characters: string[];
    description: string;
  };
  index: number;
  isAlternating?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, index, isAlternating = true }) => {
  const [showCharacters, setShowCharacters] = useState(false);
  
  const isLeft = isAlternating && index % 2 === 0;
  
  const getBookColor = (book: string) => {
    const colors = {
      'Gardens of the Moon': 'border-emerald-500',
      'Deadhouse Gates': 'border-amber-500',
      'Memories of Ice': 'border-blue-500',
      'House of Chains': 'border-red-500',
      'Midnight Tides': 'border-purple-500',
      'The Bonehunters': 'border-orange-500',
      'Reaper\'s Gale': 'border-cyan-500',
      'Toll the Hounds': 'border-gray-500',
      'Dust of Dreams': 'border-yellow-500',
      'The Crippled God': 'border-rose-500',
      'Night of Knives': 'border-indigo-500',
      'Return of the Crimson Guard': 'border-pink-500',
    };
    return colors[book as keyof typeof colors] || 'border-gray-400';
  };

  const getBookBadgeColor = (book: string) => {
    const colors = {
      'Gardens of the Moon': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      'Deadhouse Gates': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
      'Memories of Ice': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'House of Chains': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Midnight Tides': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'The Bonehunters': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Reaper\'s Gale': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      'Toll the Hounds': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'Dust of Dreams': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'The Crippled God': 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
      'Night of Knives': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'Return of the Crimson Guard': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
    };
    return colors[book as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  return (
    <motion.div
      id={event.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex ${isAlternating ? (isLeft ? 'flex-row' : 'flex-row-reverse') : 'flex-row'} items-start gap-6 mb-8`}
    >
      {/* Timeline Line (only visible in alternating mode) */}
      {isAlternating && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 dark:bg-gray-600 -z-10"></div>
      )}
      
      {/* Year Badge */}
      <div className={`flex-shrink-0 ${isAlternating ? 'absolute left-1/2 transform -translate-x-1/2' : ''} z-10`}>
        <div className="flex items-center justify-center w-16 h-16 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full font-bold text-sm border-4 border-white dark:border-gray-900 shadow-lg">
          {event.year}
        </div>
      </div>

      {/* Event Card */}
      <div className={`flex-1 ${isAlternating ? (isLeft ? 'pr-8' : 'pl-8') : 'ml-20'} max-w-lg`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 ${getBookColor(event.book)} hover:shadow-lg transition-shadow duration-300`}>
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h3>
            
            {/* Book Badge */}
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4" />
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBookBadgeColor(event.book)}`}>
                {event.book}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>

            {/* Year (mobile) */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 sm:hidden">
              <Calendar className="w-4 h-4" />
              <span>Year {event.year}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Characters Toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowCharacters(!showCharacters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <Users className="w-4 h-4" />
              <span>Characters ({event.characters.length})</span>
              {showCharacters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showCharacters && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, paddingTop: 0 }}
                  animate={{ opacity: 1, maxHeight: 200, paddingTop: 12 }}
                  exit={{ opacity: 0, maxHeight: 0, paddingTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2">
                    {event.characters.map((character, charIndex) => (
                      <span
                        key={charIndex}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600"
                      >
                        {character}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineEvent; 