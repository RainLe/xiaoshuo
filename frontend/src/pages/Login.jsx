import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showRegister, setShowRegister] = useState(false);

  // 登录表单状态
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // 注册表单状态
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("reader");
  const [regLoading, setRegLoading] = useState(false);

  // 登录提交
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      alert("请输入用户名和密码");
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (data.access) {
        await localStorage.setItem("token", data.access);
        alert("登录成功");
        if (onLogin) onLogin();
        navigate(from, { replace: true });
      } else {
        alert(data.error || "登录失败");
      }
    } catch {
      alert("网络错误");
    }
    setLoginLoading(false);
  };

  // 注册提交
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsername || !regPassword) {
      alert("请输入用户名和密码");
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          role: regRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("注册成功，请登录");
        setShowRegister(false);
        setRegUsername("");
        setRegPassword("");
        setRegRole("reader");
        localStorage.setItem("token", data.access);
      } else {
        alert(data.error || "注册失败");
      }
    } catch {
      alert("网络错误");
    }
    setRegLoading(false);
  };

  return (
    <div style={{ maxWidth: 350, margin: "auto", marginTop: 100 }}>
      {!showRegister ? (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="用户名"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="密码"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: "100%",
              padding: 8,
              background: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
            }}
          >
            {loginLoading ? "登录中..." : "登录"}
          </button>
          <button
            type="button"
            style={{
              marginTop: 16,
              width: "100%",
              background: "none",
              color: "#1677ff",
              border: "none",
            }}
            onClick={() => {
              setShowRegister(true);
              setLoginUsername("");
              setLoginPassword("");
            }}
          >
            没有账号？注册
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="用户名"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="密码"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            >
              <option value="reader">读者</option>
              <option value="author">作者</option>
              <option value="editor">编辑</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={regLoading}
            style={{
              width: "100%",
              padding: 8,
              background: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
            }}
          >
            {regLoading ? "注册中..." : "注册"}
          </button>
          <button
            type="button"
            style={{
              marginTop: 16,
              width: "100%",
              background: "none",
              color: "#1677ff",
              border: "none",
            }}
            onClick={() => {
              setShowRegister(false);
              setRegUsername("");
              setRegPassword("");
              setRegRole("reader");
            }}
          >
            已有账号？登录
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
