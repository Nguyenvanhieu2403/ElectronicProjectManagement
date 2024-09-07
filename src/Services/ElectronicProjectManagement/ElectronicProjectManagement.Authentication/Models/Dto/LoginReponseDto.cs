
namespace ElectronicProjectManagement.Authentication.Models.Dto
{
    public partial class LoginReponseDto
    {
        public UserDto User { get; set; }
        public string Token { get; set; }
    }
}
