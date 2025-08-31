import React from 'react';

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '0', // Gỡ padding để xử lý nội bộ
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '85vh', // Giới hạn chiều cao tối đa
        position: 'relative',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column', // Sắp xếp header và body theo chiều dọc
        overflow: 'hidden', // Ẩn thanh cuộn của container chính
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '1.8rem',
        cursor: 'pointer',
        color: '#888',
        zIndex: 1010, // Đảm bảo nút đóng luôn ở trên
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        padding: '20px 30px',
        flexShrink: 0, // Ngăn header bị co lại
    },
    modalBody: {
        padding: '20px 30px',
        overflowY: 'auto', // Cho phép cuộn phần thân
        flexGrow: 1, // Phần thân sẽ lấp đầy không gian còn lại
    },
    word: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#0056b3'
    },
    pronunciation: {
        marginLeft: '20px',
        fontStyle: 'italic',
        color: '#555',
        fontSize: '1.1rem',
    },
    speakButton: {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#007bff',
    },
    section: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '10px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '4px',
        display: 'inline-block',
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    tag: {
        backgroundColor: '#e0f3ff',
        color: '#0056b3',
        padding: '5px 12px',
        borderRadius: '16px',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
     exampleContainer: {
        fontStyle: 'italic',
        color: '#666',
        borderLeft: '4px solid #007bff',
        paddingLeft: '15px',
        margin: '10px 0'
    },
};

// Speaker Icon SVG Component
const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);


const VocabularyDetailModal = ({ vocab, onClose }) => {
    if (!vocab) return null;

    const handleSpeak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                
                <div style={styles.header}>
                    <h1 style={styles.word}>{vocab.word}</h1>
                    <span style={styles.pronunciation}>
                        {vocab.pronunciation?.uk && `UK: ${vocab.pronunciation.uk}`} <br/>
                        {vocab.pronunciation?.us && `US: ${vocab.pronunciation.us}`}
                    </span>
                    <button onClick={() => handleSpeak(vocab.word)} style={styles.speakButton}>
                        <SpeakerIcon />
                    </button>
                </div>

                <div style={styles.modalBody}>
                    <div style={styles.section}>
                        <p><strong>Loại từ:</strong> {vocab.type}</p>
                        <p><strong>Tần suất:</strong> {'★'.repeat(vocab.frequency || 1)}{'☆'.repeat(3 - (vocab.frequency || 1))}</p>
                    </div>
                    
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Định nghĩa</h3>
                        {vocab.meanings?.map((meaning, index) => <p key={index}>- {meaning.vi}</p>)}
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Ví dụ</h3>
                         {vocab.examples?.map((ex, index) => (
                            <div key={index} style={styles.exampleContainer}>
                                <p><strong>EN:</strong> {ex.en}</p>
                                <p><strong>VI:</strong> {ex.vi}</p>
                            </div>
                        ))}
                    </div>

                    {vocab.derivatives && vocab.derivatives.length > 0 && (
                         <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Từ liên quan</h3>
                            {vocab.derivatives.map((d, i) => <p key={i}>{d.word} ({d.type}): {d.meaning}</p>)}
                        </div>
                    )}
                   
                    {vocab.notes && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Ghi chú</h3>
                            <p>{vocab.notes}</p>
                        </div>
                    )}

                    {vocab.tags && vocab.tags.length > 0 && (
                        <div style={styles.section}>
                             <h3 style={styles.sectionTitle}>Thẻ</h3>
                             <div style={styles.tagContainer}>
                                {vocab.tags.map((tag, index) => <span key={index} style={styles.tag}>#{tag}</span>)}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocabularyDetailModal;

