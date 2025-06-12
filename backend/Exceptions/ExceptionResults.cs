namespace backend.DTOs
{
    // Spring Boot'taki ExceptionResult base karşılığı
    public class ExceptionResult
    {
        public string Type { get; set; } = "UnknownError";
        public string Message { get; set; } = string.Empty;

        public ExceptionResult()
        {
        }

        public ExceptionResult(string message)
        {
            Message = message;
        }
    }

    public class BusinessExceptionResult : ExceptionResult
    {
        public BusinessExceptionResult()
        {
            Type = "BusinessException";
        }

        public BusinessExceptionResult(string message) : base(message)
        {
            Type = "BusinessException";
        }
    }

    public class ValidationExceptionResult
    {
        public string Type { get; set; } = "ValidationError";
        public List<string> Errors { get; set; } = new List<string>();

        public ValidationExceptionResult()
        {
        }

        public ValidationExceptionResult(List<string> errors)
        {
            Type = "ValidationError";
            Errors = errors ?? new List<string>();
        }
    }

    public class NotFoundExceptionResult : ExceptionResult
    {
        public NotFoundExceptionResult()
        {
            Type = "NotFound";
        }

        public NotFoundExceptionResult(string message) : base(message)
        {
            Type = "NotFound";
        }
    }
} 