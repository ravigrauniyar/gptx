using MediatR;

namespace CgptxBackendApi{
    public class DeleteChatCommand: IRequest{
        public string id;
        public DeleteChatCommand(string chatId)
        {
            id = chatId;
        }
    }
}