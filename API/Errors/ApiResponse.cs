using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SQLitePCL;

namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message =  null)
        {
            StatusCode =  statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }

        private string GetDefaultMessageForStatusCode(int statuCode)
        {
            return StatusCode switch
            {
                400 => "A bed request",
                401 => "Authorized, you are not",
                404 => "Resuurce found, it was not",
                500 => "Errors are the path to the dark side. Errors lead to anger. Anger leads to hate. Hate leads to career change."
                , _=> null
            };
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
    }
}