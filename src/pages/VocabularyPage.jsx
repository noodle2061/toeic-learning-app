import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVocabularyUnits } from '../api/dataService';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  unitList: {
    listStyle: 'none',
    padding: 0
  },
  unitItem: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '10px'
  },
  unitLink: {
    display: 'block',
    padding: '15px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  },
  // Style cho nút quay lại
  backButton: {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    marginBottom: '20px',
    fontWeight: 'bold',
  }
};

const VocabularyPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const unitData = await getVocabularyUnits();
        setUnits(unitData);
      } catch (error) {
        console.error("Failed to fetch vocabulary units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách bài học...</div>;
  }

  return (
    <div style={styles.container}>
      {/* NÚT QUAY VỀ TRANG CHỦ */}
      <Link to="/" style={styles.backButton}>
        &larr; Quay về trang chủ
      </Link>

      <h1 style={styles.title}>Danh sách bài học từ vựng</h1>
      <ul style={styles.unitList}>
        {units.map((unit, index) => (
          <li key={unit.unitId} style={styles.unitItem}>
            <Link to={`/vocabulary/${unit.unitId}`} style={styles.unitLink}>
              {index + 1}. {unit.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyPage;

