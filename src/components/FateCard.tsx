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

interface FateCardProps {
  card: Card;
  position: 'Past' | 'Present' | 'Future';
  index: number;
}

const FateCard: React.FC<FateCardProps> = ({ card, position, index }) => {
  const getPositionColor = (pos: string) => {
    switch (pos) {
      case 'Past':
        return 'from-amber-500 to-orange-600';
      case 'Present':
        return 'from-purple-500 to-blue-600';
      case 'Future':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPositionBorder = (pos: string) => {
    switch (pos) {
      case 'Past':
        return 'border-amber-300 dark:border-amber-700';
      case 'Present':
        return 'border-purple-300 dark:border-purple-700';
      case 'Future':
        return 'border-emerald-300 dark:border-emerald-700';
      default:
        return 'border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 180, scale: 0.8 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.3,
        type: "spring",
        stiffness: 100
      }}
      className="perspective-1000"
    >
      <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 ${getPositionBorder(position)} overflow-hidden transform-gpu`}>
        {/* Position Label */}
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${getPositionColor(position)} text-white text-center py-2 font-bold text-sm tracking-wider`}>
          {position.toUpperCase()}
        </div>
        
        {/* Card Content */}
        <div className="pt-10 p-6 text-center">
          {/* Icon */}
          <div className="text-6xl mb-4 filter drop-shadow-lg">
            {card.icon}
          </div>
          
          {/* Card Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {card.name}
          </h3>
          
          {/* Domain */}
          <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
            {card.domain}
          </div>
          
          {/* Aspect */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
            Aspect of {card.aspect}
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {card.description}
          </p>
        </div>
        
        {/* Mystical Border Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getPositionColor(position)} opacity-10 pointer-events-none`}></div>
      </div>
    </motion.div>
  );
};

export default FateCard;