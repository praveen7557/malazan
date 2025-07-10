import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles, Save, Share2 } from 'lucide-react';
import FateCard from '../components/FateCard';
import ProphecyReading from '../components/ProphecyReading';

interface Card {
  id: string;
  name: string;
  description: string;
  domain: string;
  aspect: string;
  icon: string;
}

const DeckOfFate: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<[Card, Card, Card] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedReadings, setSavedReadings] = useState<Array<{
    id: string;
    cards: [Card, Card, Card];
    timestamp: string;
  }>>([]);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const response = await fetch('/data/deck.json');
        const deckData = await response.json();
        setDeck(deckData);
        
        // Load saved readings from localStorage
        const saved = localStorage.getItem('malazan-fate-readings');
        if (saved) {
          setSavedReadings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading deck:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeck();
  }, []);

  const drawCards = async () => {
    if (deck.length < 3) return;
    
    setIsDrawing(true);
    setDrawnCards(null);
    
    // Add dramatic pause for effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Shuffle and draw 3 unique cards
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const drawn: [Card, Card, Card] = [shuffled[0], shuffled[1], shuffled[2]];
    
    setDrawnCards(drawn);
    setIsDrawing(false);
  };

  const saveReading = () => {
    if (!drawnCards) return;
    
    const reading = {
      id: Date.now().toString(),
      cards: drawnCards,
      timestamp: new Date().toLocaleString()
    };
    
    const updated = [reading, ...savedReadings.slice(0, 4)]; // Keep only 5 most recent
    setSavedReadings(updated);
    localStorage.setItem('malazan-fate-readings', JSON.stringify(updated));
  };

  const shareReading = async () => {
    if (!drawnCards) return;
    
    const shareText = `My Malazan Deck of Fate reading:\n\nPast: ${drawnCards[0].name}\nPresent: ${drawnCards[1].name}\nFuture: ${drawnCards[2].name}\n\nThe cards have spoken! 🔮`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Deck of Fate Reading',
          text: shareText,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Shuffling the Deck of Dragons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <span className="mr-3">🃏</span>
            Draw Your Deck of Fate
            <span className="ml-3">🃏</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The ancient Deck of Dragons awaits. Three cards will reveal the threads of your destiny—
            what was, what is, and what shall be. Do you dare to know your fate?
          </p>
        </motion.div>

        {/* Draw Button */}
        <div className="text-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={drawCards}
            disabled={isDrawing}
            className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl ${
              isDrawing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            }`}
          >
            {isDrawing ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                The Cards Are Choosing...
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="mr-3 h-6 w-6" />
                {drawnCards ? 'Draw New Fate' : 'Draw Your Fate'}
                <Sparkles className="ml-3 h-6 w-6" />
              </span>
            )}
          </motion.button>
        </div>

        {/* Cards Display */}
        <AnimatePresence>
          {drawnCards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              {/* Cards Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {drawnCards.map((card, index) => (
                  <FateCard
                    key={`${card.id}-${Date.now()}`}
                    card={card}
                    position={['Past', 'Present', 'Future'][index] as 'Past' | 'Present' | 'Future'}
                    index={index}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={drawCards}
                  className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <Shuffle className="mr-2 h-5 w-5" />
                  Shuffle & Draw Again
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveReading}
                  className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Reading
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareReading}
                  className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </motion.button>
              </div>

              {/* Prophecy Reading */}
              <ProphecyReading cards={drawnCards} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Readings */}
        {savedReadings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              📜 Your Recent Fates 📜
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedReadings.map((reading) => (
                <div
                  key={reading.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-md"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {reading.timestamp}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="text-amber-600 font-medium mr-2">Past:</span>
                      <span className="text-gray-700 dark:text-gray-300">{reading.cards[0].name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-600 font-medium mr-2">Present:</span>
                      <span className="text-gray-700 dark:text-gray-300">{reading.cards[1].name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-emerald-600 font-medium mr-2">Future:</span>
                      <span className="text-gray-700 dark:text-gray-300">{reading.cards[2].name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeckOfFate;