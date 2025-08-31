import React from 'react';

const getOptionStyle = (option, question, questionState) => {
    const baseStyle = {
        padding: '15px',
        margin: '8px 0',
        border: '2px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease-in-out',
        width: '100%',
        fontSize: '1rem',
    };

    if (!questionState) {
        return {
            ...baseStyle,
            ':hover': {
                borderColor: '#007bff',
                backgroundColor: '#f8f9fa'
            }
        };
    }

    const isCorrect = option === question.correctAnswer;
    const isSelected = option === questionState.selected;

    if (isCorrect) {
        return {
            ...baseStyle,
            backgroundColor: '#d4edda', // Green
            borderColor: '#28a745',
            color: '#155724',
            cursor: 'default',
        };
    }

    if (isSelected) { // Incorrectly selected
        return {
            ...baseStyle,
            backgroundColor: '#f8d7da', // Red
            borderColor: '#dc3545',
            color: '#721c24',
            cursor: 'default',
        };
    }
    
    // Other options when an answer is selected
    return {
        ...baseStyle,
        backgroundColor: '#e9ecef',
        color: '#6c757d',
        cursor: 'default',
        opacity: 0.7
    };
};


const QuestionCard = ({ question, questionState, onAnswerSelect }) => {
    const hasAnswered = !!questionState;

    const handleOptionClick = (option) => {
        if (!hasAnswered) {
            onAnswerSelect(option);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '25px', color: '#343a40' }}>{question.questionText}</h3>
            <div>
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        style={getOptionStyle(option, question, questionState)}
                        disabled={hasAnswered}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {hasAnswered && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f1f3f5',
                    borderRadius: '5px',
                    borderLeft: '5px solid #007bff'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Giải thích:</p>
                    <p style={{ margin: '5px 0 0', color: '#495057' }}>{question.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;

