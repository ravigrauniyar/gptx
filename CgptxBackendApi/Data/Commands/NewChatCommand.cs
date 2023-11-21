using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class NewChatCommand: IRequest<ApiResponseModel<Chat>>{
        public NewChatCommand(){
            
        }
    }
}