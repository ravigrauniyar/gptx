using System.ComponentModel.DataAnnotations;

namespace CgptxBackendApi.Data.Entities{
    public class UserChatRelation{
        [Key]
        public Guid userChatRelationId { get; set; }
        public string chatId { get; set; } = string.Empty;
        public string userId { get; set; } = string.Empty;
    }
}