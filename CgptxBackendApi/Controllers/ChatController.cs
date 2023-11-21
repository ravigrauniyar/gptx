using CgptxBackendApi.Data.Commands;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CgptxBackendApi{
    [ApiController]
    [Authorize]
    [Route("/api/conversations/")]
    public class ChatController: Controller{
        private readonly IMediator _mediator;
        private readonly ILogger<ChatController> _logger;
        public ChatController(IMediator mediator, ILogger<ChatController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetConversations(){
            try{
                var response = await _mediator.Send(new GetConversationsQuery());
                return response.apiErrorResponse == null 
                        ? Ok(response.apiObjectResponse)
                        : BadRequest(response.apiErrorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the GetConversations method of ChatController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while fetching Chat history",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error).apiErrorResponse);
            }
        }

        [HttpPost("prompts")]
        public async Task<IActionResult> StorePromptData([FromBody] PromptData data){
            try{
                var response = await _mediator.Send(new PushPromptData(data));
                return response.apiErrorResponse == null 
                        ? Ok(response.apiObjectResponse)
                        : BadRequest(response.apiErrorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the StorePromptData method of ChatController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while storing prompt.",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error));
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChat([FromBody] UpdateChat updateChat, [FromRoute] string id){
            try{
                var response = await _mediator.Send(new UpdateChatCommand(updateChat, id));
                return response.apiErrorResponse == null 
                        ? Ok(response.apiObjectResponse)
                        : BadRequest(response.apiErrorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the UpdateChat method of ChatController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while updating Chat history",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error));
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChat([FromRoute] string id){
            try{
                await _mediator.Send(new DeleteChatCommand(id));
                return StatusCode(204);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the DeleteChat method of ChatController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while deleting Chat from history.",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error));
            }
        }
    
        [HttpPut("new_chat")]
        public async Task<IActionResult> StartNewChat(){
            try{
                var response = await _mediator.Send(new NewChatCommand());
                return response.apiErrorResponse == null 
                        ? Ok(response.apiObjectResponse)
                        : BadRequest(response.apiErrorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the StartNewChat method of ChatController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while starting Chat.",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error));
            }
        }
    }
}