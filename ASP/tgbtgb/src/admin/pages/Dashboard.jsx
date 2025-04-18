import React from 'react';
import '../css/Dashboard.css'; // Liên kết file CSS

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Trang tổng quan</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2 className="card-title">Tổng sản phẩm</h2>
          <p className="card-number">120</p>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Tổng danh mục</h2>
          <p className="card-number">15</p>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Tổng người dùng</h2>
          <p className="card-number">75</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <h2 className="stats-title">Thống kê nhanh</h2>
        <ul className="stats-list">
          <li>10 sản phẩm sắp hết hàng</li>
          <li>5 người dùng mới trong tuần</li>
          <li>2 đơn hàng đang xử lý</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
