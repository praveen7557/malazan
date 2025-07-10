import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import QuizQuestion from '../components/QuizQuestion';
import QuizResult from '../components/QuizResult';
import { calculateTopCharacters, getCharactersByIds, Character, QuizScores } from '../utils/quizUtils';

interface QuizQuestionData {
  id: number;
  question: string;
  options: Array<{
    text: string;
    scores: { [characterId: string]: number };
  }>;
}

const CharacterQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scores, setScores] = useState<QuizScores>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultCharacters, setResultCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsResponse, charactersResponse] = await Promise.all([
          fetch('/data/malazan_character_quiz.json'),
          fetch('/data/characters.json')
        ]);

        const questionsData = await questionsResponse.json();
        const charactersData = await charactersResponse.json();

        setQuestions(questionsData);
        setCharacters(charactersData);
      } catch (error) {
        console.error('Error loading quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionData = currentQuestion.options[selectedOption];
    
    // Update scores
    const newScores = { ...scores };
    Object.entries(selectedOptionData.scores).forEach(([characterId, points]) => {
      newScores[characterId] = (newScores[characterId] || 0) + points;
    });
    setScores(newScores);

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed
      const topCharacterIds = calculateTopCharacters(newScores);
      const topCharacters = getCharactersByIds(topCharacterIds, characters);
      setResultCharacters(topCharacters);
      setIsCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScores({});
    setIsCompleted(false);
    setResultCharacters([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
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
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Malazan Character Quiz
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover which character from the Malazan Book of the Fallen series matches your personality
                </p>
              </div>

              {questions.length > 0 && (
                <QuizQuestion
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectOption}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              )}

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center mx-auto space-x-2 ${
                    selectedOption !== null
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Get Results'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result">
              <QuizResult characters={resultCharacters} onRestartQuiz={restartQuiz} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharacterQuiz;