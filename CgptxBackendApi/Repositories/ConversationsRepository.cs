
using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.ChatModels;
using CgptxBackendApi.Utilities;
using Microsoft.EntityFrameworkCore;

namespace CgptxBackendApi.Repositories
{
    public class ConversationsRepository : IConversationsRepository
    {
        private readonly HttpContextHandler _httpContextHandler;
        private readonly CgptxDbContext _dbContext;
        public ConversationsRepository(CgptxDbContext cgptxDbContext, HttpContextHandler httpContextHandler){
            _dbContext = cgptxDbContext;
            _httpContextHandler = httpContextHandler;
        }
        public async Task<Dictionary<string, Dictionary<string, PromptDataResponse>>> getChatPromptData()
        {
            string userId = _httpContextHandler.ClaimValue().id;
            var chatPromptsDictionary = new Dictionary<string, Dictionary<string, PromptDataResponse>>();
            var promptsDictionary = new Dictionary<string, PromptDataResponse>();

            var chatIdsByUserId = await _dbContext.UserChatRelations
                                    .Where(rel=> rel.userId == userId)
                                    .AsNoTracking()
                                    .Select(rel=> rel.chatId)
                                    .ToListAsync();

            foreach(var chatId in chatIdsByUserId){
                var promptIdsByChatId = await _dbContext.ChatPromptsRelations
                                        .Where(rel=> rel.chatId == chatId)
                                        .AsNoTracking()
                                        .Select(rel=> rel.promptId)
                                        .ToListAsync();

                promptsDictionary = await _dbContext.PromptDataResponses
                                        .Where(res=> promptIdsByChatId.Contains(res.promptUniqueKey))
                                        .AsNoTracking()
                                        .ToDictionaryAsync(res=> res.promptUniqueKey, res=> res);

                chatPromptsDictionary.Add(chatId, promptsDictionary); 
            }
            return chatPromptsDictionary;
        }
        public async Task<List<Chat>> getPromptDataResponses()
        {
            // Get prompt responses for the user
            var promptsByChatResponses = await getChatPromptData();
            if(promptsByChatResponses != null){

                var chatList = new List<Chat>();

                foreach (var chatGroup in promptsByChatResponses)
                {
                    var chat = new Chat
                    {
                        id = chatGroup.Key,
                    };
                    var chatHistory = await _dbContext.ChatHistories.FindAsync(chat.id);
                    chat.title = chatHistory!.title;
                    chat.isLastOpenedChat = chatHistory.isLastOpenedChat;
                    chat.created_at = chatHistory.created_at.ToString();

                    chat.userPrompts
                        .AddRange(
                            chatGroup.Value
                            .OrderBy(p=>p.Value.created_at)
                            .Select(p => p.Value.prompt)
                        );
                    chat.aiResponses
                        .AddRange(
                            chatGroup.Value
                            .OrderBy(p=>p.Value.created_at)
                            .Select(p => p.Value.response)
                        );

                    chatList.Add(chat);
                }
                return chatList.OrderByDescending(chat=> chat.created_at).ToList();
            }
            else {
                throw new Exception();
            }
        }
        public async Task<PromptDataResponse> storePromptData(PromptData data){
            var dataResponse = new PromptDataResponse
            {
                promptUniqueKey = Guid.NewGuid().ToString(),
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
                        // Create a new chat in the database
                        var newChat = new ChatHistory{
                            chatId= data.chatId,
                            isLastOpenedChat = true,
                            title = data.prompt,
                            created_at = DateTime.UtcNow
                        };
                        _dbContext.ChatHistories.Add(newChat);

                        // Create a UserChatRelation for the new chat
                        var newUserChatRelation = new UserChatRelation{
                            userId = _httpContextHandler.ClaimValue().id,
                            chatId = newChat.chatId
                        };
                        _dbContext.UserChatRelations.Add(newUserChatRelation);
                        
                        // Save latest changes in database
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

                    // Add new entry in ChatPromptsRelation table
                    var newChatPromptRelation = new ChatPromptsRelation{
                        chatId = data.chatId,
                        promptId = dataResponse.promptUniqueKey
                    };
                    _dbContext.ChatPromptsRelations.Add(newChatPromptRelation);

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
        public async Task deleteChat(string id){
            var chat = await _dbContext.ChatHistories
                        .AsNoTracking()
                        .FirstOrDefaultAsync(c => c.chatId == id) 
                        ?? throw new Exception();

            var chatPromptsData = await getChatPromptData();
            var deleteChatPromptIds = chatPromptsData.FirstOrDefault(chat=> chat.Key == id).Value.Keys;

            var promptDataResponses = await _dbContext.PromptDataResponses
                                        .AsNoTracking()
                                        .Where(response => deleteChatPromptIds.Contains(response.promptUniqueKey))
                                        .ToListAsync();

            var promptChatRelations = await _dbContext.ChatPromptsRelations
                                        .AsNoTracking()
                                        .Where(
                                            relation=> deleteChatPromptIds.Contains(relation.promptId)
                                        )
                                        .ToListAsync();

            using var transaction = _dbContext.Database.BeginTransaction();
            try
            {
                // Delete prompt data responses
                _dbContext.PromptDataResponses.RemoveRange(promptDataResponses);

                // Delete chat history
                _dbContext.ChatHistories.Remove(chat);

                // Remove chat prompt relations
                _dbContext.ChatPromptsRelations.RemoveRange(promptChatRelations);

                // Remove user chat relation
                var userChatRelation = await _dbContext.UserChatRelations.FirstOrDefaultAsync(rel=> rel.chatId == id);
                _dbContext.UserChatRelations.Remove(userChatRelation!);

                // Save changes
                await _dbContext.SaveChangesAsync();
                transaction.Commit();
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