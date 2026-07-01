using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewsPortal.Api.Dtos;
using NewsPortal.Api.Services;

namespace NewsPortal.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly NewsService _news;

    public NewsController(NewsService news)
    {
        _news = news;
    }

    [HttpGet]
    public async Task<ActionResult<NewsListResponse>> List(
        [FromQuery] string category = "general",
        [FromQuery] string country = "us",
        CancellationToken ct = default)
    {
        try
        {
            var result = await _news.GetTopHeadlinesAsync(category, country, ct);
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new { message = "Upstream news provider unavailable", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewsArticleDto>> Detail(
        Guid id,
        CancellationToken ct = default)
    {
        var article = await _news.GetByIdAsync(id, ct);
        if (article is null)
            return NotFound(new { message = "Article not found" });
        return Ok(article);
    }
}
