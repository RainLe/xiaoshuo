import React from "react";
import { Modal, Input } from "antd";

const AuditModal = ({
  auditModal,
  refuseReason,
  setRefuseReason,
  setAuditModal,
  article,
  setChapterList,
}) => {
  const onOk = async () => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8000/api/chapters/${auditModal.chapterId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "draft",
        refuse_reason: refuseReason,
      }),
    });
    setAuditModal({ visible: false, chapterId: null });
    setRefuseReason("");
    // 刷新章节列表
    const res = await fetch(
      `http://localhost:8000/api/chapters/?item_id=${article.id}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    const data = await res.json();
    setChapterList(data);
  };
  const onCancel = () => {
    setAuditModal({ visible: false, chapterId: null });
    setRefuseReason("");
  };
  return (
    <Modal
      title="填写不通过原因"
      open={auditModal.visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="提交"
      cancelText="取消"
    >
      <Input.TextArea
        rows={3}
        value={refuseReason}
        onChange={(e) => setRefuseReason(e.target.value)}
        placeholder="请输入不通过原因"
      />
    </Modal>
  );
};

export default AuditModal;
