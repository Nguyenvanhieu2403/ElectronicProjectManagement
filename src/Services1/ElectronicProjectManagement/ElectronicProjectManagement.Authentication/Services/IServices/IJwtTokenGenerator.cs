using ElectronicProjectManagement.Authentication.Models;
using System.Security.Claims;

namespace ElectronicProjectManagement.Authentication.Services.IServices
{
    public interface IJwtTokenGenerator
    {
        string GeneratorToken(ApplicationUser user);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
    }
}
