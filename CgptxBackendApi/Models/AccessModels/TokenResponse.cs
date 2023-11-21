namespace CgptxBackendApi.Models.AccessModels{
    public class TokenResponse{
        public string access_token {get; set;} = string.Empty;
        public string refresh_token {get; set;} = string.Empty;
    }
}