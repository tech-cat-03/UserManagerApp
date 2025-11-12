using Microsoft.Extensions.Primitives;
using System.Net;

namespace UserManagerApp.Server.Middleware
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _config;
        private readonly ILogger<ApiKeyMiddleware> _logger;

        public ApiKeyMiddleware(RequestDelegate next, IConfiguration config, ILogger<ApiKeyMiddleware> logger)
        {
            _next = next;
            _config = config;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Require API key for all requests (also in Swagger)
            if (!context.Request.Headers.TryGetValue("X-API-KEY", out StringValues extractedApiKey))
            {
                _logger.LogWarning("Missing API key for request to {Path}", context.Request.Path);
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("API Key missing");
                return;
            }

            // Load valid API keys from appsettings.json
            var apiKeys = _config.GetSection("ApiKeys").GetChildren()
                .ToDictionary(x => x.Key, x => x.Value);

            // Convert to string for safe comparison
            var providedKey = extractedApiKey.ToString();

            // Invalid key check
            if (!apiKeys.Values.Any(k => k == providedKey))
            {
                _logger.LogWarning("Invalid API key attempt on {Path}", context.Request.Path);
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Invalid API Key");
                return;
            }

            // Valid key — get client name for logs or tracking
            var clientName = apiKeys.FirstOrDefault(x => x.Value == providedKey).Key;
            context.Items["ClientName"] = clientName;

            _logger.LogInformation("Authorized request from {Client} to {Path}", clientName, context.Request.Path);

            await _next(context);
        }
    }

    // Extension method
    public static class ApiKeyMiddlewareExtensions
    {
        public static IApplicationBuilder UseApiKeyMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ApiKeyMiddleware>();
        }
    }
}
