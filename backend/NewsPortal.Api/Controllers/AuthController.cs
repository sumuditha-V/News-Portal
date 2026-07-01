using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsPortal.Api.Data;
using NewsPortal.Api.Dtos;
using NewsPortal.Api.Models;
using NewsPortal.Api.Services;

namespace NewsPortal.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;
    private readonly IWebHostEnvironment _environment;

    public AuthController(AppDbContext db, JwtTokenService jwt, IWebHostEnvironment environment)
    {
        _db = db;
        _jwt = jwt;
        _environment = environment;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        // Check for duplicate username
        var usernameTaken = await _db.Users.AnyAsync(u => u.Username == request.Username, ct);
        if (usernameTaken)
            return Conflict(new { message = "Username is already taken." });

        // Check for duplicate email
        var emailTaken = await _db.Users.AnyAsync(u => u.Email == request.Email, ct);
        if (emailTaken)
            return Conflict(new { message = "An account with this email already exists." });

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var (token, expires) = _jwt.Generate(user);
        SetAuthCookie(token, expires);
        return Ok(new LoginResponse
        {
            Username = user.Username,
            FullName = user.FullName,
            ExpiresAt = expires,
        });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = await _db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == request.Username, ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password." });

        var (token, expires) = _jwt.Generate(user);
        SetAuthCookie(token, expires);
        return Ok(new LoginResponse
        {
            Username = user.Username,
            FullName = user.FullName,
            ExpiresAt = expires,
        });
    }

    // GET /api/auth/me
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var username = User.Identity?.Name ?? string.Empty;
        return Ok(new { username });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("np_auth", BuildCookieOptions());
        return NoContent();
    }

    private void SetAuthCookie(string token, DateTime expires)
    {
        var options = BuildCookieOptions();
        options.Expires = new DateTimeOffset(expires);
        Response.Cookies.Append("np_auth", token, options);
    }

    private CookieOptions BuildCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = !_environment.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Path = "/",
        };
    }
}
