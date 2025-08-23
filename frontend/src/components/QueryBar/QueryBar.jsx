import React from "react";
import { Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./QueryBar.module.css";

const QueryBar = ({ query, setQuery, categories, onSearch }) => (
  <div className={styles.queryBar}>
    <Input
      placeholder="按题目查询"
      value={query.title}
      onChange={(e) => setQuery({ ...query, title: e.target.value })}
      style={{ width: 200, height: 40 }}
      size="large"
    />
    <Select
      placeholder="按栏目查询"
      value={query.category || undefined}
      onChange={(value) => setQuery({ ...query, category: value })}
      style={{ width: 180, height: 40 }}
      size="large"
      allowClear
    >
      {(categories || []).map((cat) => (
        <Select.Option key={cat.id} value={cat.id}>
          {cat.name}
        </Select.Option>
      ))}
    </Select>
    <Button
      type="primary"
      icon={<SearchOutlined />}
      onClick={onSearch}
      size="large"
      className={styles.queryBtn}
      style={{
        height: 40,
        borderRadius: 20,
        boxShadow: "0 2px 8px rgba(46, 34, 34, 0.08)",
        background: "linear-gradient(90deg, #1677ff 0%, #49c2ff 100%)",
        border: "none",
        color: "#fff",
        fontWeight: 600,
        transition: "background 0.3s",
        cursor: "pointer",
        outline: "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #49c2ff 0%, #1677ff 100%)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #1677ff 0%, #49c2ff 100%)")
      }
      onMouseDown={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #1677ff 60%, #49c2ff 100%)")
      }
      onMouseUp={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #49c2ff 0%, #1677ff 100%)")
      }
    >
      查询
    </Button>
  </div>
);

export default QueryBar;
