import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import CharacterQuiz from './pages/CharacterQuiz';
import DeckOfFate from './pages/DeckOfFate';
import QuoteMatchPage from './pages/QuoteMatchPage';
import FactionMapPage from './pages/FactionMapPage';
import TimelinePage from './pages/TimelinePage';
import DuelPage from './pages/DuelPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
          <Navigation />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path='/' element={<Navigate to='/quiz' replace />} />
              <Route path='/quiz' element={<CharacterQuiz />} />
              <Route path='/draw-cards' element={<DeckOfFate />} />
              <Route path='/quote-match' element={<QuoteMatchPage />} />
              <Route path='/faction-map' element={<FactionMapPage />} />
              <Route path='/timeline' element={<TimelinePage />} />
              <Route path='/duel' element={<DuelPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
