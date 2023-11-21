using System.ComponentModel.DataAnnotations;

namespace CgptxBackendApi.Data.Entities{
    public class ChatHistory{
        [Key]
        public string chatId {get; set;} = Guid.Empty.ToString();
        public string title {get; set;} = string.Empty;
        public bool isLastOpenedChat {get; set;} = false;
        public DateTime created_at {get; set;}
    }
}