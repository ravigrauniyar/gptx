using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.AccessModels;

namespace CgptxBackendApi.Repositories{
    public interface IAccessRepository{
        public Task<User> checkOrCreateUser(GoogleProfile user);
    }
}