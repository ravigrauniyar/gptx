using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using MediatR;

namespace CgptxBackendApi{
    public class GetConversationsQuery: IRequest<ApiResponseModel<List<Chat>>>{
        public GetConversationsQuery(){
            
        }
    }
}