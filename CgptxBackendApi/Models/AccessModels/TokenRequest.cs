namespace CgptxBackendApi.Models.AccessModels{
    public class TokenRequest{
        public string google_token {get; set;} = string.Empty;
    }
    public class Jwt
    {
        public string key { get; set; } = string.Empty;
        public string issuer { get; set; } = string.Empty;
        public string audience { get; set; } = string.Empty;
    }
}