using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TranGiaBao_2122110356.Data;
using TranGiaBao_2122110356.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TranGiaBao_2122110356.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Order (Lấy danh sách đơn hàng)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> Get()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/Order/5 (Lấy chi tiết đơn hàng theo ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> Get(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // POST: api/Order (Tạo đơn hàng mới)
        [HttpPost]
        public async Task<ActionResult<Order>> Post([FromBody] Order order)
        {
            if (order == null || order.OrderDetails == null || order.OrderDetails.Count == 0)
                return BadRequest("Đơn hàng không hợp lệ");

            order.OrderDate = DateTime.Now;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = order.Id }, order);
        }

        // PUT: api/Order/5 (Cập nhật đơn hàng)
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Order updatedOrder)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound($"Đơn hàng với ID {id} không tồn tại.");
            }

            // Cập nhật thông tin đơn hàng
            order.CustomerName = updatedOrder.CustomerName;
            order.OrderDate = updatedOrder.OrderDate;

            // Cập nhật OrderDetail
            foreach (var updatedDetail in updatedOrder.OrderDetails)
            {
                var existingDetail = order.OrderDetails
                    .FirstOrDefault(od => od.Id == updatedDetail.Id);

                if (existingDetail != null)
                {
                    // Nếu chi tiết đã tồn tại, cập nhật thông tin
                    existingDetail.Quantity = updatedDetail.Quantity;
                    existingDetail.UnitPrice = updatedDetail.UnitPrice;
                }
                else
                {
                    // Nếu chi tiết chưa tồn tại, thêm mới
                    order.OrderDetails.Add(new OrderDetail
                    {
                        ProductId = updatedDetail.ProductId,
                        Quantity = updatedDetail.Quantity,
                        UnitPrice = updatedDetail.UnitPrice
                    });
                }
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // DELETE: api/Order/5 (Xoá đơn hàng)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            // Xoá chi tiết đơn hàng trước, rồi xoá đơn hàng
            _context.OrderDetails.RemoveRange(order.OrderDetails);
            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
