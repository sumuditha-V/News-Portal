using System.Text.Json;
using System.Text.Json.Serialization;
using NewsPortal.Api.Dtos;

namespace NewsPortal.Api.Services;

public class NewsService
{
    private readonly HttpClient _http;
    private readonly ILogger<NewsService> _logger;

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

    public NewsService(HttpClient http, ILogger<NewsService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<NewsListResponse> GetTopHeadlinesAsync(string category, string country, CancellationToken ct)
    {
        category = ValidCategories.Contains(category) ? category.ToLowerInvariant() : "general";
        country = ValidCountries.Contains(country) ? country.ToLowerInvariant() : "us";

        var url = $"top-headlines/category/{category}/{country}.json";
        return await FetchAsync(url, ct);
    }

    private async Task<NewsListResponse> FetchAsync(string relativeUrl, CancellationToken ct)
    {
        using var response = await _http.GetAsync(relativeUrl, ct);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        var raw = await JsonSerializer.DeserializeAsync<RawNewsResponse>(stream, JsonOptions, ct)
                  ?? new RawNewsResponse();

        var articles = (raw.Articles ?? new List<RawArticle>())
            .Where(a => !string.IsNullOrWhiteSpace(a.Title))
            .Select(MapArticle)
            .ToList();

        return new NewsListResponse
        {
            Status = raw.Status ?? "ok",
            TotalResults = raw.TotalResults ?? articles.Count,
            Articles = articles,
        };
    }

    private static NewsArticleDto MapArticle(RawArticle a)
    {
        var idSeed = (a.Url ?? string.Empty) + "|" + (a.PublishedAt?.ToString("O") ?? "") + "|" + (a.Title ?? "");
        var id = Convert.ToHexString(
            System.Security.Cryptography.SHA1.HashData(System.Text.Encoding.UTF8.GetBytes(idSeed))).ToLowerInvariant();

        return new NewsArticleDto
        {
            Id = id,
            Source = new NewsSourceDto { Id = a.Source?.Id, Name = a.Source?.Name },
            Author = a.Author,
            Title = a.Title,
            Description = a.Description,
            Url = a.Url,
            UrlToImage = a.UrlToImage,
            PublishedAt = a.PublishedAt,
            Content = a.Content,
        };
    }

    private class RawNewsResponse
    {
        public string? Status { get; set; }
        public int? TotalResults { get; set; }
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
