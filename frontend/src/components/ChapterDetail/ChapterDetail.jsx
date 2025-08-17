import React from 'react';
import { Card, Typography, Skeleton } from 'antd';
import styles from '../../styles/page.module.css'
import chapterStyles from './ChapterDetail.module.css';

const ChapterDetail = ({ chapter}) => {
  if (!chapter) return null;
  return (
  <div className={styles.page}>
    <Card className={chapterStyles.card}>
      <Typography.Title level={3}>{chapter.title}</Typography.Title>
      <Typography.Paragraph className={chapterStyles.paragraph}>{chapter.content}</Typography.Paragraph>
    </Card>
    </div>
  );
};

export default ChapterDetail;
