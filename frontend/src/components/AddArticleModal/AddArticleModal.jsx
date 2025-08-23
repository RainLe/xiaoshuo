import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const AddArticleModal = ({ visible, onClose, onSubmit, categories = [] }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      onClose();
    } catch (err) {
      // 校验失败
    }
  };

  return (
    <Modal
      title="发布新文章"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          label="文章名称"
          name="name"
          rules={[{ required: true, message: "请输入文章名称" }]}
        >
          <Input placeholder="请输入文章名称" />
        </Form.Item>
        <Form.Item
          label="文章摘要"
          name="summary"
          rules={[{ required: true, message: "请输入文章摘要" }]}
        >
          <Input.TextArea placeholder="请输入文章摘要" rows={4} />
        </Form.Item>
        <Form.Item
          label="所属栏目"
          name="category_id"
          rules={[{ required: true, message: "请选择栏目" }]}
        >
          <Select placeholder="请选择栏目">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            style={{ marginRight: 8 }}
          >
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            发布
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddArticleModal;
