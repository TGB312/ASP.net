using System.Text.Json.Serialization;

namespace TranGiaBao_2122110356.Model
{
    public class OrderDetail
    {
        public int Id { get; set; }

        public int OrderId { get; set; }             // FK
        public int ProductId { get; set; }           // FK nếu có bảng Product
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }



        // Navigation property
        [JsonIgnore]
        public Order? Order { get; set; }         // ✅ nullable để tránh lỗi validation

        public Product? Product { get; set; }
    }
}
