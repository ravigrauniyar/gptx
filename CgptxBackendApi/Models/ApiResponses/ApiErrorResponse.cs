namespace CgptxBackendApi{
    public class ApiErrorResponse{
        public List<ApiErrorModel> errors {get; set;} = new List<ApiErrorModel>();
    }
}