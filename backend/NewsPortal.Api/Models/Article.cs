using System.ComponentModel.DataAnnotations;

namespace NewsPortal.Api.Models;

public class Article
{
    public Guid Id { get; set; }

    [Required]
    public string Url { get; set; } = string.Empty;

    [Required, MaxLength(64)]
    public string UrlHash { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? SourceId { get; set; }

    [MaxLength(300)]
    public string? SourceName { get; set; }

    [MaxLength(500)]
    public string? Author { get; set; }

    [Required, MaxLength(1000)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? UrlToImage { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
