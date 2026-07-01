using Microsoft.EntityFrameworkCore;
using NewsPortal.Api.Models;

namespace NewsPortal.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Article> Articles => Set<Article>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            e.Property(u => u.FullName).HasDefaultValue(string.Empty);
            e.Property(u => u.Email).HasDefaultValue(string.Empty);
        });

        modelBuilder.Entity<Article>(e =>
        {
            e.HasIndex(a => a.UrlHash).IsUnique();
            e.Property(a => a.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(a => a.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            e.Property(a => a.UpdatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        });
    }
}
