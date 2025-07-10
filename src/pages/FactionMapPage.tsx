import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, MapPin } from 'lucide-react';
import FactionCard from '../components/FactionCard';

interface Faction {
  id: string;
  name: string;
  type: string;
  status: string;
  origin: string;
  description: string;
  affiliations: string[];
  enemies: string[];
  icon: string;
}

const FactionMapPage: React.FC = () => {
  const [factionsData, setFactionsData] = useState<Faction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isListView, setIsListView] = useState(false);
  const [groupByOrigin, setGroupByOrigin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/factions.json');
        const data = await response.json();
        setFactionsData(data);
      } catch (error) {
        console.error('Error loading factions data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const factions: Faction[] = factionsData;

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(factions.map(f => f.status))];
    return statuses.sort();
  }, [factions]);

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(factions.map(f => f.type))];
    return types.sort();
  }, [factions]);

  // Filter factions based on search and filters
  const filteredFactions = useMemo(() => {
    return factions.filter(faction => {
      const matchesSearch = faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || faction.status === statusFilter;
      const matchesType = typeFilter === 'all' || faction.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [factions, searchTerm, statusFilter, typeFilter]);

  // Group factions by origin if enabled
  const groupedFactions = useMemo(() => {
    if (!groupByOrigin) return { 'All Factions': filteredFactions };
    
    const grouped = filteredFactions.reduce((acc, faction) => {
      const origin = faction.origin;
      if (!acc[origin]) {
        acc[origin] = [];
      }
      acc[origin].push(faction);
      return acc;
    }, {} as Record<string, Faction[]>);
    
    return grouped;
  }, [filteredFactions, groupByOrigin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading factions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Faction Map
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the complex web of alliances and rivalries between Malazan factions
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search factions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsListView(false)}
                className={`p-2 rounded-lg transition-colors ${
                  !isListView
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsListView(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isListView
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Group by Origin Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByOrigin}
                onChange={(e) => setGroupByOrigin(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Group by Origin</span>
              </span>
            </label>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredFactions.length} faction{filteredFactions.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Faction Groups */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${groupByOrigin}-${isListView}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {Object.entries(groupedFactions).map(([origin, factions]) => (
              <div key={origin}>
                {groupByOrigin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                      <MapPin className="h-6 w-6 text-blue-500" />
                      <span>{origin}</span>
                    </h2>
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-24"></div>
                  </motion.div>
                )}
                
                <div className={
                  isListView
                    ? "space-y-4"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                }>
                  {factions.map((faction, index) => (
                    <motion.div
                      key={faction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FactionCard faction={faction} isListView={isListView} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredFactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No factions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FactionMapPage; 