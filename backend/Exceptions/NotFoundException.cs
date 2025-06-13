namespace backend.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entityName, object id) 
            : base($"{entityName} with id '{id}' was not found")
        {
        }
        
        public NotFoundException(string message) 
            : base(message)
        {
        }

        public NotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
} 