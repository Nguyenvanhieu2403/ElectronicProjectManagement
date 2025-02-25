using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ElectronicProjectManagement.Authentication.Models.Dto;
using ElectronicProjectManagement.Authentication.Services.IServices;
using ElectronicProjectManagement.Base.MethodResult;
using Microsoft.AspNetCore.Authentication.Google;

namespace ElectronicProjectManagement.Authentication.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly IAuthService _repos;

        public AuthAPIController(IAuthService repos)
        {
            _repos = repos;
        }

        [HttpPost("register")]
        public async Task<MethodResult> Register([FromBody] RegisterDto register)
        {
            var ErrorMessages = await _repos.Register(register);
            if (!string.IsNullOrEmpty(ErrorMessages))
            {
                return MethodResult.ResultWithError(ErrorMessages);
            }
            return MethodResult.ResultWithSuccess("Success", 200);
        }

        [HttpPost("login")]
        public async Task<MethodResult> Login([FromBody] LoginDto loginDto)
        {
            var login = await _repos.Login(loginDto);
            if (login.User == null)
            {
                return MethodResult.ResultWithError("Username or Password incorrect", "Invalid Authentication", 401);
            }
            return MethodResult.ResultWithSuccess(login, 200, "Success", 0);
        }

        [HttpPost("refresh-token")]
        public async Task<MethodResult> RefreshToken([FromBody] TokenDto model)
        {
            if (model is null)
            {
                return MethodResult.ResultWithError("Invalid client request", "Invalid client request", 400);
            }
            var login = await _repos.RefreshToken(model);
            if (login.User == null)
            {
                return MethodResult.ResultWithError("Invalid Refresh Token", "Invalid Refresh Token", 401);
            }
            return MethodResult.ResultWithSuccess(login, 200, "Success", 0);
        }

        [HttpPost("AssignRole")]
        public async Task<MethodResult> AssignRole([FromBody] RegisterDto register)
        {
            var result = await _repos.AssignRole(register.Email, register.Role.ToUpper());
            if (!result)
            {
                return MethodResult.ResultWithError("Role not assigned", "Role not assigned", 400);
            }
            return MethodResult.ResultWithSuccess("Role assigned", 200);
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleLogin()
        {
            var response = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (response.Principal == null) return BadRequest();

            var name = response.Principal.FindFirstValue(ClaimTypes.Name);
            var givenName = response.Principal.FindFirstValue(ClaimTypes.GivenName);
            var email = response.Principal.FindFirstValue(ClaimTypes.Email);

            return Ok();
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var props = new AuthenticationProperties { RedirectUri = "api/auth/signin-google" };
            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [HttpPost("send-otp")]
        public async Task<MethodResult> SendOTP(OtpRequest otpRequest)
        {
            _repos.SendOTPMail(otpRequest);
            return MethodResult.ResultWithSuccess("OTP sent", 200);
        }

        [HttpGet("google-auth-url")]
        public async Task<IActionResult> GetGoogleAuthUrl()
        {
            string authUrl = await _repos.GetGoogleAuthUrlAsync();
            return Ok(new { AuthUrl = authUrl });
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code)
        {
            var userInfo = await _repos.GetUserProfileAsync(code);
            return Ok(userInfo);
        }
    }
}
