
using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.AccessModels;
using Microsoft.EntityFrameworkCore;

namespace CgptxBackendApi.Repositories
{
    public class AccessRepository : IAccessRepository
    {
        private readonly CgptxDbContext _dbContext;
        public AccessRepository(CgptxDbContext cgptxDbContext){
            _dbContext = cgptxDbContext;
        }

        public async Task<User> checkOrCreateUser(GoogleProfile user)
        {
            var prevUser = await _dbContext.Users.FindAsync(user.id);
            if(prevUser == null){
                var newUser = new User{
                    id = user.id,
                    first_name = user.given_name,
                    last_name = user.family_name,
                    email = user.email,
                    picture = user.picture,
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow
                };
                _dbContext.Users.Add(newUser);
                await _dbContext.SaveChangesAsync();
                
                return newUser;
            }
            else{
                return prevUser;
            }
        }
    }
}