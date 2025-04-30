import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("用户名和密码不能为空！");
      return;
    }

    // authentication
    if (username === "admin" && password === "123456") {
      setError("");
      localStorage.setItem("isAuthenticated", "true"); // save login status
      navigate("/home"); // direct to /home after login
    } else {
      setError("用户名或密码错误！");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>用户登录</h2>
        {error && <p className="error">{error}</p>}
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
        />
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="输入密码"
        />
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default LoginPage;
