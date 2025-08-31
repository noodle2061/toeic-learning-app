import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVocabUnitDetails } from '../api/dataService.js'; // Sửa lỗi: Thêm phần mở rộng .js để đảm bảo đường dẫn được giải quyết chính xác.

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    margin: 0
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6c757d'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    listStyle: 'none',
    padding: 0
  },
  optionCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  optionLink: {
    display: 'block',
    padding: '25px 20px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    textAlign: 'center'
  },
  disabledCard: {
    backgroundColor: '#f8f9fa',
    color: '#adb5bd',
    cursor: 'not-allowed',
    boxShadow: 'none'
  }
};

const VocabularyUnitPage = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unitDetails, setUnitDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getVocabUnitDetails(unitId);
        if (data) {
          setUnitDetails(data);
        } else {
          navigate('/vocabulary'); // Redirect if unit not found
        }
      } catch (error) {
        console.error("Failed to fetch unit details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [unitId, navigate]);

  const learningOptions = [
    { name: 'Xem qua toàn bộ từ vựng', path: 'browse', enabled: true },
    { name: 'Flashcard Tương tác', path: 'flashcards', enabled: true },
    { name: 'Trắc nghiệm', path: 'quiz', enabled: false },
    { name: 'Điền từ còn thiếu', path: 'fill-in-blanks', enabled: false },
    { name: 'Ghép nối từ với nghĩa', path: 'match', enabled: false },
    { name: 'Nghe và chọn nghĩa', path: 'listen', enabled: false },
    { name: 'Thống kê tiến độ học', path: 'progress', enabled: false },
  ];

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải dữ liệu bài học...</div>;
  }

  if (!unitDetails) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Không tìm thấy bài học.</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>{unitDetails.title}</h1>
        <p style={styles.subtitle}>{unitDetails.description}</p>
      </header>
      <ul style={styles.grid}>
        {learningOptions.map(option => (
          <li
            key={option.path}
            style={{
                ...styles.optionCard, 
                ...(option.enabled ? {} : styles.disabledCard)
            }}
            onMouseOver={e => { if(option.enabled) { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)'; } }}
            onMouseOut={e => { if(option.enabled) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';} }}
          >
            {option.enabled ? (
              <Link to={`/vocabulary/${unitId}/${option.path}`} style={styles.optionLink}>
                {option.name}
              </Link>
            ) : (
              <div style={{...styles.optionLink, color: '#adb5bd'}}>
                {option.name} (Sắp có)
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyUnitPage;

