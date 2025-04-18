using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TranGiaBao_2122110356.Data;
using TranGiaBao_2122110356.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TranGiaBao_2122110356.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderDetailController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetail (Lấy tất cả chi tiết đơn hàng)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetails()
        {
            var orderDetails = await _context.OrderDetails
                .Include(od => od.Product)  // Load thông tin Product cho từng OrderDetail
                .Include(od => od.Order)    // Load thông tin Order cho từng OrderDetail
                .ToListAsync();

            return Ok(orderDetails);
        }

        // GET: api/OrderDetail/5 (Lấy chi tiết đơn hàng theo ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails
                .Include(od => od.Product)  // Load thông tin Product cho chi tiết đơn hàng
                .Include(od => od.Order)    // Load thông tin Order cho chi tiết đơn hàng
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            return Ok(orderDetail);
        }

        // POST: api/OrderDetail (Tạo chi tiết đơn hàng mới)
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> PostOrderDetail([FromBody] OrderDetail orderDetail)
        {
            // Kiểm tra nếu OrderId có tồn tại trong bảng Order
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderDetail.OrderId);
            if (order == null)
            {
                return BadRequest("Đơn hàng với ID này không tồn tại.");
            }

            // Kiểm tra nếu ProductId có tồn tại trong bảng Product
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == orderDetail.ProductId);
            if (product == null)
            {
                return BadRequest("Sản phẩm với ID này không tồn tại.");
            }

            // Thêm OrderDetail vào cơ sở dữ liệu
            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.Id }, orderDetail);
        }


        // PUT: api/OrderDetail/5 (Cập nhật chi tiết đơn hàng)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetail(int id, [FromBody] OrderDetail updatedOrderDetail)
        {
            var orderDetail = await _context.OrderDetails
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            // Kiểm tra nếu ProductId có tồn tại trong bảng Product
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == updatedOrderDetail.ProductId);
            if (product == null)
            {
                return BadRequest("Sản phẩm với ID này không tồn tại.");
            }

            // Cập nhật thông tin chi tiết đơn hàng
            orderDetail.Quantity = updatedOrderDetail.Quantity;
            orderDetail.UnitPrice = updatedOrderDetail.UnitPrice;
            orderDetail.ProductId = updatedOrderDetail.ProductId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Lỗi khi lưu dữ liệu: {ex.Message}");
            }

            return NoContent(); // Thành công mà không cần trả về dữ liệu
        }

        // DELETE: api/OrderDetail/5 (Xóa chi tiết đơn hàng)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return NoContent(); // Thành công mà không cần trả về dữ liệu
        }
    }
}
