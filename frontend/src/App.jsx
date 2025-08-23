import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import ChapterDetail from "./pages/ChapterDetail";
import Login from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";

const App = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({ title: "", category: "", pub_date: "" });
  const [total, setTotal] = useState(100);

  const navigateToLogin = () => {
    // localStorage.removeItem("token");
    if (window.location.pathname === "/login") return;
    window.location.href = "/login";
  };

  const fetchItems = (page, size) => {
    const token = localStorage.getItem("token");
    let url = `http://localhost:8000/api/items/?`;
    if (query.title) url += `search=${query.title}&`;
    if (query.category) url += `category=${query.category}&`;
    if (query.pub_date) url += `ordering=pub_date&`;
    if (page) url += `page=${page}&`;
    if (size) url += `size=${size}&`;
    console.log("fetch items url:", url);
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (res.status === 401) {
          navigateToLogin();
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setItems(data.data);
        setTotal(data.total);
      });
  };

  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    let url = "http://localhost:8000/api/categories/";
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (res.status === 401) {
          navigateToLogin();
          return [];
        }
        return res.json();
      })
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchItems(1, 10);
      fetchCategories();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/userinfo"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home
                items={items}
                categories={categories}
                query={query}
                setQuery={setQuery}
                fetchItems={(page, size) => fetchItems(page, size)}
                total={total}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:id"
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chapter/:id"
          element={
            <ProtectedRoute>
              <ChapterDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
