namespace TranGiaBao_2122110356.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }

        public string Description { get; set; }
        // Foreign Key to Category
        public int CategoryId { get; set; }

        // Navigation Property to Category
        public Category Category { get; set; }
    }

}
