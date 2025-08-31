import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVocabUnitDetails } from '/src/api/dataService.js';
import VocabularyCard from '../components/features/vocabulary/VocabularyCard';
import VocabularyDetailModal from '../components/features/vocabulary/VocabularyDetailModal';


const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #eee',
        paddingBottom: '20px'
    },
    title: {
        fontSize: '2.2rem',
        margin: 0
    },
    backButton: {
        display: 'inline-block',
        padding: '10px 15px',
        backgroundColor: '#6c757d',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none',
        marginBottom: '20px',
        fontWeight: 'bold'
    },
    vocabList: {
        listStyle: 'none',
        padding: 0
    },
};

const BrowseVocabularyPage = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const [unitDetails, setUnitDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVocab, setSelectedVocab] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getVocabUnitDetails(unitId);
                setUnitDetails(data);
            } catch (error) {
                console.error("Failed to fetch unit details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [unitId]);
    
    const handleCardClick = (vocab) => {
        setSelectedVocab(vocab);
    };

    const handleCloseModal = () => {
        setSelectedVocab(null);
    };


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải từ vựng...</div>;
    }

    if (!unitDetails || !unitDetails.coreVocab) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy dữ liệu từ vựng cho bài học này.</div>;
    }

    return (
        <div style={styles.container}>
            <a href={`/vocabulary/${unitId}`} onClick={(e) => { e.preventDefault(); navigate(`/vocabulary/${unitId}`); }} style={styles.backButton}>
                &larr; Quay lại
            </a>
            <header style={styles.header}>
                <h1 style={styles.title}>Toàn bộ từ vựng: {unitDetails.title}</h1>
            </header>
            <ul style={styles.vocabList}>
                {unitDetails.coreVocab.map((vocab, index) => (
                    <VocabularyCard 
                        key={index}
                        vocab={vocab}
                        onClick={handleCardClick}
                    />
                ))}
            </ul>

            <VocabularyDetailModal 
                vocab={selectedVocab}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default BrowseVocabularyPage;

