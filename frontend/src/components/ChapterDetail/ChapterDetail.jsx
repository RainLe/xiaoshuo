import React, { useState, useEffect } from "react";
import { Card, Typography, Skeleton, Form, Input, Button, message } from "antd";
import styles from "../../styles/page.module.css";
import chapterStyles from "./ChapterDetail.module.css";

const ChapterDetail = ({ chapter, itemId, userId, author_id }) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  // const [chapter, setChapter] = useState(chapter);
  const isAuthor = userId == author_id;

  useEffect(() => {
    // 表单赋值
    if (chapter) {
      form.setFieldsValue({ title: chapter.title, content: chapter.content });
      setEditMode(false);
    } else {
      form.resetFields();
      if (itemId && isAuthor) {
        setEditMode(true);
      } else {
        setEditMode(false);
      }
    }
  }, [chapter, itemId, isAuthor, form]);

  if (!chapter && !itemId) return null;

  const handleSave = async (values) => {
    const token = localStorage.getItem("token");
    let url, method;
    if (chapter) {
      url = `http://localhost:8000/api/chapters/${chapter.id}/`;
      method = "PUT";
    } else {
      url = "http://localhost:8000/api/chapters/";
      method = "POST";
    }
    const body = {
      ...values,
      item_id: itemId || (chapter && chapter.item_id),
      order: chapter ? chapter.order : 1,
      content_file: chapter ? chapter.content_file : "",
      status: "draft",
    };
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      message.success("保存成功");
      setEditMode(false);
      // 跳转到本章节详情页
      const chapterId = chapter ? chapter.id : (await res.json()).id;
      window.location.href = `/chapter/${chapterId}`;
    } else {
      message.error("保存失败");
      // 跳转到本章节详情页
      if (chapter && chapter.id) {
        window.location.href = `/chapter/${chapter.id}`;
      }
    }
  };

  if (editMode && isAuthor) {
    return (
      <div className={styles.page}>
        <Card className={chapterStyles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={chapter ? chapter.title : ""}
          >
            <Form.Item
              label="章节标题"
              name="title"
              rules={[{ required: true, message: "请输入章节标题" }]}
            >
              <Input defaultValue={chapter ? chapter.title : ""} />
            </Form.Item>
            <Form.Item
              label="章节内容"
              name="content"
              rules={[
                { required: true, message: "请输入章节内容" },
                { max: 10000, message: "章节内容不能超过10000字符" },
              ]}
            >
              <Input.TextArea
                rows={8}
                defaultValue={chapter ? chapter.content : ""}
                maxLength={10000}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button
                type="default"
                onClick={() => setEditMode(false)}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card className={chapterStyles.card}>
        <Typography.Title level={3}>
          {chapter ? chapter.title : "新章节"}
        </Typography.Title>
        <Typography.Paragraph className={chapterStyles.paragraph}>
          {chapter ? chapter.content : ""}
        </Typography.Paragraph>
        {isAuthor && chapter && (
          <Button
            type="primary"
            style={{ marginTop: 16 }}
            onClick={() => setEditMode(true)}
          >
            编辑章节
          </Button>
        )}
      </Card>
    </div>
  );
};

export default ChapterDetail;
