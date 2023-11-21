namespace CgptxBackendApi.Models.ChatModels{
    public class UpdateChat{
        public string newTitle {get; set;}= string.Empty;
        public bool isLastOpenedChat {get; set; } = false;
    }
}