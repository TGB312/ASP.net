import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/Login.css'; // nếu dùng CSS riêng

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/User/login', { username, password });

      // Lưu thông tin người dùng vào localStorage nếu cần dùng
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Điều hướng đến trang admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Đăng nhập</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
