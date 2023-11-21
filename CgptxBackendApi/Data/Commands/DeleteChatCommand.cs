using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class DeleteChatCommand: IRequest{
        public string id;
        public DeleteChatCommand(string chatId)
        {
            id = chatId;
        }
    }
}