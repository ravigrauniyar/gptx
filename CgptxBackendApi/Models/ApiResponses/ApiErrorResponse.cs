namespace CgptxBackendApi.Models.ApiResponses{
    public class ApiErrorResponse{
        public List<ApiErrorModel> errors {get; set;} = new List<ApiErrorModel>();
    }
}