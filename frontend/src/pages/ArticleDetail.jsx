import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleDetail from "../components/ArticleDetail";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`http://localhost:8000/api/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          // localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setArticle(data);
        setLoading(false);
      });
  }, [id]);
  if (loading) return <div>Loading...</div>;
  return <ArticleDetail article={article} />;
};

export default ArticleDetailPage;
