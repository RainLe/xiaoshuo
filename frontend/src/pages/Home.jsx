import React, { useState } from "react";
import { Pagination } from "antd";
import QueryBar from "../components/QueryBar";
import ArticleList from "../components/ArticleList";
import styles from "../styles/page.module.css";
import AddArticleModal from "../components/AddArticleModal";

import { useNavigate } from "react-router-dom";

const Home = ({ items, categories, query, setQuery, fetchItems, total }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 可调整每页数量
  // 假设 items.total 是总条数，items.data 是当前页数据
  // const total = 100;

  const handleLogout = () => {
    // localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // 文章发布提交逻辑
  const handleAddArticle = async (data) => {
    setLoading(true);
    // 假设后端接口为 /api/items/，POST 方法
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/items/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        summary: data.summary,
        category_id: data.category_id,
      }),
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
        fetchItems && fetchItems(page, pageSize);
        setLoading(false);
      });
  };

  return (
    <div className={styles.page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>小说发布系统</h1>
        <div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginRight: 12,
              padding: "6px 16px",
              background: "#52c41a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            发布文章
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 16px",
              background: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            登出
          </button>
        </div>
      </div>
      <QueryBar
        query={query}
        setQuery={setQuery}
        categories={categories}
        onSearch={() => fetchItems(page, pageSize)}
      />
      <ArticleList items={items?.data || items} />
      {/* antd 分页控件 */}

      <Pagination
        size="small"
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        onChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
          console.log("page change", p, ps);
          fetchItems(p, ps);
        }}
        // style={{ minWidth: 320 }}
      />
      <AddArticleModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddArticle}
        categories={categories}
      />
    </div>
  );
};

export default Home;
