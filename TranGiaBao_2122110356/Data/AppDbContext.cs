using Microsoft.EntityFrameworkCore;
using TranGiaBao_2122110356.Model; // Import các model của bạn

namespace TranGiaBao_2122110356.Data // Đảm bảo namespace khớp với project
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } // Đảm bảo có ít nhất một DbSet
    }
}
