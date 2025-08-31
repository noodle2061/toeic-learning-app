import React from 'react';

const styles = {
    paletteContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
    },
    questionButton: {
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '2px solid #adb5bd',
        backgroundColor: '#fff',
        color: '#495057',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
    },
    current: {
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        color: '#fff',
        transform: 'scale(1.1)',
    },
    correct: {
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        color: 'white',
    },
    incorrect: {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        color: 'white',
    },
    answered: {
        backgroundColor: '#e9ecef',
        borderColor: '#ced4da',
    }
};

const QuestionPalette = ({ questions, userAnswers, currentQuestionIndex, onQuestionSelect, isSubmitted }) => {
    
    const getButtonStatus = (index) => {
        const answer = userAnswers[index];
        let statusStyle = {};

        if (isSubmitted) {
            if (answer?.isCorrect) {
                statusStyle = styles.correct;
            } else if (answer) {
                 statusStyle = styles.incorrect;
            }
        } else {
            if (answer) {
                 statusStyle = styles.answered;
            }
        }
        
        if (index === currentQuestionIndex) {
            statusStyle = {...statusStyle, ...styles.current};
        }
        
        return statusStyle;
    };

    return (
        <div style={styles.paletteContainer}>
            {questions.map((_, index) => (
                <button
                    key={index}
                    style={{ ...styles.questionButton, ...getButtonStatus(index) }}
                    onClick={() => onQuestionSelect(index)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default QuestionPalette;
