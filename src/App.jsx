import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import VocabularyUnitPage from './pages/VocabularyUnitPage';
import BrowseVocabularyPage from './pages/BrowseVocabularyPage';
import FlashcardPage from './pages/FlashcardPage'; // Import trang mới

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
      </Routes>
    </div>
  );
}

export default App;
