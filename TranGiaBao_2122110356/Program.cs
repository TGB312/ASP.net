using Microsoft.EntityFrameworkCore;
using TranGiaBao_2122110356.Data; // Import namespace chứa AppDbContext

var builder = WebApplication.CreateBuilder(args);

// Thêm DbContext với chuỗi kết nối
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
