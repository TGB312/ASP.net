import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/OrderDetailAdmin.css';

const OrderDetailAdmin = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [newOrderDetail, setNewOrderDetail] = useState({
    orderId: '',
    productId: '',
    quantity: '',
    unitPrice: '' // Sẽ được tự động gán từ product
  });
  const [editingOrderDetail, setEditingOrderDetail] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Lấy danh sách chi tiết đơn hàng
    api.get('/OrderDetail')
      .then((response) => setOrderDetails(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách chi tiết đơn hàng:', error));

    // Lấy danh sách sản phẩm để sử dụng chọn trong form
    api.get('/Product')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách sản phẩm:', error));
  }, []);

  // Khi thay đổi productId, tự động lấy đơn giá từ sản phẩm tương ứng
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    
    // Cập nhật lại productId và đơn giá của sản phẩm được chọn
    const selectedProduct = products.find((product) => product.id === parseInt(selectedProductId));
    if (selectedProduct) {
      setNewOrderDetail({
        ...newOrderDetail,
        productId: selectedProductId,
        unitPrice: selectedProduct.price,
      });
    }
  };
  
  
  

  const handleAddOrderDetail = () => {
    if (
      newOrderDetail.orderId &&
      newOrderDetail.productId &&
      newOrderDetail.quantity &&
      newOrderDetail.unitPrice
    ) {
      api.post('/OrderDetail', newOrderDetail)
        .then((response) => {
          setOrderDetails([...orderDetails, response.data]);
          setNewOrderDetail({ orderId: '', productId: '', quantity: '', unitPrice: '' });
          setShowAddForm(false);
        })
        .catch((error) => console.error('Lỗi khi thêm chi tiết đơn hàng:', error));
    } else {
      alert('Vui lòng nhập đầy đủ thông tin chi tiết đơn hàng!');
    }
  };
  

  const handleDeleteOrderDetail = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa chi tiết đơn hàng này?')) {
      api.delete(`/OrderDetail/${id}`)
        .then(() => setOrderDetails(orderDetails.filter((od) => od.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa chi tiết đơn hàng:', error));
    }
  };

  const handleEditOrderDetail = (orderDetail) => {
    setEditingOrderDetail(orderDetail);
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    api.put(`/OrderDetail/${editingOrderDetail.id}`, editingOrderDetail)
      .then(() => {
        setOrderDetails(orderDetails.map((od) =>
          od.id === editingOrderDetail.id ? editingOrderDetail : od
        ));
        setEditingOrderDetail(null);
        setShowEditForm(false);
      })
      .catch((error) => console.error('Lỗi khi cập nhật chi tiết đơn hàng:', error));
  };

  // Tính tổng đơn giá của các chi tiết đơn hàng
  const calculateTotal = () => {
    return orderDetails.reduce((total, od) => total + (od.quantity * od.unitPrice), 0);
  };

  return (
    <div className="order-detail-admin">
      <h2>Quản lý chi tiết đơn hàng</h2>

      {showAddForm ? (
        <div className="form-group">
          <input
            placeholder="ID Đơn hàng"
            value={newOrderDetail.orderId}
            onChange={(e) => setNewOrderDetail({ ...newOrderDetail, orderId: e.target.value })}
          />
          <select
  value={newOrderDetail.productId}
  onChange={handleProductChange}
>
  <option value="">Chọn sản phẩm</option>
  {products.map((product) => (
    <option key={product.id} value={product.id}>
      {product.name} - {product.price} VND
    </option>
  ))}
</select>

          <input
            placeholder="Số lượng"
            type="number"
            value={newOrderDetail.quantity}
            onChange={(e) => setNewOrderDetail({ ...newOrderDetail, quantity: e.target.value })}
          />
          <input
            placeholder="Đơn giá"
            type="number"
            value={newOrderDetail.unitPrice}
            readOnly
          />
          <button onClick={handleAddOrderDetail}>Lưu</button>
          <button onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)}>+ Thêm chi tiết đơn hàng</button>
      )}

      {showEditForm && editingOrderDetail && (
        <div className="form-group">
          <h3>Sửa chi tiết đơn hàng</h3>
          <input
            value={editingOrderDetail.orderId}
            onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, orderId: e.target.value })}
          />
          <select
            value={editingOrderDetail.productId}
            onChange={(e) => {
              const selectedProductId = e.target.value;
              setEditingOrderDetail({ ...editingOrderDetail, productId: selectedProductId });

              const selectedProduct = products.find((product) => product.id === parseInt(selectedProductId));
              if (selectedProduct) {
                setEditingOrderDetail({ ...editingOrderDetail, unitPrice: selectedProduct.price });
              }
            }}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price} VND
              </option>
            ))}
          </select>
          <input
            value={editingOrderDetail.quantity}
            type="number"
            onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, quantity: e.target.value })}
          />
          <input
            value={editingOrderDetail.unitPrice}
            type="number"
            readOnly
          />
          <button onClick={handleSaveEdit}>Cập nhật</button>
          <button onClick={() => setShowEditForm(false)}>Hủy</button>
        </div>
      )}

      <table className="order-detail-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Đơn hàng</th>
            <th>ID Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((od) => (
            <tr key={od.id}>
              <td>{od.id}</td>
              <td>{od.orderId}</td>
              <td>{od.productId}</td>
              <td>{od.quantity}</td>
              <td>{od.unitPrice}</td>
              <td>{(od.quantity * od.unitPrice).toFixed(2)}</td>
              <td>
                <button onClick={() => handleEditOrderDetail(od)}>Sửa</button>
                <button onClick={() => handleDeleteOrderDetail(od.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total">
        <h3>Tổng số tiền: {calculateTotal().toFixed(2)} VND</h3>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;
