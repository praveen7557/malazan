import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, Swords } from 'lucide-react';

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

interface FactionCardProps {
  faction: Faction;
  isListView?: boolean;
}

const FactionCard: React.FC<FactionCardProps> = ({ faction, isListView = false }) => {
  const [showAffiliations, setShowAffiliations] = useState(false);
  const [showEnemies, setShowEnemies] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'extinct':
      case 'destroyed':
      case 'disbanded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'nearly extinct':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'conquered':
      case 'defeated':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'empire':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'race':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cult':
      case 'theocracy':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'military unit':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'mercenary company':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isListView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{faction.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {faction.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(faction.type)}`}>
                  {faction.type}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(faction.status)}`}>
                  {faction.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Origin:</span> {faction.origin}
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
          {faction.description}
        </p>
        
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setShowAffiliations(!showAffiliations)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm"
          >
            <Users className="h-3 w-3" />
            <span>Affiliations ({faction.affiliations.length})</span>
            {showAffiliations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          
          <button
            onClick={() => setShowEnemies(!showEnemies)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md hover:bg-red-100 dark:hover:bg-red-800 transition-colors text-sm"
          >
            <Swords className="h-3 w-3" />
            <span>Enemies ({faction.enemies.length})</span>
            {showEnemies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        <AnimatePresence>
          {showAffiliations && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              animate={{ opacity: 1, maxHeight: 200, paddingTop: 8, paddingBottom: 8 }}
              exit={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-2 px-2 bg-blue-50 dark:bg-blue-900/20 rounded-md overflow-hidden"
            >
              <div className="flex flex-wrap gap-1">
                {faction.affiliations.map((affiliation, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded"
                  >
                    {affiliation}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          
          {showEnemies && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              animate={{ opacity: 1, maxHeight: 200, paddingTop: 8, paddingBottom: 8 }}
              exit={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-2 px-2 bg-red-50 dark:bg-red-900/20 rounded-md overflow-hidden"
            >
              <div className="flex flex-wrap gap-1">
                {faction.enemies.map((enemy, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded"
                  >
                    {enemy}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{faction.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {faction.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Origin:</span> {faction.origin}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(faction.type)}`}>
          {faction.type}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(faction.status)}`}>
          {faction.status}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
        {faction.description}
      </p>

      <div className="space-y-2">
        <button
          onClick={() => setShowAffiliations(!showAffiliations)}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="font-medium">Affiliations ({faction.affiliations.length})</span>
          </div>
          {showAffiliations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {showAffiliations && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              animate={{ opacity: 1, maxHeight: 200, paddingTop: 8, paddingBottom: 8 }}
              exit={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {faction.affiliations.map((affiliation, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md"
                  >
                    {affiliation}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowEnemies(!showEnemies)}
          className="w-full flex items-center justify-between px-4 py-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Swords className="h-4 w-4" />
            <span className="font-medium">Enemies ({faction.enemies.length})</span>
          </div>
          {showEnemies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {showEnemies && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              animate={{ opacity: 1, maxHeight: 200, paddingTop: 8, paddingBottom: 8 }}
              exit={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {faction.enemies.map((enemy, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md"
                  >
                    {enemy}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FactionCard; 