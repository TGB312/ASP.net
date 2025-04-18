// src/admin/components/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/AdminLayout.css'; // CSS bên dưới

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Quản trị</h2>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">Người dùng</Link></li>
            <li><Link to="/admin/categories">Danh mục</Link></li>
            <li><Link to="/admin/productadmin">Sản phẩm</Link></li>
            <li><Link to="/admin/orderadmin">Quản lý đơn hàng</Link></li>
            <li><Link to="/admin/orderdetailadmin">Quản lý </Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
