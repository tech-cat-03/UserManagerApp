namespace UserManagerApp.Server.Models
{
    public class RegisterDto
    {
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Culture { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
