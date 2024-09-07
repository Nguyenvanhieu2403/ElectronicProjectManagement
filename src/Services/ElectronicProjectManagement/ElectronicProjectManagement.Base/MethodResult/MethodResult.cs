using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.Base.MethodResult
{
    public class MethodResult
    {

        #region declare property
        public bool Success { get; set; } = true;
        public string Error { get; set; } = "";

        public int? StatusCode { get; set; } = 200;
        public string Message { get; set; } = "";
        public object Result { get; set; } = new object();
        public int? TotalRecords { get; set; }
        #endregion

        public MethodResult()
        {

        }

        public static MethodResult ResultWithError(string error, string message = "", int? status = null)
        {
            return new MethodResult
            {
                Success = false,
                Message = message,
                Error = error,
                StatusCode = status
            };
        }

        public static MethodResult ResultWithSuccess(string message = "")
        {
            return new MethodResult
            {
                Success = true,
                Message = message
            };
        }

        public static MethodResult ResultWithSuccess(string message = "", int? StatusCode = null)
        {
            return new MethodResult
            {
                Success = true,
                Message = message,
                StatusCode = StatusCode
            };
        }

        public static MethodResult ResultWithError(object? result = null, int? status = null, string message = "", int totalRecords = 0)
        {
            return new MethodResult
            {
                Result = result,
                Message = message,
                StatusCode = status,
                TotalRecords = totalRecords
            };
        }
        public static MethodResult ResultWithSuccess(object? result = null, int? status = 200, string message = "", int totalRecords = 0)
        {
            return new MethodResult
            {
                Result = result,
                Message = message,
                StatusCode = status,
                TotalRecords = totalRecords
            };
        }

        public static MethodResult ResultWithAccessDenined()
        {
            return ResultWithError("ERR_FORBIDDEN", "Bạn không đủ quyền để lấy dữ liệu đã yêu cầu", 403);
        }

        public static MethodResult ResultWithNotFound()
        {
            return ResultWithError("ERR_NOT_FOUND", "Không tìm thấy dữ liệu đã yêu cầu", 400);
        }
    }
}
