using MediatR;

namespace CgptxBackendApi{
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