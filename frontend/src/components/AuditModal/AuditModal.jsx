import React from "react";
import { Modal, Input } from "antd";
import styles from "./AuditModal.module.css";

const AuditModal = ({
  visible,
  refuseReason,
  setRefuseReason,
  onOk,
  onCancel,
}) => (
  <Modal
    className={styles.modal}
    title="填写不通过原因"
    open={visible}
    onOk={onOk}
    onCancel={onCancel}
    okText="提交"
    cancelText="取消"
  >
    <Input.TextArea
      className={styles.textarea}
      rows={3}
      value={refuseReason}
      onChange={(e) => setRefuseReason(e.target.value)}
      placeholder="请输入不通过原因"
    />
  </Modal>
);

export default AuditModal;
