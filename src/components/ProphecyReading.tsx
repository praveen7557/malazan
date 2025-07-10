import React from 'react';
import { motion } from 'framer-motion';

interface Card {
  id: string;
  name: string;
  description: string;
  domain: string;
  aspect: string;
  icon: string;
}

interface ProphecyReadingProps {
  cards: [Card, Card, Card];
}

const ProphecyReading: React.FC<ProphecyReadingProps> = ({ cards }) => {
  const generateProphecy = (card: Card, position: 'Past' | 'Present' | 'Future'): string => {
    const [pastCard, presentCard, futureCard] = cards;
    
    const prophecies = {
      Past: [
        `In the shadows of what was, ${card.name} speaks of ${card.aspect.toLowerCase()}. The ${card.domain} has left its mark upon your path, shaping the foundation of your current struggles.`,
        `The echoes of ${card.name} resonate from your past, where ${card.aspect.toLowerCase()} was both burden and blessing. What was done in the realm of ${card.domain} cannot be undone.`,
        `From the depths of memory, ${card.name} emerges, carrying the weight of ${card.aspect.toLowerCase()}. Your history with ${card.domain} has forged the chains that bind your present.`
      ],
      Present: [
        `Now stands ${card.name}, embodying ${card.aspect.toLowerCase()} in this moment of decision. The ${card.domain} demands your attention, for the present is where fate pivots.`,
        `In this hour, ${card.name} manifests as ${card.aspect.toLowerCase()}, drawing power from ${card.domain}. The choices you make now will echo through the halls of destiny.`,
        `The present moment crystallizes around ${card.name}, where ${card.aspect.toLowerCase()} becomes your greatest ally or most dangerous foe. ${card.domain} watches and waits.`
      ],
      Future: [
        `Ahead lies ${card.name}, promising ${card.aspect.toLowerCase()} in times yet to come. The ${card.domain} will play its hand when the moment is ripe.`,
        `The threads of fate weave toward ${card.name}, where ${card.aspect.toLowerCase()} awaits your arrival. What ${card.domain} offers may not be what you expect.`,
        `In the mists of tomorrow, ${card.name} beckons with ${card.aspect.toLowerCase()}. The ${card.domain} has prepared a path, but whether it leads to glory or ruin remains to be seen.`
      ]
    };
    
    const options = prophecies[position];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateSummary = (): string => {
    const domains = cards.map(card => card.domain);
    const aspects = cards.map(card => card.aspect);
    
    // Special combinations
    if (domains.includes('High House Shadow') && domains.includes('High House Light')) {
      return "The eternal dance of Shadow and Light plays out in your fate. Balance will be your greatest challenge and your ultimate salvation.";
    }
    
    if (domains.includes('High House Death') && domains.includes('High House Life')) {
      return "Life and Death intertwine in your destiny. Transformation awaits, but the price may be higher than you imagine.";
    }
    
    if (cards.some(card => card.id.includes('oponn'))) {
      return "Chance smiles. Or doesn't. The twins of luck have taken notice of your path.";
    }
    
    if (cards.some(card => card.id.includes('Cripple') || card.id.includes('Fool'))) {
      return "The broken see more clearly. Wisdom often wears the mask of folly.";
    }
    
    if (domains.includes('High House Chains')) {
      return "Chains bind, but they also connect. What enslaves you may also be what sets you free.";
    }
    
    // General summaries based on domain patterns
    const uniqueDomains = [...new Set(domains)];
    if (uniqueDomains.length === 1) {
      return `The ${uniqueDomains[0]} claims dominion over your entire fate. Its influence will be absolute and undeniable.`;
    }
    
    if (uniqueDomains.length === 3) {
      return "Three powers vie for influence over your destiny. Navigate carefully, for each demands its due.";
    }
    
    return "The Deck has spoken, weaving a tapestry of fate unique to your path. Trust in the wisdom of the cards, for they see what mortal eyes cannot.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl p-8 border border-purple-200 dark:border-purple-800"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 flex items-center justify-center">
        <span className="mr-2">🔮</span>
        The Prophecy Unfolds
        <span className="ml-2">🔮</span>
      </h2>
      
      <div className="space-y-6">
        {cards.map((card, index) => {
          const positions: ('Past' | 'Present' | 'Future')[] = ['Past', 'Present', 'Future'];
          const position = positions[index];
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.5 + index * 0.2 }}
              className="border-l-4 border-purple-400 dark:border-purple-600 pl-4"
            >
              <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300 mb-2">
                {position}: {card.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {generateProphecy(card, position)}
              </p>
            </motion.div>
          );
        })}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
        >
          <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-3 text-center">
            ⚡ The Verdict of Fate ⚡
          </h3>
          <p className="text-amber-700 dark:text-amber-200 text-center italic leading-relaxed">
            {generateSummary()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProphecyReading;