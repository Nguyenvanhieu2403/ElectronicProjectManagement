using AutoMapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Common;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using VnPostLib.Common.Api.Attributes;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Api.Services.Interfaces;
using VnPostLib.Common.Base;

namespace ElectronicProjectManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProjectBatchController : BaseController<IProjectBatchRepos, ProjectBatch>
    {
        public ProjectBatchController(IMapper mapper
            , ILogger<ProjectBatchController> logger
            , IProjectBatchRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("CreateProjectBatch")]
        [CheckPermission("Thêm mới đợt đề tài", 11)]
        public async Task<IActionResult> CreateProjectBatch(ProjectBatchModel model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                model.ModifiedBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.CreateProjectBatch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.CreateProjectBatch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetBySearchProjectBatch")]
        [CheckPermission("Tìm kiếm đợt đề tài", 12)]
        public async Task<IActionResult> GetBySearchProjectBatch(ProjectBatchSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsProjectBatchBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.GetBySearchProjectBatch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetProjectBatchById")]
        [CheckPermission("Lấy thông tin đợt đề tài", 13)]
        public async Task<IActionResult> GetProjectBatchById(long id)
        {
            try
            {
                return ResponseResult(await _repos.GetProjectBatchById(id));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.GetProjectBatchById");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPut("UpdateProjectBatch")]
        [CheckPermission("Cập nhật đợt đề tài", 14)]
        public async Task<IActionResult> UpdateProjectBatch(ProjectBatchModel model)
        {
            try
            {
                model.ModifiedBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.UpdateProjectBatch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.UpdateProjectBatch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpDelete("DeleteProjectBatch")]
        [CheckPermission("Xóa đợt đề tài", 15)]
        public async Task<IActionResult> DeleteProjectBatch(long id)
        {
            try
            {
                return ResponseResult(await _repos.DeleteProjectBatch(id));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.DeleteProjectBatch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsUserByProjectBatchId")]
        [CheckPermission("Tìm kiếm sinh viên trong đợt đề tài", 16)]
        public async Task<IActionResult> GetsUserByProjectBatchId(ProjectBatchUserSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsProjectBatchUserByProjectBatchId(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.GetsUserByProjectBatchId");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetAllProjectBatch")]
        [CheckPermission("Lấy tất cả đợt đề tài", 17)]
        public async Task<IActionResult> GetAllProjectBatch()
        {
            try
            {
                return ResponseResult(await _repos.GetsAllProjectBatch());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectBatchController.GetAllProjectBatch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ExportExcel")]
        [CheckPermission("Xuất excel đợt đề tài", 18)]
        public async Task<ActionResult> ExportExcel(ProjectBatchSearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.ExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ProjectBatchReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }
    }
}
