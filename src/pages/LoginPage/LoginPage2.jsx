import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage2() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username or passwordd cannot be empty!");
      return;
    }

    // authentication
    try {
      const response = await axios.post(`${API_URL}login`, {
        username,
        password,
      });
      // Store the token or handle response
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", true);
      navigate("/trace");
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage2;
