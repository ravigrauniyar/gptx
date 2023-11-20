namespace CgptxBackendApi{
    public class PromptData{
        public string chatId {get; set;}= Guid.Empty.ToString();
        public string prompt {get; set;}= string.Empty;
        public string response {get; set;}= string.Empty;
        public int responseIndex {get; set;}
    }
}