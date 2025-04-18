import React, { useEffect, useState } from 'react';
import '../css/UserAdmin.css';
import api from '../services/api'; // Đường dẫn api phù hợp với project của bạn

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/User')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Lỗi khi lấy người dùng:', err));
  };

  const handleAdd = () => {
    if (!newUser.username || !newUser.password || !newUser.email) {
      return alert('Vui lòng điền đầy đủ thông tin!');
    }
    api.post('/User', newUser)
      .then((res) => {
        setUsers([...users, res.data]);
        setNewUser({ username: '', password: '', email: '' });
      })
      .catch((err) => console.error('Lỗi khi thêm người dùng:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      api.delete(`/User/${id}`)
        .then(() => setUsers(users.filter(u => u.id !== id)))
        .catch((err) => console.error('Lỗi khi xóa:', err));
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdate = () => {
    api.put(`/User/${editingUser.id}`, editingUser)
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch((err) => console.error('Lỗi khi cập nhật:', err));
  };

  return (
    <div className="user-admin">
      <h1>Quản lý người dùng</h1>

      {/* Form thêm mới */}
      <div className="form-group">
        <h3>Thêm người dùng</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleAdd}>Thêm</button>
      </div>

      {/* Form chỉnh sửa */}
      {editingUser && (
        <div className="form-group">
          <h3>Chỉnh sửa người dùng</h3>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
          />
          <input
            type="password"
            value={editingUser.password}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <button onClick={handleUpdate}>Lưu</button>
          <button onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
      )}

      {/* Danh sách người dùng */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(u)}>Sửa</button>
                <button className="delete" onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdmin;
