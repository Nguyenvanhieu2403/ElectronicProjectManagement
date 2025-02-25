using Microsoft.AspNetCore.Http;

namespace ElectronicProjectManagement.Api.Startups
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            BeginInvoke(context);
            await _next.Invoke(context);
        }

        private async void BeginInvoke(HttpContext context)
        {
            if (context.Request.Method != "OPTIONS")
            {
                context.Response.StatusCode = 200;
                // await context.Response.WriteAsync("Not Authenticated");
            }
        }
    }
}
