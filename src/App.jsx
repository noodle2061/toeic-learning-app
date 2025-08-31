import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '/src/pages/HomePage.jsx';
import VocabularyPage from '/src/pages/VocabularyPage.jsx';
import VocabularyUnitPage from '/src/pages/VocabularyUnitPage.jsx';
import BrowseVocabularyPage from '/src/pages/BrowseVocabularyPage.jsx';
import FlashcardPage from '/src/pages/FlashcardPage.jsx';
import QuizPage from '/src/pages/QuizPage.jsx';

function App() {
  return (
    <div>
      {/* Bạn có thể thêm Header hoặc Sidebar chung ở đây */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/vocabulary/:unitId" element={<VocabularyUnitPage />} />
        <Route path="/vocabulary/:unitId/browse" element={<BrowseVocabularyPage />} />
        {/* Thêm route cho trang flashcard */}
        <Route path="/vocabulary/:unitId/flashcards" element={<FlashcardPage />} />
        {/* Thêm route cho trang trắc nghiệm */}
        <Route path="/vocabulary/:unitId/quiz" element={<QuizPage />} />
      </Routes>
    </div>
  );
}

export default App;

