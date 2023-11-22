using CgptxBackendApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CgptxBackendApi{
    public class CgptxDbContext: DbContext{
        public CgptxDbContext(DbContextOptions<CgptxDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<PromptDataResponse> PromptDataResponses { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<UserChatRelation> UserChatRelations { get; set; }
        public DbSet<ChatPromptsRelation> ChatPromptsRelations { get; set; }
    }
}