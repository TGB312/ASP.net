using System.ComponentModel.DataAnnotations;

namespace TranGiaBao_2122110356.Model
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Image { get; set; }

        public ICollection<Product>? Products { get; set; } = new List<Product>();


    }
}
