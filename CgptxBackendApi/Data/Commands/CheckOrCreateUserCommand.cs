using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class CheckOrCreateUserCommand: IRequest<ApiResponseModel<User>>{
        public GoogleProfile profile;
        public CheckOrCreateUserCommand(GoogleProfile user){
            profile = user;
        }
    }
}