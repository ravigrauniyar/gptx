using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class UpdateChatCommand: IRequest<ApiResponseModel<Chat>>{
        public UpdateChat data;
        public string id;
        public UpdateChatCommand(UpdateChat data, string id)
        {
            this.data = data;
            this.id = id;
        }
    }
}