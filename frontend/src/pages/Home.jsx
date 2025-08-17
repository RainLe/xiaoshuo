import React from 'react';
import QueryBar from '../components/QueryBar';
import ArticleList from '../components/ArticleList';
import styles from '../styles/page.module.css';

const Home = ({ items, categories, query, setQuery, fetchItems }) => (
  <div className={styles.page}>
    <h1>小说发布系统</h1>
    <QueryBar query={query} setQuery={setQuery} categories={categories} onSearch={fetchItems} />
    <ArticleList items={items} />
  </div>
);

export default Home;
