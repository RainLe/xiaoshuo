
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleDetail from '../components/ArticleDetail';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/items/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setArticle(data));
  }, [id]);

    return <ArticleDetail article={article} />;

};

export default ArticleDetailPage;
