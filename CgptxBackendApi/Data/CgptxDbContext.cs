using Microsoft.EntityFrameworkCore;

namespace CgptxBackendApi{
    public class CgptxDbContext: DbContext{
        public CgptxDbContext(DbContextOptions<CgptxDbContext> options) : base(options)
        {
        }
        public DbSet<PromptDataResponse> PromptDataResponses { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }
    }
}