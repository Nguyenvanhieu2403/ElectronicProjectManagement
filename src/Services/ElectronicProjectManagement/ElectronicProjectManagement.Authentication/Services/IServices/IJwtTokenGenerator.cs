using ElectronicProjectManagement.Authentication.Models;

namespace ElectronicProjectManagement.Authentication.Services.IServices
{
    public interface IJwtTokenGenerator
    {
        string GeneratorToken(ApplicationUser user);
    }
}
