using MediatR;

namespace CgptxBackendApi{
    public class DeleteChatHandler : IRequestHandler<DeleteChatCommand>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<DeleteChatHandler> _logger;

        public DeleteChatHandler(IConversationsRepository conversationsRepository, ILogger<DeleteChatHandler> logger){
            _chatRepository = conversationsRepository;
            _logger = logger;
        }
        public async Task Handle(DeleteChatCommand request, CancellationToken cancellationToken)
        {
            try
            {
                await _chatRepository.deleteChat(request.id);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}