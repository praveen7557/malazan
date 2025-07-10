import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shuffle, RotateCcw, TrendingUp, Zap, Brain, Wind, Crown } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { simulateDuel, getRandomCharacters } from '../utils/duelSimulator';

interface Character {
  _id: string;
  name: string;
  traits: string[];
  warren: string;
  powerLevel: number;
  agility: number;
  intelligence: number;
  description: string;
}

interface DuelResult {
  winner: Character;
  loser: Character;
  winnerScore: number;
  loserScore: number;
  battleDescription: string;
  margin: 'close' | 'decisive' | 'overwhelming';
}

const DuelPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [fighter1, setFighter1] = useState<Character | null>(null);
  const [fighter2, setFighter2] = useState<Character | null>(null);
  const [duelResult, setDuelResult] = useState<DuelResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetch('/data/characters.json');
        const data = await response.json();
        setCharacters(data);
        // Auto-select first two characters
        if (data.length >= 2) {
          setFighter1(data[0]);
          setFighter2(data[1]);
        }
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleSimulateDuel = async () => {
    if (!fighter1 || !fighter2) return;

    setIsSimulating(true);
    setDuelResult(null);

    // Add dramatic pause
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = simulateDuel(fighter1, fighter2);
    setDuelResult(result);
    setIsSimulating(false);
  };

  const handleRandomPick = () => {
    const randomFighters = getRandomCharacters(characters, 2);
    setFighter1(randomFighters[0]);
    setFighter2(randomFighters[1]);
    setDuelResult(null);
  };

  const handleReset = () => {
    setDuelResult(null);
    setShowComparison(false);
  };

  const getMarginColor = (margin: string) => {
    switch (margin) {
      case 'close':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'decisive':
        return 'text-blue-600 dark:text-blue-400';
      case 'overwhelming':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getMarginBg = (margin: string) => {
    switch (margin) {
      case 'close':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'decisive':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'overwhelming':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-300'>
            Loading warriors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title='Malazan Duel Arena - Epic Character Battles | Book of the Fallen'
        description='Pit your favorite Malazan characters against each other in epic duels! Watch Anomander Rake face Karsa Orlong, or create your own legendary battles from the Book of the Fallen universe.'
        keywords='Malazan duel simulator, character battles, Book of the Fallen fights, Anomander Rake vs Karsa Orlong, Steven Erikson characters'
        url='https://malazan.netlify.app/duel'
      />
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center'>
              <Swords className='mr-3 h-10 w-10 text-red-600' />
              Malazan Duel Arena
              <Swords className='ml-3 h-10 w-10 text-red-600' />
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Witness legendary battles between the most powerful beings in the
              Malazan universe
            </p>
          </div>

          {/* Fighter Selection */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            {/* Fighter 1 */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Fighter 1
                </h2>
                <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-white font-bold'>1</span>
                </div>
              </div>

              <select
                value={fighter1?._id || ''}
                onChange={(e) => {
                  const selected = characters.find(
                    (c) => c._id === e.target.value
                  );
                  setFighter1(selected || null);
                  setDuelResult(null);
                }}
                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>Select a fighter...</option>
                {characters.map((character) => (
                  <option key={character._id} value={character._id}>
                    {character.name}
                  </option>
                ))}
              </select>

              {fighter1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='space-y-3'
                >
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {fighter1.name}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {fighter1.description}
                  </p>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2'>
                      <Zap className='w-4 h-4 text-red-500' />
                      <span className='text-sm'>
                        Power: {fighter1.powerLevel}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Wind className='w-4 h-4 text-blue-500' />
                      <span className='text-sm'>
                        Agility: {fighter1.agility}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Brain className='w-4 h-4 text-purple-500' />
                      <span className='text-sm'>
                        Intelligence: {fighter1.intelligence}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-green-500' />
                      <span className='text-sm'>Warren: {fighter1.warren}</span>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-3'>
                    {fighter1.traits.map((trait, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full'
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Fighter 2 */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Fighter 2
                </h2>
                <div className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-white font-bold'>2</span>
                </div>
              </div>

              <select
                value={fighter2?._id || ''}
                onChange={(e) => {
                  const selected = characters.find(
                    (c) => c._id === e.target.value
                  );
                  setFighter2(selected || null);
                  setDuelResult(null);
                }}
                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              >
                <option value=''>Select a fighter...</option>
                {characters.map((character) => (
                  <option key={character._id} value={character._id}>
                    {character.name}
                  </option>
                ))}
              </select>

              {fighter2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='space-y-3'
                >
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {fighter2.name}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {fighter2.description}
                  </p>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2'>
                      <Zap className='w-4 h-4 text-red-500' />
                      <span className='text-sm'>
                        Power: {fighter2.powerLevel}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Wind className='w-4 h-4 text-blue-500' />
                      <span className='text-sm'>
                        Agility: {fighter2.agility}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Brain className='w-4 h-4 text-purple-500' />
                      <span className='text-sm'>
                        Intelligence: {fighter2.intelligence}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-green-500' />
                      <span className='text-sm'>Warren: {fighter2.warren}</span>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-3'>
                    {fighter2.traits.map((trait, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full'
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4 justify-center mb-8'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSimulateDuel}
              disabled={!fighter1 || !fighter2 || isSimulating}
              className='flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg'
            >
              <Swords className='w-5 h-5' />
              {isSimulating ? 'Battling...' : 'Simulate Duel'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomPick}
              className='flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg'
            >
              <Shuffle className='w-5 h-5' />
              Random Pick
            </motion.button>

            {duelResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className='flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg'
              >
                <RotateCcw className='w-5 h-5' />
                Reset
              </motion.button>
            )}
          </div>

          {/* Simulation Animation */}
          <AnimatePresence>
            {isSimulating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className='text-center mb-8'
              >
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto'>
                  <div className='flex justify-center mb-4'>
                    <div className='relative'>
                      <Swords className='w-16 h-16 text-red-600 animate-pulse' />
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping'></div>
                    </div>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                    Battle in Progress
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    The convergence begins...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duel Result */}
          <AnimatePresence>
            {duelResult && !isSimulating && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 border-2 border-yellow-400'
              >
                <div className='text-center mb-6'>
                  <Crown className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                    Victory to {duelResult.winner.name}!
                  </h2>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getMarginBg(
                      duelResult.margin
                    )} ${getMarginColor(duelResult.margin)}`}
                  >
                    {duelResult.margin.charAt(0).toUpperCase() +
                      duelResult.margin.slice(1)}{' '}
                    Victory
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div
                    className={`p-4 rounded-lg ${
                      duelResult.winner._id === fighter1?._id
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-400'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      {fighter1?.name}
                    </h3>
                    <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {fighter1?._id === duelResult.winner._id
                        ? duelResult.winnerScore
                        : duelResult.loserScore}
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      duelResult.winner._id === fighter2?._id
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-400'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      {fighter2?.name}
                    </h3>
                    <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {fighter2?._id === duelResult.winner._id
                        ? duelResult.winnerScore
                        : duelResult.loserScore}
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                    Battle Chronicle
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 italic leading-relaxed'>
                    {duelResult.battleDescription}
                  </p>
                </div>

                <div className='mt-6 text-center'>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors duration-200'
                  >
                    {showComparison ? 'Hide' : 'Show'} Stat Comparison
                  </button>
                </div>

                <AnimatePresence>
                  {showComparison && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='mt-6 overflow-hidden'
                    >
                      <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                          Statistical Comparison
                        </h3>

                        <div className='space-y-4'>
                          {/* Power Level */}
                          <div>
                            <div className='flex justify-between items-center mb-2'>
                              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Power Level
                              </span>
                              <div className='flex gap-4'>
                                <span className='text-sm'>
                                  {fighter1?.powerLevel}
                                </span>
                                <span className='text-sm'>
                                  {fighter2?.powerLevel}
                                </span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-blue-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter1?.powerLevel || 0) / 100) * 100
                                    }%`
                                  }}
                                ></div>
                              </div>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter2?.powerLevel || 0) / 100) * 100
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Agility */}
                          <div>
                            <div className='flex justify-between items-center mb-2'>
                              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Agility
                              </span>
                              <div className='flex gap-4'>
                                <span className='text-sm'>
                                  {fighter1?.agility}
                                </span>
                                <span className='text-sm'>
                                  {fighter2?.agility}
                                </span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-blue-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter1?.agility || 0) / 100) * 100
                                    }%`
                                  }}
                                ></div>
                              </div>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter2?.agility || 0) / 100) * 100
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Intelligence */}
                          <div>
                            <div className='flex justify-between items-center mb-2'>
                              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Intelligence
                              </span>
                              <div className='flex gap-4'>
                                <span className='text-sm'>
                                  {fighter1?.intelligence}
                                </span>
                                <span className='text-sm'>
                                  {fighter2?.intelligence}
                                </span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-blue-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter1?.intelligence || 0) / 100) *
                                      100
                                    }%`
                                  }}
                                ></div>
                              </div>
                              <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                                <div
                                  className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                  style={{
                                    width: `${
                                      ((fighter2?.intelligence || 0) / 100) *
                                      100
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DuelPage; 