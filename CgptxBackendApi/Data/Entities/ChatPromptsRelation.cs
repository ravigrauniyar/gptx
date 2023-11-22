using System.ComponentModel.DataAnnotations;

namespace CgptxBackendApi.Data.Entities{
    public class ChatPromptsRelation{
        [Key]
        public Guid chatPromptRelationId { get; set; }
        public string promptId { get; set; } = string.Empty;
        public string chatId { get; set; } = string.Empty;
    }
}