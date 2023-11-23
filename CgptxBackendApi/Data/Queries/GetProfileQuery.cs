using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using MediatR;

namespace CgptxBackendApi.Data.Queries{
    public class GetProfileQuery : IRequest<ApiResponseModel<UserProfile>>{
        public string userId;
        public GetProfileQuery(string id){
            userId = id;
        }
    }
}