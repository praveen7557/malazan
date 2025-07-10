import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, EyeOff, Trophy, Target } from 'lucide-react';

interface QuoteOption {
  text: string;
  score: number;
}

interface Quote {
  id: string;
  quote: string;
  options: QuoteOption[];
  answerId: string;
}

interface UserAnswer {
  quoteId: string;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  quote: string;
  selectedText: string;
  correctText: string;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuoteMatchPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch('/data/quotes.json');
        const quotesData: Quote[] = await response.json();
        // Shuffle the quotes array to randomize the order
        const shuffledQuotes = shuffleArray(quotesData);
        // Also shuffle the options within each quote
        const quotesWithShuffledOptions = shuffledQuotes.map(quote => ({
          ...quote,
          options: shuffleArray(quote.options)
        }));
        setQuotes(quotesWithShuffledOptions);
      } catch (error) {
        console.error('Error loading quotes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing selection
    setSelectedOption(optionIndex);

    const currentQuote = quotes[currentQuoteIndex];
    const correctOptionIndex = currentQuote.options.findIndex(option => option.score === 1);
    const isCorrect = optionIndex === correctOptionIndex;

    const userAnswer: UserAnswer = {
      quoteId: currentQuote.id,
      selectedOption: optionIndex,
      correctOption: correctOptionIndex,
      isCorrect,
      quote: currentQuote.quote,
      selectedText: currentQuote.options[optionIndex].text,
      correctText: currentQuote.options[correctOptionIndex].text,
    };

    setUserAnswers(prev => [...prev, userAnswer]);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuoteIndex < quotes.length - 1) {
        setCurrentQuoteIndex(currentQuoteIndex + 1);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuoteIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setIsCompleted(false);
    setShowAnswers(false);
  };

  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const accuracy = userAnswers.length > 0 ? Math.round((correctAnswers / userAnswers.length) * 100) : 0;

  const getScoreColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (accuracy: number) => {
    if (accuracy >= 90) return "Malazan Master! You know these characters like old friends.";
    if (accuracy >= 80) return "Excellent! You've clearly spent time in the Malazan world.";
    if (accuracy >= 70) return "Well done! Your knowledge of the series is solid.";
    if (accuracy >= 60) return "Good effort! Time for a re-read perhaps?";
    if (accuracy >= 50) return "Not bad! The Malazan world is vast and complex.";
    return "The Deck of Dragons is mysterious indeed. Keep reading!";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quotes from the archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div key="quiz" className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <span className="mr-3">💬</span>
                  Quote Matching Game
                  <span className="ml-3">💬</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Test your knowledge of memorable quotes from the Malazan Book of the Fallen series
                </p>
              </div>

              {/* Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Quote {currentQuoteIndex + 1} of {quotes.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {correctAnswers}/{userAnswers.length} correct
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuoteIndex + 1) / quotes.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Quote */}
              {quotes.length > 0 && (
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
                >
                  <div className="text-center mb-8">
                    <blockquote className="text-2xl font-medium text-gray-900 dark:text-white italic leading-relaxed">
                      "{quotes[currentQuoteIndex].quote}"
                    </blockquote>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
                      Who said this?
                    </h3>
                    
                    {quotes[currentQuoteIndex].options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      const isCorrect = option.score === 1;
                      const showCorrectness = selectedOption !== null;
                      
                      let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
                      
                      if (showCorrectness) {
                        if (isSelected && isCorrect) {
                          buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                        } else if (!isSelected && isCorrect) {
                          buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                        } else {
                          buttonClass += "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400";
                        }
                      } else {
                        buttonClass += isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300";
                      }

                      return (
                        <motion.button
                          key={index}
                          whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                          whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                          onClick={() => handleSelectOption(index)}
                          disabled={selectedOption !== null}
                          className={buttonClass}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                showCorrectness
                                  ? isSelected && isCorrect
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : isSelected && !isCorrect
                                    ? 'border-red-500 bg-red-500'
                                    : !isSelected && isCorrect
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                  : isSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {((showCorrectness && isSelected && isCorrect) || 
                                (showCorrectness && !isSelected && isCorrect) ||
                                (!showCorrectness && isSelected)) && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                              {showCorrectness && isSelected && !isCorrect && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-lg">{option.text}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-8">
              {/* Results Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <Trophy className="mr-3 h-10 w-10 text-yellow-500" />
                  Quiz Complete!
                  <Trophy className="ml-3 h-10 w-10 text-yellow-500" />
                </h1>
              </div>

              {/* Score Summary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
              >
                <div className="mb-6">
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(accuracy)}`}>
                    {accuracy}%
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                    {correctAnswers} out of {userAnswers.length} correct
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                    {getScoreMessage(accuracy)}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restartQuiz}
                    className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Play Again
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    {showAnswers ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
                    {showAnswers ? 'Hide' : 'Show'} Answers
                  </motion.button>
                </div>
              </motion.div>

              {/* Detailed Results */}
              <AnimatePresence>
                {showAnswers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                      Detailed Results
                    </h2>
                    
                    {userAnswers.map((answer, index) => (
                      <motion.div
                        key={answer.quoteId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${
                          answer.isCorrect 
                            ? 'border-emerald-500' 
                            : 'border-red-500'
                        }`}
                      >
                        <div className="mb-4">
                          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-3">
                            "{answer.quote}"
                          </blockquote>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Answer:</span>
                            <div className={`text-lg font-medium ${
                              answer.isCorrect 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {answer.selectedText}
                            </div>
                          </div>
                          
                          {!answer.isCorrect && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Correct Answer:</span>
                              <div className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                                {answer.correctText}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            answer.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            answer.isCorrect 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuoteMatchPage;