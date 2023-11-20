using MediatR;

namespace CgptxBackendApi{
    public class NewChatCommand: IRequest<ApiResponseModel<Chat>>{
        public NewChatCommand(){
            
        }
    }
}