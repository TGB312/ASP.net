import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './admin/pages/Login';

import AdminLayout from './admin/components/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import UserAdmin from './admin/pages/UserAdmin';
import ProductAdmin from './admin/pages/ProductAdmin';
import CategoryAdmin from './admin/pages/CategoryAdmin';
import OrderAdmin from './admin/pages/OrderAdmin';
import OrderDetailAdmin from './admin/pages/OrderDetailAdmin';
function App() {
  return (
    <Router>
      <Routes>

        {/* Các route quản trị */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="productadmin" element={<ProductAdmin />} />
        <Route path="orderadmin" element={<OrderAdmin />} />
        <Route path="orderdetailadmin" element={<OrderDetailAdmin />} />


        {/* Các route quản trị */}

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
