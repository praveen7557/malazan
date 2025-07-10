import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '../utils/quizUtils';

interface QuizResultProps {
  characters: Character[];
  onRestartQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ characters, onRestartQuiz }) => {
  const isMultipleResults = characters.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {isMultipleResults ? 'Your Results' : 'Your Character Match'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {isMultipleResults
            ? 'You have qualities that match multiple characters!'
            : 'Based on your answers, you are most like:'}
        </p>
      </div>

      <div className={`grid gap-8 ${isMultipleResults ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {characters.map((character) => (
          <motion.div
            key={character._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 dark:border-purple-700"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {character.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {character.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestartQuiz}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        >
          Take Quiz Again
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizResult;