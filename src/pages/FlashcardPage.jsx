import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
        // Không cần flexbox phức tạp nữa
    },
    title: {
        fontSize: '2rem',
        margin: 0,
    },
    progressText: {
        fontSize: '1.2rem',
        color: '#555',
        margin: '5px 0 0 0',
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
    },
    footer: {
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
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
    // THAY ĐỔI: Quản lý trạng thái lật thẻ ở component cha
    const [isFlipped, setIsFlipped] = useState(false);

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
        
        // BƯỚC 1: Lật thẻ lại mặt trước
        setIsFlipped(false);
        
        // BƯỚC 2: Đợi cho animation lật thẻ diễn ra rồi mới chuyển thẻ tiếp theo
        setTimeout(() => {
             setCurrentCardIndex(prevIndex => prevIndex + 1);
        }, 300); // Thời gian chờ (ms), nên nhỏ hơn thời gian animation một chút

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
                    // THAY ĐỔI: Truyền state và hàm set state vào component con
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}
                />
            )}
            
            {deck.length === 0 && !loading && (
                 <div style={styles.completionContainer}>
                    <h2>Tuyệt vời!</h2>
                    <p>Bạn đã hoàn thành tất cả các thẻ cần ôn tập cho hôm nay.</p>
                     <Link to={`/vocabulary/${unitId}`} style={styles.backButton}>
                        Quay lại bài học
                    </Link>
                </div>
            )}

            {isSessionComplete && deck.length > 0 && (
                  <div style={styles.completionContainer}>
                    <h2>Hoàn thành!</h2>
                    <p>Bạn đã ôn tập xong {deck.length} thẻ trong phiên này.</p>
                     <Link to={`/vocabulary/${unitId}`} style={styles.backButton}>
                         Quay lại bài học
                    </Link>
                </div>
            )}

            {/* Nút quay lại ở cuối trang, chỉ hiển thị trong phiên học */}
            {!isSessionComplete && deck.length > 0 && (
                <footer style={styles.footer}>
                     <Link to={`/vocabulary/${unitId}`} style={styles.backButton}>
                        &larr; Rời khỏi phiên học
                    </Link>
                </footer>
            )}
        </div>
    );
};

export default FlashcardPage;
