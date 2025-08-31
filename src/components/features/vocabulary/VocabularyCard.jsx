import React from 'react';

const styles = {
    vocabItem: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    wordHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px'
    },
    word: {
        fontSize: '1.7rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#0056b3'
    },
    pronunciation: {
        marginLeft: '15px',
        fontStyle: 'italic',
        color: '#555'
    },
    definition: {
        margin: '0',
        color: '#333'
    }
};

const VocabularyCard = ({ vocab, onClick }) => {
    // Thêm hiệu ứng hover ngay trong component
    const handleMouseOver = (e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    };
    
    return (
        <li 
            style={styles.vocabItem} 
            onClick={() => onClick(vocab)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div style={styles.wordHeader}>
                <h2 style={styles.word}>{vocab.word}</h2>
                <span style={styles.pronunciation}>
                    {vocab.pronunciation?.us ? `/${vocab.pronunciation.us}/` : ''}
                </span>
            </div>
            <p style={styles.definition}>
                {vocab.meanings && vocab.meanings[0]?.vi ? vocab.meanings[0].vi : 'Chưa có định nghĩa'}
            </p>
        </li>
    );
};

export default VocabularyCard;
