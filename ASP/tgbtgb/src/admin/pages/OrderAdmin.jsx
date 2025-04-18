import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../css/OrderAdmin.css';

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    orderDate: '',
    orderDetails: [],
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/Order')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách đơn hàng:', error));
  }, []);

  const handleAddOrder = () => {
    const { customerName, orderDate, orderDetails } = newOrder;
  
    // Kiểm tra xem tất cả thông tin đã được nhập chưa
    if (customerName && orderDate && orderDetails.length > 0) {
      // Nếu orderDetails là một chuỗi, hãy chuyển thành mảng
      if (typeof orderDetails === 'string') {
        const detailsArray = orderDetails.split(';').map(detail => ({
          productId: 0,  // ID sản phẩm mặc định, cần cập nhật theo yêu cầu thực tế
          quantity: 1,   // Số lượng mặc định, cần cập nhật theo yêu cầu thực tế
          unitPrice: 0,  // Đơn giá mặc định, cần cập nhật theo yêu cầu thực tế
        }));
        setNewOrder({ ...newOrder, orderDetails: detailsArray });
      }
  
      // Gửi yêu cầu thêm đơn hàng mới
      api.post('/Order', newOrder)
        .then((response) => {
          setOrders([...orders, response.data]);
          setNewOrder({ customerName: '', orderDate: '', orderDetails: [] });
          setShowAddForm(false);
        })
        .catch((error) => {
          console.error('Lỗi khi thêm đơn hàng:', error);
        });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin đơn hàng!');
    }
  };
  

  const handleDeleteOrder = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      api.delete(`/Order/${id}`)
        .then(() => setOrders(orders.filter((o) => o.id !== id)))
        .catch((error) => console.error('Lỗi khi xóa đơn hàng:', error));
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    api.put(`/Order/${editingOrder.id}`, editingOrder)
      .then(() => {
        api.get('/Order')
          .then((response) => {
            setOrders(response.data);
            setEditingOrder(null);
            setShowEditForm(false);
          })
          .catch((error) => console.error('Lỗi khi tải lại đơn hàng:', error));
      })
      .catch((error) => console.error('Lỗi khi cập nhật đơn hàng:', error));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="order-admin">
      <h2>Quản lý đơn hàng</h2>

      {showAddForm ? (
        <div className="form-group">
          <input
            placeholder="Tên khách hàng"
            value={newOrder.customerName}
            onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
          />
          <input
            placeholder="Ngày đặt"
            type="date"
            value={newOrder.orderDate}
            onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
          />
          <textarea
            placeholder="Chi tiết đơn hàng"
            value={newOrder.orderDetails}
            onChange={(e) => setNewOrder({ ...newOrder, orderDetails: e.target.value })}
          />
          <button onClick={handleAddOrder}>Lưu</button>
          <button onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)}>+ Thêm đơn hàng</button>
      )}

      {showEditForm && editingOrder && (
        <div className="form-group">
          <h3>Sửa đơn hàng</h3>
          <input
            value={editingOrder.customerName}
            onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
          />
          <input
            value={editingOrder.orderDate}
            type="date"
            onChange={(e) => setEditingOrder({ ...editingOrder, orderDate: e.target.value })}
          />
          <textarea
            value={editingOrder.orderDetails}
            onChange={(e) => setEditingOrder({ ...editingOrder, orderDetails: e.target.value })}
          />
          <button onClick={handleSaveEdit}>Cập nhật</button>
          <button onClick={() => setShowEditForm(false)}>Hủy</button>
        </div>
      )}

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Chi tiết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.orderDate}</td>
              <td>{o.orderDetails.length}</td>
              <td>
                <button onClick={() => handleEditOrder(o)}>Sửa</button>
                <button onClick={() => handleDeleteOrder(o.id)}>Xóa</button>
                <button onClick={() => handleViewDetails(o)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for showing order details */}
{showDetailModal && selectedOrder && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Chi tiết đơn hàng</h3>
      <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
      <p><strong>Ngày đặt:</strong> {selectedOrder.orderDate}</p>
      <ul>
        {selectedOrder.orderDetails.map((detail, index) => (
          <li key={index}>
            <p><strong>Sản phẩm:</strong> {detail.productId}</p>
            <p><strong>Số lượng:</strong> {detail.quantity}</p>
            <p><strong>Đơn giá:</strong> {detail.unitPrice}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleCloseModal}>Đóng</button>
    </div>
  </div>
)}

    </div>
  );
};

export default OrderAdmin;
