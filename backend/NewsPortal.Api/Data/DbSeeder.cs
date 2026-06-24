using NewsPortal.Api.Models;

namespace NewsPortal.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Users.Any()) return;

        db.Users.AddRange(
            new User
            {
                FullName = "Administrator",
                Email = "admin@newshub.com",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            },
            new User
            {
                FullName = "Demo User",
                Email = "demo@newshub.com",
                Username = "demo",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo@123"),
            });

        db.SaveChanges();
    }
}
