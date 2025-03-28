using System.Collections.Generic;

using TranGiaBao_2122110356.Model;
using Microsoft.EntityFrameworkCore;
namespace TranGiaBao_2122110356.Data
{
    public class AppDbContext
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
            public DbSet<Product> Products { get; set; }
        }
    }
}
