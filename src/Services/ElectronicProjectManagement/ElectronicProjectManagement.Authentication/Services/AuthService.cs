using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Identity;
using System.Configuration;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Oauth2.v2;
using Google.Apis.Services;
using Google.Apis.Auth.OAuth2.Responses;
using ElectronicProjectManagement.Authentication.Models.Dto;
using ElectronicProjectManagement.Authentication.Services.IServices;
using ElectronicProjectManagement.Authentication.Data;
using ElectronicProjectManagement.Authentication.Models;
using MimeKit;
using MailKit.Net.Smtp;

namespace ElectronicProjectManagement.Authentication.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;
        private string redirectUri = "http://localhost:3000/oauth2callback";
        public AuthService(AppDbContext db, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        public async Task<bool> AssignRole(string Email, string RoleName)
        {
            var user = _db.ApplicationUsers.FirstOrDefault(u => u.Email.ToLower() == Email.ToLower());
            if (user != null)
            {
                if (!_roleManager.RoleExistsAsync(RoleName).GetAwaiter().GetResult())
                {
                    _roleManager.CreateAsync(new IdentityRole(RoleName)).GetAwaiter().GetResult();
                }
                await _userManager.AddToRoleAsync(user, RoleName);
                return true;
            }
            return false;
        }

        public async Task<LoginReponseDto> Login(LoginDto model)
        {
            var user = _db.ApplicationUsers.FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
            bool IsValid = await _userManager.CheckPasswordAsync(user, model.Password);

            if (user == null || IsValid == false)
            {
                return new LoginReponseDto
                {
                    User = null,
                    Token = "Invalid Authentication"
                };
            }
            var token = _jwtTokenGenerator.GeneratorToken(user);
            UserDto userDto = new()
            {
                ID = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
            };
            LoginReponseDto loginReponseDto = new()
            {
                User = userDto,
                Token = token
            };
            return loginReponseDto;
        }

        public async Task<string> Register(RegisterDto model)
        {
            ApplicationUser user = new()
            {
                UserName = model.UserName,
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
            };

            try
            {
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    var UserToReturn = _db.ApplicationUsers.First(u => u.UserName == user.UserName);
                    UserDto userDto = new()
                    {
                        ID = UserToReturn.Id,
                        FullName = UserToReturn.FullName,
                        Email = UserToReturn.Email,
                        PhoneNumber = UserToReturn.PhoneNumber,
                        Address = UserToReturn.Address,
                    };
                    return "";
                }
                else
                {
                    return result.Errors.FirstOrDefault().Description;
                }
            }
            catch (Exception ex)
            {

            }
            return "Error Encountered while registering user. Please try again.";
        }

        public void SendOTPMail(OtpRequest otpRequest)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Rica Travel", "ricatraveleaut@gmail.com"));
            message.To.Add(new MailboxAddress(otpRequest.Email, otpRequest.Email));
            message.Subject = "Register Rica Travel OTP";
            var builder = new BodyBuilder
            {
                HtmlBody = @"<html><body>Hello! <p>This is your OTP: <h1>" + otpRequest.OTP.ToString() + "</h1> </p</body></html> "
            };
            message.Body = builder.ToMessageBody();
            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate("ricatraveleaut@gmail.com", "zkld ncse ujfh lqby");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        public async Task<string> GetGoogleAuthUrlAsync()
        {
            // Xây dựng authorization code request
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _configuration.GetValue<string>("Google:ClientId"),
                    ClientSecret = _configuration.GetValue<string>("Google:ClientSecret")
                },
                Scopes = new[] { "email", "profile" }, // Phạm vi quyền truy cập
                DataStore = new FileDataStore("Google.Apis.Auth") // Lưu trữ token
            });

            // Tạo URL để chuyển hướng người dùng đến để đăng nhập
            string authUrl = flow.CreateAuthorizationCodeRequest(redirectUri).Build().ToString();

            return authUrl;
        }

        public async Task<Userinfo> GetUserProfileAsync(string authorizationCode)
        {
            // Xác thực và lấy access token
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _configuration.GetValue<string>("Google:ClientId"),
                    ClientSecret = _configuration.GetValue<string>("Google:ClientSecret")
                },
                Scopes = new[] { "email", "profile" }, // Phạm vi quyền truy cập
                DataStore = new FileDataStore("Google.Apis.Auth") // Lưu trữ token
            });

            // Lấy token từ authorization code
            TokenResponse token = await flow.ExchangeCodeForTokenAsync("", authorizationCode, redirectUri, CancellationToken.None);

            // Sử dụng token để lấy thông tin người dùng
            Userinfo userInfo;
            var credential = new UserCredential(flow, "", token);
            var service = new Oauth2Service(new BaseClientService.Initializer { HttpClientInitializer = credential });
            userInfo = await service.Userinfo.Get().ExecuteAsync();

            return userInfo;
        }
    }
}
