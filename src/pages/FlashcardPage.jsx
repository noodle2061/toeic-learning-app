import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVocabUnitDetails } from '../api/dataService';
import { getProgress, saveProgress, calculateNextReview, createReviewDeck } from '../services/srsService.js';
import Flashcard from '../components/features/flashcards/Flashcard.jsx';

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    header: {
        marginBottom: '20px',
    },
    title: {
        fontSize: '2rem',
    },
    progressText: {
        fontSize: '1.2rem',
        color: '#555',
    },
    completionContainer: {
        padding: '50px',
        backgroundColor: '#f0f9eb',
        border: '2px solid #a3e635',
        borderRadius: '10px'
    },
    backButton: {
        display: 'inline-block',
        padding: '10px 15px',
        backgroundColor: '#6c757d',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '20px'
    }
};

const FlashcardPage = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [deck, setDeck] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [progress, setProgress] = useState({});
    const [unitTitle, setUnitTitle] = useState('');

    useEffect(() => {
        const initializeSession = async () => {
            setLoading(true);
            try {
                const unitDetails = await getVocabUnitDetails(unitId);
                if (!unitDetails) {
                    navigate('/vocabulary');
                    return;
                }
                setUnitTitle(unitDetails.title);
                const currentProgress = getProgress(unitId);
                setProgress(currentProgress);
                const sessionDeck = createReviewDeck(unitDetails.coreVocab, currentProgress);
                setDeck(sessionDeck);
            } catch (error) {
                console.error("Failed to initialize flashcard session:", error);
            } finally {
                setLoading(false);
            }
        };
        initializeSession();
    }, [unitId, navigate]);

    const handleRate = useCallback((rating) => {
        if (currentCardIndex >= deck.length) return;

        const currentWord = deck[currentCardIndex];
        const wordProgress = progress[currentWord.word];
        
        const newWordProgress = calculateNextReview(wordProgress, rating);

        const updatedProgress = {
            ...progress,
            [currentWord.word]: newWordProgress,
        };
        
        setProgress(updatedProgress);
        saveProgress(unitId, updatedProgress);
        
        // Chuyển sang thẻ tiếp theo
        setTimeout(() => {
             setCurrentCardIndex(prevIndex => prevIndex + 1);
        }, 200); // Thêm độ trễ nhỏ để người dùng thấy phản hồi

    }, [currentCardIndex, deck, progress, unitId]);
    
    if (loading) {
        return <div style={styles.container}>Đang chuẩn bị bộ thẻ...</div>;
    }

    const isSessionComplete = currentCardIndex >= deck.length;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Flashcards: {unitTitle}</h1>
                {!isSessionComplete && (
                     <p style={styles.progressText}>
                        Thẻ: {currentCardIndex + 1} / {deck.length}
                    </p>
                )}
            </header>
            
            {deck.length > 0 && !isSessionComplete && (
                <Flashcard 
                    cardData={deck[currentCardIndex]}
                    onRate={handleRate}
                />
            )}
            
            {deck.length === 0 && !loading && (
                 <div style={styles.completionContainer}>
                    <h2>Tuyệt vời!</h2>
                    <p>Bạn đã hoàn thành tất cả các thẻ cần ôn tập cho hôm nay.</p>
                     <a href={`/vocabulary/${unitId}`} onClick={(e) => { e.preventDefault(); navigate(`/vocabulary/${unitId}`); }} style={styles.backButton}>
                        Quay lại
                    </a>
                </div>
            )}

            {isSessionComplete && deck.length > 0 && (
                 <div style={styles.completionContainer}>
                    <h2>Hoàn thành!</h2>
                    <p>Bạn đã ôn tập xong {deck.length} thẻ trong phiên này.</p>
                     <a href={`/vocabulary/${unitId}`} onClick={(e) => { e.preventDefault(); navigate(`/vocabulary/${unitId}`); }} style={styles.backButton}>
                        Quay lại
                    </a>
                </div>
            )}
        </div>
    );
};

export default FlashcardPage;
