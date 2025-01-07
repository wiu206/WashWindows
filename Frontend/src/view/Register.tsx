import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Register.css';
import { asyncPost } from '../utils/fetch';
import { auth_api } from '../enum/api';

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

  // 驗證表單輸入
  const validInput = (): boolean => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('請填寫所有欄位');
      return false;
    }
    if (formData.username.length < 6 || formData.username.length > 12) {
      setError('帳號必須介於 6 到 12 個字元');
      return false;
    }
    if (formData.password.length < 8) {
      setError('密碼必須大於 8 位字元');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不相符');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 驗證輸入
    if (!validInput()) return;

    setIsLoading(true);

    try {
      const response = await asyncPost(auth_api.register, {
        body: {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          userRole: 'user'
        }
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        setError(errorData.message || '註冊失敗');
        return;
      }

      const data = await response.json();
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
    <div className="register-container">
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
