import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChapterDetail from '../components/ChapterDetail';

const ChapterDetailPage = () => {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/chapters/${id}/`)
      .then(res => res.json())
      .then(data => {
        setChapter(data);
      });
  }, [id]);

  return <ChapterDetail chapter={chapter}/>;
};

export default ChapterDetailPage;
