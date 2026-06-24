namespace NewsPortal.Api.Dtos;

public class NewsSourceDto
{
    public string? Id { get; set; }
    public string? Name { get; set; }
}

public class NewsArticleDto
{
    public string Id { get; set; } = string.Empty;
    public NewsSourceDto Source { get; set; } = new();
    public string? Author { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Url { get; set; }
    public string? UrlToImage { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? Content { get; set; }
}

public class NewsListResponse
{
    public string Status { get; set; } = "ok";
    public int TotalResults { get; set; }
    public List<NewsArticleDto> Articles { get; set; } = new();
}
