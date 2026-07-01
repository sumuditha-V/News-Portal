using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using NewsPortal.Api.Data;
using NewsPortal.Api.Dtos;
using NewsPortal.Api.Models;

namespace NewsPortal.Api.Services;

public class NewsService
{
    private readonly HttpClient _http;
    private readonly AppDbContext _db;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private static readonly HashSet<string> ValidCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        "business", "entertainment", "general", "health", "science", "sports", "technology"
    };

    private static readonly HashSet<string> ValidCountries = new(StringComparer.OrdinalIgnoreCase)
    {
        "au", "ca", "cn", "eg", "fr", "de", "gr", "hk", "in", "ie",
        "il", "it", "jp", "nl", "no", "pk", "pe", "ph", "pt", "ro",
        "ru", "sa", "za", "kr", "se", "ch", "tw", "ua", "gb", "us"
    };

    public NewsService(HttpClient http, AppDbContext db)
    {
        _http = http;
        _db = db;
    }

    public async Task<NewsListResponse> GetTopHeadlinesAsync(string category, string country, CancellationToken ct)
    {
        category = ValidCategories.Contains(category) ? category.ToLowerInvariant() : "general";
        country = ValidCountries.Contains(country) ? country.ToLowerInvariant() : "us";

        using var response = await _http.GetAsync($"top-headlines/category/{category}/{country}.json", ct);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        var raw = await JsonSerializer.DeserializeAsync<RawNewsResponse>(stream, JsonOptions, ct)
                  ?? new RawNewsResponse();

        var incoming = (raw.Articles ?? [])
            .Where(a => !string.IsNullOrWhiteSpace(a.Title))
            .Select(a => new { Raw = a, Url = ValidHttpUrl(a.Url) })
            .Where(a => a.Url is not null)
            .Select(a => new { a.Raw, Url = a.Url!, UrlHash = HashUrl(a.Url!) })
            .ToList();

        var urlHashes = incoming.Select(a => a.UrlHash).Distinct().ToList();
        var stored = await _db.Articles
            .Where(a => urlHashes.Contains(a.UrlHash))
            .ToDictionaryAsync(a => a.UrlHash, ct);
        var articles = new List<Article>();

        foreach (var item in incoming)
        {
            if (!stored.TryGetValue(item.UrlHash, out var article))
            {
                article = new Article { Url = item.Url, UrlHash = item.UrlHash };
                _db.Articles.Add(article);
                stored.Add(item.UrlHash, article);
            }

            Update(article, item.Raw);
            if (!articles.Contains(article))
                articles.Add(article);
        }

        if (_db.ChangeTracker.HasChanges())
            await _db.SaveChangesAsync(ct);

        return new NewsListResponse
        {
            Status = raw.Status ?? "ok",
            TotalResults = articles.Count,
            Articles = articles.Select(Map).ToList(),
        };
    }

    public async Task<NewsArticleDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var article = await _db.Articles.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id, ct);
        return article is null ? null : Map(article);
    }

    private static void Update(Article article, RawArticle raw)
    {
        article.SourceId = raw.Source?.Id;
        article.SourceName = raw.Source?.Name;
        article.Author = raw.Author;
        article.Title = raw.Title!.Trim();
        article.Description = raw.Description;
        article.UrlToImage = ValidHttpUrl(raw.UrlToImage);
        article.PublishedAt = raw.PublishedAt;
        article.Content = raw.Content;
        article.UpdatedAt = DateTime.UtcNow;
    }

    private static NewsArticleDto Map(Article article)
    {
        return new NewsArticleDto
        {
            Id = article.Id.ToString(),
            Source = new NewsSourceDto { Id = article.SourceId, Name = article.SourceName },
            Author = article.Author,
            Title = article.Title,
            Description = article.Description,
            Url = article.Url,
            UrlToImage = article.UrlToImage,
            PublishedAt = article.PublishedAt,
            Content = article.Content,
        };
    }

    private static string? ValidHttpUrl(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || !Uri.TryCreate(value.Trim(), UriKind.Absolute, out var uri))
            return null;
        return uri.Scheme is "http" or "https" ? uri.AbsoluteUri : null;
    }

    private static string HashUrl(string url)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(url))).ToLowerInvariant();
    }

    private class RawNewsResponse
    {
        public string? Status { get; set; }
        public List<RawArticle>? Articles { get; set; }
    }

    private class RawArticle
    {
        public RawSource? Source { get; set; }
        public string? Author { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public string? UrlToImage { get; set; }
        public DateTime? PublishedAt { get; set; }
        public string? Content { get; set; }
    }

    private class RawSource
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
    }
}
