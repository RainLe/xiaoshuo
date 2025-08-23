import React, { useEffect, useState } from "react";
import { Tooltip, Modal, Pagination } from "antd";
import AuditModal from "../AuditModal";
import { Card, Typography, List, Skeleton, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import pageStyles from "../../styles/page.module.css";
import styles from "./ArticleDetail.module.css";

const ArticleDetail = ({ article }) => {
  const [showReason, setShowReason] = useState("");
  const [auditModal, setAuditModal] = useState({
    visible: false,
    chapterId: null,
  });
  const [refuseReason, setRefuseReason] = useState("");
  // 状态映射
  const statusMap = {
    draft: "草稿",
    unpublished: "未发布",
    published: "已发布",
  };
  const [chapterList, setChapterList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("reader");
  const navigate = useNavigate();

  useEffect(() => {
    // 获取当前用户信息
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/userinfo/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.id);
          setRole(data.role);
        });
    }
  }, []);

  useEffect(() => {
    if (article) {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:8000/api/chapters/?item_id=${article.id}&page=${page}&size=${pageSize}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setChapterList(data.data);
          setTotal(data.total);
        });
    }
  }, [article, page, pageSize]);

  if (!article) {
    return (
      <div className={pageStyles.page}>
        <Card style={{ margin: "32px auto", maxWidth: 700 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    );
  }

  // ...existing code...

  const isAuthor = userId && article.author_id === userId;

  return (
    <div className={pageStyles.page}>
      <AuditModal
        auditModal={auditModal}
        refuseReason={refuseReason}
        setRefuseReason={setRefuseReason}
        setAuditModal={setAuditModal}
        article={article}
        setChapterList={setChapterList}
      />
      <Typography.Title level={2} className={styles.title}>
        {article.title}
      </Typography.Title>
      <Typography.Text type="secondary" className={styles.meta}>
        发表时间：{new Date(article.pub_date).toLocaleString()}
      </Typography.Text>
      {isAuthor && (
        <Button
          type="primary"
          style={{ margin: "16px 0" }}
          onClick={() => navigate(`/chapter/new?item_id=${article.id}`)}
        >
          添加章节
        </Button>
      )}
      <List
        itemLayout="horizontal"
        dataSource={chapterList}
        className={styles.chapterList}
        renderItem={(chapter) => (
          <List.Item className={styles.chapterItem}>
            <List.Item.Meta
              title={
                <>
                  <Link
                    className={styles.chapterLink}
                    to={`/chapter/${chapter.id}`}
                  >
                    {chapter.title}
                  </Link>
                  <span style={{ marginLeft: 12, color: "#888", fontSize: 14 }}>
                    {statusMap[chapter.status] || chapter.status}
                    {chapter.status === "draft" && chapter.refuse_reason && (
                      <Tooltip title={"不通过原因: " + chapter.refuse_reason}>
                        <span
                          style={{
                            marginLeft: 6,
                            color: "#faad14",
                            cursor: "pointer",
                            borderRadius: "50%",
                            border: "1px solid #faad14",
                            padding: "0 6px",
                            fontWeight: "bold",
                          }}
                        >
                          ?
                        </span>
                      </Tooltip>
                    )}
                  </span>

                  {chapter.status === "draft" && isAuthor && (
                    <Button
                      type="link"
                      style={{ marginLeft: 16, color: "#1890ff", padding: 0 }}
                      onClick={async (e) => {
                        e.preventDefault();
                        const token = localStorage.getItem("token");
                        await fetch(
                          `http://localhost:8000/api/chapters/${chapter.id}/`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: "unpublished" }),
                          }
                        );
                        // 刷新章节列表
                        fetch(
                          `http://localhost:8000/api/chapters/?item_id=${article.id}&page=${page}&size=${pageSize}`,
                          {
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : {},
                          }
                        )
                          .then((res) => res.json())
                          .then((data) => {
                            setChapterList(data.data);
                            setTotal(data.total);
                          });
                      }}
                    >
                      提交审核
                    </Button>
                  )}
                  {chapter.status === "unpublished" && role === "editor" && (
                    <>
                      <Button
                        type="link"
                        style={{ marginLeft: 16, color: "#52c41a", padding: 0 }}
                        onClick={async (e) => {
                          e.preventDefault();
                          const token = localStorage.getItem("token");
                          await fetch(
                            `http://localhost:8000/api/chapters/${chapter.id}/`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                status: "published",
                                refuse_reason: "",
                              }),
                            }
                          );
                          // 刷新章节列表
                          fetch(
                            `http://localhost:8000/api/chapters/?item_id=${article.id}&page=${page}&size=${pageSize}`,
                            {
                              headers: token
                                ? { Authorization: `Bearer ${token}` }
                                : {},
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              setChapterList(data.data);
                              setTotal(data.total);
                            });
                        }}
                      >
                        审核通过
                      </Button>
                      <Button
                        type="link"
                        style={{ marginLeft: 8, color: "#f5222d", padding: 0 }}
                        onClick={() =>
                          setAuditModal({
                            visible: true,
                            chapterId: chapter.id,
                          })
                        }
                      >
                        审核不通过
                      </Button>
                    </>
                  )}
                </>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: "暂无章节" }}
      />
      {/* 分页控件 */}
      <div>
        <Pagination
          size="small"
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
          style={{ minWidth: 320 }}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
