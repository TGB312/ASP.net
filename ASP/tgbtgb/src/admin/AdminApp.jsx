// src/admin/AdminApp.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function AdminApp() {
  return (
    <Router>
      <Routes>
        <Route path="/User/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
