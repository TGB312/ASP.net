import React, { useState, useEffect } from 'react';
import api from '../services/api';  // Đảm bảo api đã được cấu hình đúng
import '../css/ProductAdmin.css';  // Đảm bảo bạn đã tạo và áp dụng CSS đúng

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    categoryId: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch danh mục và sản phẩm khi component mount
  useEffect(() => {
    // Fetch categories
    api.get('/Category')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh mục:', error));

    // Fetch products
    api.get('/Product')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách sản phẩm:', error));
  }, []);

  const handleAddProduct = () => {
    const { name, price, image, description, categoryId } = newProduct;

    if (name && price && image && description && categoryId) {
      const newProductData = {
        name,
        price,
        image,
        description,
        categoryId: parseInt(categoryId)  // Chuyển categoryId thành số nếu cần
      };

      api.post('/Product', newProductData)
        .then((response) => {
          setProducts([...products, response.data]);  // Cập nhật danh sách sản phẩm
          setNewProduct({ name: '', price: '', image: '', description: '', categoryId: '' });
          setShowAddForm(false);  // Đóng form thêm sản phẩm
        })
        .catch((error) => {
          console.error('Lỗi khi thêm sản phẩm:', error);
          alert('Lỗi khi thêm sản phẩm, vui lòng thử lại!');
        });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
    }
  };

  const handleEditProduct = () => {
    const { name, price, image, description, categoryId } = editProduct;
    
    if (name && price && image && description && categoryId) {
      const updatedProductData = {
        name,
        price,
        image,
        description,
        categoryId: parseInt(categoryId),
      };
  
      api.put(`/Product/${editProduct.id}`, updatedProductData)
        .then((response) => {
          const updatedProducts = products.map((product) =>
            product.id === editProduct.id ? response.data : product
          );
          setProducts(updatedProducts);  // Update product list with the edited product
          setEditProduct(null);  // Close the edit form
        })
        .catch((error) => {
          console.error('Lỗi khi chỉnh sửa sản phẩm:', error);
          alert('Lỗi khi chỉnh sửa sản phẩm, vui lòng thử lại!');
        });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
    }
  };
  

  const handleDeleteProduct = (id) => {
    api.delete(`/Product/${id}`)
      .then(() => {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);  // Update product list after deletion
      })
      .catch((error) => {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Lỗi khi xóa sản phẩm, vui lòng thử lại!');
      });
  };
  
  return (
    <div className="product-admin">
      <h2>Quản lý sản phẩm</h2>

      {/* Form thêm sản phẩm */}
      {showAddForm && !editProduct && (
        <div className="modal">
          <h2>Thêm sản phẩm</h2>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Giá sản phẩm"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="Mô tả sản phẩm"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="textarea"
          />
          <select
            value={newProduct.categoryId}
            onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
            className="input"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="save-button" onClick={handleAddProduct}>Lưu</button>
          <button className="cancel-button" onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      )}

      {/* Form chỉnh sửa sản phẩm */}
      {editProduct && (
        <div className="modal">
          <h2>Chỉnh sửa sản phẩm</h2>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Giá sản phẩm"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={editProduct.image}
            onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="Mô tả sản phẩm"
            value={editProduct.description}
            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
            className="textarea"
          />
          <select
            value={editProduct.categoryId}
            onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
            className="input"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="save-button" onClick={handleEditProduct}>Lưu</button>
          <button className="cancel-button" onClick={() => setEditProduct(null)}>Hủy</button>
        </div>
      )}

      {/* Button để hiển thị form thêm sản phẩm */}
      {!showAddForm && !editProduct && (
        <button className="add-product-button" onClick={() => setShowAddForm(true)}>
          + Thêm sản phẩm
        </button>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Mô tả</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td><img src={product.image} alt={product.name} width="60" /></td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.category ? product.category.name : 'Chưa có danh mục'}</td>
              <td>
                <button className="edit-button" onClick={() => setEditProduct(product)}>Sửa</button>
                <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAdmin;
