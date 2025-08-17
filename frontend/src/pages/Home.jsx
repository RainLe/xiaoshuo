import React from 'react';
import QueryBar from '../components/QueryBar';
import ArticleList from '../components/ArticleList';
import styles from '../styles/page.module.css';


import { useNavigate } from 'react-router-dom';

const Home = ({ items, categories, query, setQuery, fetchItems }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };
  return (
    <div className={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>小说发布系统</h1>
        <button onClick={handleLogout} style={{ padding: '6px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>登出</button>
      </div>
      <QueryBar query={query} setQuery={setQuery} categories={categories} onSearch={fetchItems} />
      <ArticleList items={items} />
    </div>
  );
};

export default Home;
