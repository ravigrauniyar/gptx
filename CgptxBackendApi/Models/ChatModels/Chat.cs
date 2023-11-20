namespace CgptxBackendApi{
    public class Chat{
        public string id {get; set;}= string.Empty;
        public string title {get; set;}= string.Empty;
        public bool isLastOpenedChat {get; set;}
        public List<string> userPrompts {get; set;} = new List<string>();
        public List<string>  aiResponses {get; set;} = new List<string>();
    }
}