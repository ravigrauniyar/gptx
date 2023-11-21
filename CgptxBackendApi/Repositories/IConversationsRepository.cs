using System.Runtime.CompilerServices;

namespace CgptxBackendApi{
    public interface IConversationsRepository{
        public Task<List<Chat>> getPromptDataResponses();
        public Task<PromptDataResponse> storePromptData(PromptData data);
        public Task<Chat> updateChat(UpdateChat updateData, string id);
        public Task deleteChat(string id);
        public Task<Chat> startNewChat();
    }
}