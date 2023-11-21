namespace CgptxBackendApi.Models.AccessModels{
    public class GoogleProfile{
        public string id { get; set; } = string.Empty;
        public string given_name { get; set; } = string.Empty;
        public string family_name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string picture { get; set; } = string.Empty;
    }
}