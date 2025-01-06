import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 假設登入成功後，執行跳轉邏輯
    navigate('/', { state: { showAvatar: true } }); // 傳遞狀態 `showAvatar`
  };

  return (
    <div className="container">
      <header className="header">
        <a className="btn" href="#/">Washwindows Game</a>
      </header>
      
      <div className="form-container">
        <h2 className="title">登入</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="帳號"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="密碼"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="login-button">
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
