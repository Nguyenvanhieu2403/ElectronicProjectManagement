using AutoMapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VnPostLib.Common.Api.Attributes;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Api.Services.Interfaces;
using VnPostLib.Common.Base;

namespace ElectronicProjectManagement.Api.Controllers
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class ReferencesFileController : BaseController<IReferencesFileRepos, ReferencesFile>
    {
        public ReferencesFileController(IMapper mapper
            , ILogger<ReferencesFileController> logger
            , IReferencesFileRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsReferencesFileBySearch")]
        [CheckPermission("Tìm kiếm tài liệu tham khảo",11)]
        public async Task<IActionResult> GetsReferencesFileBySearch(ReferencesFileSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsReferencesFileBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ReferencesFileController.GetsReferencesFileBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetsAllReferencesFile")]
        [CheckPermission("Lấy tất cả tài liệu tham khảo", 11)]
        public async Task<IActionResult> GetsAllReferencesFile()
        {
            try
            {
                return ResponseResult(await _repos.GetsAllReferencesFile());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ReferencesFileController.GetsAllReferencesFile");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("CreateReferencesFile")]
        [CheckPermission("Tạo file tài liệu tham khảo", 11)]
        public async Task<IActionResult> CreateReferencesFile([FromForm] ReferencesFileModel model, IFormFile file)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.CreateReferencesFile(model, file));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ReferencesFileController.CreateReferencesFile");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("UpdateReferencesFile")]
        [CheckPermission("Chỉnh sửa file tài liệu tham khảo", 11)]
        public async Task<IActionResult> UpdateReferencesFile([FromForm] ReferencesFileModel model, IFormFile file)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.UpdateReferencesFile(model, file));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ReferencesFileController.UpdateReferencesFile");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpDelete("DeleteReferencesFile")]
        [CheckPermission("Xóa file tài liệu tham khảo",11)]
        public async Task<IActionResult> DeleteReferencesFile(long id)
        {
            try
            {
                return ResponseResult(await _repos.DeleteReferencesFile(id));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ReferencesFileController.DeleteReferencesFile");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }
    }
}
