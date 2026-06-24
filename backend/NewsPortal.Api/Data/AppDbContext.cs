using Microsoft.EntityFrameworkCore;
using NewsPortal.Api.Models;

namespace NewsPortal.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            e.Property(u => u.FullName).HasDefaultValue(string.Empty);
            e.Property(u => u.Email).HasDefaultValue(string.Empty);
        });
    }
}
