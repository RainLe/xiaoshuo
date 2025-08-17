import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';

const UserInfo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/userinfo/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        form.setFieldsValue(data);
      });
  }, [form]);
  const onFinish = async (values) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/userinfo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    } catch {
      message.error('网络错误');
    }
    setLoading(false);
  };
  return (
    <Form form={form} onFinish={onFinish} style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <Form.Item name="username" label="用户名"> <Input disabled /> </Form.Item>
      <Form.Item name="email" label="邮箱"> <Input /> </Form.Item>
      <Form.Item name="first_name" label="名"> <Input /> </Form.Item>
      <Form.Item name="last_name" label="姓"> <Input /> </Form.Item>
      <Form.Item> <Button type="primary" htmlType="submit" loading={loading}>保存</Button> </Form.Item>
    </Form>
  );
};
export default UserInfo;
