using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class RequestLoginCommand: IRequest<ApiResponseModel<GoogleProfile>>{
        public TokenRequest tokenRequest;
        public RequestLoginCommand(TokenRequest request){
            tokenRequest = request;
        }
    }
}