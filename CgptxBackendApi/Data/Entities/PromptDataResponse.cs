using System.ComponentModel.DataAnnotations;

namespace CgptxBackendApi{
    public class PromptDataResponse{
        [Key]
        public string promptUniqueKey { get; set; } = Guid.Empty.ToString();
        public string chatId {get; set;}= Guid.Empty.ToString();
        public string prompt {get; set;}= string.Empty;
        public string response {get; set;}= string.Empty;
        public string created_at {get; set;} = string.Empty;
    }
}