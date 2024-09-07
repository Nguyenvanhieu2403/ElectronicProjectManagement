using ElectronicProjectManagement.Authentication.Models.Dto;
using Google.Apis.Oauth2.v2.Data;

namespace ElectronicProjectManagement.Authentication.Services.IServices
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDto model);
        Task<LoginReponseDto> Login(LoginDto model);
        Task<bool> AssignRole(string Email, string RoleName);
        void SendOTPMail(OtpRequest otpRequest);

        Task<string> GetGoogleAuthUrlAsync();
        Task<Userinfo> GetUserProfileAsync(string authorizationCode);
    }
}
