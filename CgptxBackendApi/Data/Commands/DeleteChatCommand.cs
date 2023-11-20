using MediatR;

namespace CgptxBackendApi{
    public class DeleteChatCommand: IRequest<ApiResponseModel<string>>{
        public string id;
        public DeleteChatCommand(string chatId)
        {
            id = chatId;
        }
    }
}