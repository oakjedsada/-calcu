using Microsoft.EntityFrameworkCore;
using my_app_api.Data;

var builder = WebApplication.CreateBuilder(args);

// เพิ่ม Controllers (รองรับ API endpoints)
builder.Services.AddControllers();

// เชื่อมต่อ SQLite database ไฟล์ชื่อ loan.db
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=loan.db"));

// อนุญาตให้ Angular (port 4200) เรียก API ได้
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// สร้าง database อัตโนมัติตอน start
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
