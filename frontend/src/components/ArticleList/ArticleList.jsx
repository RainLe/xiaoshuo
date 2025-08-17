import React from 'react';
import { Link } from 'react-router-dom';
import { List, Typography, Card } from 'antd';
import styles from './ArticleList.module.css';

const ArticleList = ({ items }) => (
  <List
    grid={{ gutter: 16, column: 1 }}
    dataSource={items}
    renderItem={item => (
      <List.Item>
        <Card className={styles.card}>
          <Typography.Title level={4} className={styles.title}>
            <Link className={styles.link} to={`/article/${item.id}`}>{item.title}</Link>
          </Typography.Title>
          <Typography.Text type="secondary" className={styles.meta}>
            发表时间：{new Date(item.pub_date).toLocaleString()}
          </Typography.Text>
          <Typography.Paragraph className={styles.summary} ellipsis={{ rows: 2 }}>{item.summary}</Typography.Paragraph>
        </Card>
      </List.Item>
    )}
    locale={{ emptyText: '暂无文章' }}
  />
);

export default ArticleList;
