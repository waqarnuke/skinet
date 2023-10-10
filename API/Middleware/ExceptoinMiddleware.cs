
using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware
{
    public class ExceptoinMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptoinMiddleware> _logger;
        private readonly IHostEnvironment _evn;

        public ExceptoinMiddleware(RequestDelegate next, ILogger<ExceptoinMiddleware> logger, 
            IHostEnvironment evn)
        {
            _next =  next;
            _logger = logger;
            _evn = evn;
        }

        public async  Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType="applicattion/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _evn.IsDevelopment()
                    ? new APiExceptoin((int)HttpStatusCode.InternalServerError, ex.Message,ex.StackTrace.ToString())
                    : new APiExceptoin((int)HttpStatusCode.InternalServerError);

                var options = new JsonSerializerOptions{
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };    

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}