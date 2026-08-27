using Microsoft.EntityFrameworkCore;
using my_app_api.Models;

namespace my_app_api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // DbSet = ตาราง LoanProfiles ใน database
    public DbSet<LoanProfile> LoanProfiles { get; set; }
}
