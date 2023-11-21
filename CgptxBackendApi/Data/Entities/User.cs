using System.ComponentModel.DataAnnotations;

namespace CgptxBackendApi.Data.Entities{
    public class User{
        [Key]
        public string id { get; set; } = string.Empty;
        public string first_name { get; set; } = string.Empty;
        public string last_name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string picture { get; set; } = string.Empty;
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}