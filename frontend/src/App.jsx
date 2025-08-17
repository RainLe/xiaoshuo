import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import ChapterDetail from './pages/ChapterDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css';


const App = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({ title: '', category: '', pub_date: '' });

  useEffect(() => {
    fetch('http://localhost:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const fetchItems = () => {
    let url = 'http://localhost:8000/api/items/?';
    if (query.title) url += `search=${query.title}&`;
    if (query.category) url += `category=${query.category}&`;
    if (query.pub_date) url += `ordering=pub_date&`;
    fetch(url)
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Home
            items={items}
            categories={categories}
            query={query}
            setQuery={setQuery}
            fetchItems={fetchItems}
          />
        } />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/chapter/:id" element={<ChapterDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
