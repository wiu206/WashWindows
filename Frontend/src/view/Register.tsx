import React, { useState } from 'react';
import '../style/Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <header className="header">
        <a className='btn' href='#/'>Washwindows Game</a>
      </header>
      
      <div className="form-container">
        <h2 className="title">註冊</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="電子郵件"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="確認密碼"
            className="input-field"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit" className="register-button">
            註冊
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;