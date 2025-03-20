using AutoMapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Api.Services.Interfaces;
using VnPostLib.Common.Base;

namespace ElectronicProjectManagement.Api.Controllers
{
    [Route("[controller]")]
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
    }
}
