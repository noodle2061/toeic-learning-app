import React, { useState, useEffect } from 'react';

// Speaker Icon SVG Component
const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

const styles = {
    flashcardWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    cardContainer: {
        perspective: '1000px',
        width: '100%',
        maxWidth: '500px',
        height: '300px',
    },
    cardInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '20px',
        boxSizing: 'border-box',
    },
    cardFront: {
        backgroundColor: '#ffffff',
        color: '#212529',
    },
    cardBack: {
        backgroundColor: '#007bff',
        color: 'white',
        transform: 'rotateY(180deg)',
    },
    wordContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    word: {
        fontSize: '3rem',
        fontWeight: 'bold',
        margin: 0,
    },
    speakButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#6c757d',
        position: 'absolute',
        left: '100%',
        marginLeft: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'background-color 0.2s',
    },
    pronunciation: {
        fontStyle: 'italic',
        marginTop: '10px',
        color: '#6c757d',
    },
    meaning: {
        fontSize: '1.8rem',
        fontWeight: '500',
        margin: '0 0 15px 0',
    },
    example: {
        fontSize: '1.1rem',
        fontStyle: 'italic',
        maxWidth: '90%',
        color: 'rgba(255, 255, 255, 0.85)',
        margin: 0,
    },
    flipInstruction: {
        marginTop: '20px',
        color: '#adb5bd',
        fontSize: '0.9rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '25px',
        width: '100%',
        maxWidth: '500px',
    },
    rateButton: {
        padding: '12px 0',
        flex: 1,
        fontSize: '1rem',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};

const Flashcard = ({ cardData, onRate }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [cardData]);

    if (!cardData) return null;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSpeak = (e) => {
        e.stopPropagation(); // Ngăn việc lật thẻ khi bấm nút loa
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(cardData.word);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleRatingClick = (rating) => {
        onRate(rating);
    };

    const addHoverEffect = (e, color) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 8px rgba(0,0,0,0.2)`;
    };

    const removeHoverEffect = (e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    };
    
    return (
        <div style={styles.flashcardWrapper}>
            <div style={styles.cardContainer}>
                <div style={{ ...styles.cardInner, transform: isFlipped ? 'rotateY(180deg)' : 'none' }} onClick={handleFlip}>
                    <div style={{ ...styles.cardFace, ...styles.cardFront }}>
                        <div style={styles.wordContainer}>
                             <h2 style={styles.word}>{cardData.word}</h2>
                             <button 
                                style={styles.speakButton} 
                                onClick={handleSpeak}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <SpeakerIcon />
                            </button>
                        </div>
                        <p style={styles.pronunciation}>/{cardData.pronunciation?.us}/</p>
                        <p style={styles.flipInstruction}>Nhấn để xem nghĩa</p>
                    </div>
                    <div style={{ ...styles.cardFace, ...styles.cardBack }}>
                        <p style={styles.meaning}>{cardData.meanings[0]?.vi}</p>
                        {cardData.examples[0] && (
                            <p style={styles.example}>"{cardData.examples[0].en}"</p>
                        )}
                    </div>
                </div>
            </div>
            {isFlipped && (
                <div style={styles.buttonContainer}>
                    <button 
                        style={{ ...styles.rateButton, backgroundColor: '#dc3545' }} 
                        onClick={() => handleRatingClick('again')}
                        onMouseOver={addHoverEffect} onMouseOut={removeHoverEffect}
                    >Quên</button>
                    <button 
                        style={{ ...styles.rateButton, backgroundColor: '#fd7e14' }} 
                        onClick={() => handleRatingClick('hard')}
                        onMouseOver={addHoverEffect} onMouseOut={removeHoverEffect}
                    >Khó</button>
                    <button 
                        style={{ ...styles.rateButton, backgroundColor: '#28a745' }} 
                        onClick={() => handleRatingClick('good')}
                        onMouseOver={addHoverEffect} onMouseOut={removeHoverEffect}
                    >Tốt</button>
                    <button 
                        style={{ ...styles.rateButton, backgroundColor: '#17a2b8' }} 
                        onClick={() => handleRatingClick('easy')}
                        onMouseOver={addHoverEffect} onMouseOut={removeHoverEffect}
                    >Dễ</button>
                </div>
            )}
        </div>
    );
};

export default Flashcard;

