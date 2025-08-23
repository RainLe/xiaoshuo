import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChapterDetail from "../components/ChapterDetail";

const ChapterDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [chapter, setChapter] = useState(null);
  const [userId, setUserId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [authorId, setAuthorId] = useState(0);
  const [loading, setLoading] = useState(true);

  // let isAuthor = false;
  useEffect(() => {
    const token = localStorage.getItem("token");
    // let userIdTemp = null;
    // let itemIdTemp = null;
    // 1. 获取用户信息
    if (!token) {
      window.location.href = "/login";
    }

    fetch("http://localhost:8000/api/userinfo/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((userData) => {
        setUserId(userData.id);
        // 2. 获取章节信息
        if (id && id !== "new") {
          fetch(`http://localhost:8000/api/chapters/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (res.status === 401) {
                window.location.href = "/login";
                return null;
              }
              return res.json();
            })
            .then((chapterData) => {
              setChapter(chapterData);
              setItemId(chapterData.item_id);
              fetch(`http://localhost:8000/api/items/${chapterData.item_id}/`, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((res) => res.json())
                .then((itemData) => {
                  setAuthorId(itemData.author_id);
                  setLoading(false);
                });
            });
        } else {
          // 新增章节
          const item_id = searchParams.get("item_id");
          setItemId(item_id);
          setChapter(null);
          // itemIdTemp = item_id;
          // 3. 获取文章信息
          if (item_id) {
            fetch(`http://localhost:8000/api/items/${item_id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((itemData) => {
                setAuthorId(itemData.author_id);
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        }
      });
  }, [id, searchParams]);

  if (loading) return <></>; // 或 loading
  if (!userId) return <></>; // 或 loading
  if (!authorId) return <></>; // 或 loading

  return (
    <ChapterDetail
      chapter={chapter}
      itemId={itemId}
      userId={userId}
      author_id={authorId}
    />
  );
};

export default ChapterDetailPage;
