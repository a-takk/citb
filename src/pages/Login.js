// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/authcontext";
import "../styles/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = (e) => {
    e.preventDefault();
    const validUsername = "amansinghtaak";
    const validPassword = "Taakaman24";

    if (username === validUsername && password === validPassword) {
      login();
      navigate(from, { replace: true });
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="formbackground">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
