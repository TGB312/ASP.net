using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TranGiaBao_2122110356.Data;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using TranGiaBao_2122110356.Data;
using TranGiaBao_2122110356.Model;

namespace TranGiaBao_2122110356.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        // Constructor injection for both AppDbContext and IWebHostEnvironment
        public ProductController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Product (Lấy danh sách sản phẩm)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> Get()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Product/5 (Lấy sản phẩm theo ID)
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // POST: api/Product (Thêm sản phẩm mới)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest();
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        // PUT: api/Product/5 (Cập nhật sản phẩm)
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Product product)
        {
            if (id != product.Id)
            {
                return BadRequest("ID không khớp");
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Product/5 (Xóa sản phẩm)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "image/jpeg"); // Thay "image/jpeg" bằng loại MIME thích hợp nếu cần
        }
        // GET: api/Product/category/3 (Lấy sản phẩm theo categoryId = 3)
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetByCategory(int categoryId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();

            if (products == null || products.Count == 0)
            {
                return NotFound("Không có sản phẩm nào trong danh mục này.");
            }

            return Ok(products);    
        }




        // POST: api/Product/upload (Upload hình ảnh sản phẩm)
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] int productId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                var product = await _context.Products.FindAsync(productId);
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                // Ensure the upload folder exists
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                product.Image = uniqueFileName;
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { image = uniqueFileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }

}