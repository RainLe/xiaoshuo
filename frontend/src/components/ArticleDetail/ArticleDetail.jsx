import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import pageStyles from '../../styles/page.module.css';
import styles from './ArticleDetail.module.css';

const ArticleDetail = ({ article }) => {
  const [chapterList, setChapterList] = useState([]);

  useEffect(() => {
    if (article && (!chapterList || chapterList.length === 0)) {
      fetch(`http://localhost:8000/api/chapters/?item_id=${article.id}`)
        .then(res => res.json())
        .then(data => setChapterList(data));
    } else if (chapterList) {
      setChapterList(chapterList);
    }
  }, [article, chapterList]);

  if (!article) {
    return (
  <div className={pageStyles.page}>
        <Card style={{ margin: '32px auto', maxWidth: 700 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className={pageStyles.page}>
      <Typography.Title level={2} className={styles.title}>{article.title}</Typography.Title>
      <Typography.Text type="secondary" className={styles.meta}>
        发表时间：{new Date(article.pub_date).toLocaleString()}
      </Typography.Text>
      <List
        itemLayout="horizontal"
        dataSource={chapterList}
        className={styles.chapterList}
        renderItem={chapter => (
          <List.Item className={styles.chapterItem}>
            <List.Item.Meta
              title={<Link className={styles.chapterLink} to={`/chapter/${chapter.id}`}>{chapter.title}</Link>}
            />
          </List.Item>
        )}
        locale={{ emptyText: '暂无章节' }}
      />
    </div>
  );
};

export default ArticleDetail;
