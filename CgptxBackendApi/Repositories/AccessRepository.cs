
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
                if(
                    prevUser.first_name != user.given_name
                    || prevUser.last_name != user.family_name
                    || prevUser.picture != user.picture
                ){
                    prevUser.first_name = user.given_name;
                    prevUser.last_name = user.family_name;
                    prevUser.picture = user.picture;
                    prevUser.updatedAt = DateTime.UtcNow;

                    await _dbContext.SaveChangesAsync();
                }
                return prevUser;
            }
        }

        public async Task<UserProfile> getUserProfile(string userId)
        {
            var user = await _dbContext.Users.FindAsync(userId) ?? throw new Exception();
            
            var userProfile = new UserProfile{
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                picture = user.picture
            };
            return userProfile;
        }
    }
}