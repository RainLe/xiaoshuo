import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import ChapterDetail from './pages/ChapterDetail';
import Login from './pages/Login';
import UserInfo from './pages/UserInfo';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css';


const App = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({ title: '', category: '', pub_date: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/categories/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const fetchItems = () => {
    const token = localStorage.getItem('token');
    let url = 'http://localhost:8000/api/items/?';
    if (query.title) url += `search=${query.title}&`;
    if (query.category) url += `category=${query.category}&`;
    if (query.pub_date) url += `ordering=pub_date&`;
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
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
        <Route path="/login" element={<Login />} />
        <Route path="/userinfo" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home
              items={items}
              categories={categories}
              query={query}
              setQuery={setQuery}
              fetchItems={fetchItems}
            />
          </ProtectedRoute>
        } />
        <Route path="/article/:id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
        <Route path="/chapter/:id" element={<ProtectedRoute><ChapterDetail /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
