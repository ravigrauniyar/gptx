
using Microsoft.EntityFrameworkCore;

namespace CgptxBackendApi
{
    public class ConversationsRepository : IConversationsRepository
    {
        private readonly CgptxDbContext _dbContext;
        public ConversationsRepository(CgptxDbContext cgptxDbContext){
            _dbContext = cgptxDbContext;
        }
        public async Task<List<Chat>> getPromptDataResponses()
        {
            var promptDataResponses = await _dbContext.PromptDataResponses.ToListAsync();
            if(promptDataResponses != null){
                var chatGroups = promptDataResponses
                                    .OrderByDescending(p=>p.created_at)
                                    .GroupBy(p => p.chatId);

                var chatList = new List<Chat>();

                foreach (var chatGroup in chatGroups)
                {
                    var chat = new Chat
                    {
                        id = chatGroup.Key,
                    };
                    var chatHistory = await _dbContext.ChatHistories.FindAsync(chat.id);
                    chat.title = chatHistory!.title;
                    chat.isLastOpenedChat = chatHistory.isLastOpenedChat;

                    chat.userPrompts.AddRange(chatGroup.OrderBy(p=>p.created_at).Select(p => p.prompt));
                    chat.aiResponses.AddRange(chatGroup.OrderBy(p=>p.created_at).Select(p => p.response));

                    chatList.Add(chat);
                }
                return chatList;
            }
            else {
                throw new Exception();
            }
        }
        public async Task<PromptDataResponse> storePromptData(PromptData data){
            var dataResponse = new PromptDataResponse
            {
                promptUniqueKey = Guid.NewGuid().ToString(),
                chatId = data.chatId,
                prompt = data.prompt,
                response = data.response,
                created_at = DateTime.UtcNow.ToString()
            };

            using var dbContextTransaction = _dbContext.Database.BeginTransaction();
            try
            {
                var promptDataResponses = await getPromptDataResponses();
                var promptDataIfExists = promptDataResponses.Find(promptData=> promptData.id == data.chatId);
                if(
                    promptDataIfExists == null
                    || promptDataIfExists.aiResponses.Count == data.responseIndex
                ){
                    var chatIfExists = await _dbContext.ChatHistories.FindAsync(data.chatId);
                    if(chatIfExists == null){
                        var newChat = new ChatHistory{
                            chatId= data.chatId,
                            isLastOpenedChat = true,
                            title = data.prompt,
                            created_at = DateTime.UtcNow
                        };
                        _dbContext.ChatHistories.Add(newChat);
                        await _dbContext.SaveChangesAsync();
                    }
                    var chatHistories = await _dbContext.ChatHistories.ToListAsync() ?? throw new Exception();
                    foreach(var chat in chatHistories){
                        if(chat.chatId == data.chatId){
                            chat.isLastOpenedChat = true;
                        }
                        else{
                            chat.isLastOpenedChat = false;
                        }
                    }
                    // Add the new dataResponse
                    _dbContext.PromptDataResponses.Add(dataResponse);

                    // Save changes within a single transaction
                    await _dbContext.SaveChangesAsync();

                    // Commit the transaction
                    dbContextTransaction.Commit();
                    // Return the dataResponse
                    return dataResponse;
                }
                throw new Exception("Data entry conflict");
            }
            catch (Exception ex)
            {
                dbContextTransaction.Rollback();
                throw new Exception(ex.Message);
            }
        }
        public async Task<Chat> updateChat(UpdateChat updateData, string id){
            var chat = await _dbContext.ChatHistories.FirstOrDefaultAsync(c => c.chatId == id) ?? throw new Exception();
            // Update and save the chat
            chat.title = updateData.newTitle;

            if(chat.isLastOpenedChat != updateData.isLastOpenedChat){
                chat.isLastOpenedChat = updateData.isLastOpenedChat;
                var chatHistories = await _dbContext.ChatHistories.ToListAsync();

                foreach(var chatHistory in chatHistories){
                    if(chatHistory.chatId != chat.chatId){
                        chatHistory.isLastOpenedChat = false;
                    }
                }
            }
            await _dbContext.SaveChangesAsync();
            var chats = await getPromptDataResponses();
            
            return chats.FirstOrDefault(c => c.id == id) ?? throw new Exception();
        }
        public async Task<string> deleteChat(string id){
            var chat = await _dbContext.ChatHistories
                        .AsNoTracking()
                        .FirstOrDefaultAsync(c => c.chatId == id) 
                        ?? throw new Exception();

            var promptDataResponses = await _dbContext.PromptDataResponses
                                        .AsNoTracking()
                                        .Where(response => response.chatId == id)
                                        .ToListAsync();

            using var transaction = _dbContext.Database.BeginTransaction();
            try
            {
                // Delete prompt data responses
                _dbContext.PromptDataResponses.RemoveRange(promptDataResponses);

                // Delete chat history
                _dbContext.ChatHistories.Remove(chat);

                await _dbContext.SaveChangesAsync();
                transaction.Commit();
                return "Chat deleted successfully!";
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw; // Rethrow the exception
            }
        }
        public async Task<Chat> startNewChat(){
            var chatHistories = await _dbContext.ChatHistories.ToListAsync() ?? throw new Exception();
            
            foreach(var chatHistory in chatHistories){
                chatHistory.isLastOpenedChat = false;
            }
            await _dbContext.SaveChangesAsync();
            return new Chat();
        }
    }
}