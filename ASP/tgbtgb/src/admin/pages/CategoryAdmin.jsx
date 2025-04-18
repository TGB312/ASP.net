import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Cấu hình API axios của bạn
import '../css/CategoryAdmin.css';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Lấy danh sách danh mục
  useEffect(() => {
    api.get('/Category')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh mục:', error));
  }, []);

  // Xử lý thêm danh mục
  const handleAddCategory = () => {
    if (newCategory.name && newCategory.image) {
      api.post('/Category', newCategory)
        .then((response) => {
          setCategories([...categories, response.data]);
          setNewCategory({ name: '', image: '' });
          setShowAddForm(false);
        })
        .catch((error) => {
          console.error('Lỗi khi thêm danh mục:', error);
          alert('Lỗi khi thêm danh mục, vui lòng thử lại.');
        });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin danh mục!');
    }
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này không?')) {
      api.delete(`/Category/${id}`)
        .then(() => {
          setCategories(categories.filter(category => category.id !== id));
        })
        .catch((error) => {
          console.error('Lỗi khi xóa danh mục:', error);
          alert('Lỗi khi xóa danh mục, vui lòng thử lại.');
        });
    }
  };

  // Xử lý sửa danh mục
  const handleEditCategory = (category) => {
    setEditCategory(category);
  };

  // Xử lý lưu thay đổi khi sửa danh mục
  const handleSaveEdit = () => {
    if (editCategory.name && editCategory.image) {
      api.put(`/Category/${editCategory.id}`, editCategory)
        .then(() => {
          setCategories(categories.map(category => 
            category.id === editCategory.id ? editCategory : category
          ));
          setEditCategory(null);
        })
        .catch((error) => {
          console.error('Lỗi khi cập nhật danh mục:', error);
          alert('Lỗi khi cập nhật danh mục, vui lòng thử lại.');
        });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  return (
    <div className="category-admin-container">
      <h1 className="category-title">Quản lý danh mục</h1>

      {/* Form thêm danh mục mới */}
      {showAddForm && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Tên danh mục"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL Ảnh"
            value={newCategory.image}
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
            required
          />
          <button onClick={handleAddCategory}>Thêm danh mục</button>
          <button onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      )}

      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)}>+ Thêm danh mục mới</button>
      )}

      {/* Hiển thị form sửa danh mục nếu có */}
      {editCategory && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Tên danh mục"
            value={editCategory.name}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL Ảnh"
            value={editCategory.image}
            onChange={(e) => setEditCategory({ ...editCategory, image: e.target.value })}
            required
          />
          <button onClick={handleSaveEdit}>Lưu thay đổi</button>
          <button onClick={() => setEditCategory(null)}>Hủy</button>
        </div>
      )}

      {/* Hiển thị danh sách danh mục */}
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td><img src={category.image} alt={category.name} width="60" /></td>
              <td>
                <button className="edit-btn" onClick={() => handleEditCategory(category)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryAdmin;
