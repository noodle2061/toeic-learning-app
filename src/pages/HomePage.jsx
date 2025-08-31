import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '40px'
  },
  menu: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },
  menuItem: {
    display: 'block',
    padding: '20px 40px',
    fontSize: '1.2rem',
    color: 'white',
    backgroundColor: '#007bff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background-color 0.3s'
  }
};

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TOEIC Learning Hub</h1>
      <nav style={styles.menu}>
        <Link to="/vocabulary" style={styles.menuItem} onMouseOver={e => e.target.style.backgroundColor='#0056b3'} onMouseOut={e => e.target.style.backgroundColor='#007bff'}>
          Học Từ Vựng
        </Link>
        <Link to="/grammar" style={{...styles.menuItem, backgroundColor: '#6c757d', cursor: 'not-allowed'}} onClick={e => e.preventDefault()}>
          Học Ngữ Pháp (Sắp có)
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;

