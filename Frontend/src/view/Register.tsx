import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    // 表單驗證
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("請填寫所有欄位");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不相符');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // 假設這裡有一個 API 呼叫
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('註冊失敗');
      }
  
      const data = await response.json();
      // 假設註冊成功後處理
      console.log('註冊成功:', data);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('發生未知錯誤');
      }
    } finally {
      setIsLoading(false);
    }
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? '註冊中...' : '註冊'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
