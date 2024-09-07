
namespace ElectronicProjectManagement.Authentication.Models.Dto
{
    public partial class LoginReponseDto
    {
        public UserDto User { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }

    }
}
