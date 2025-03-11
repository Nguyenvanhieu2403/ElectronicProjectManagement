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
    public class ProjectsController : BaseController<IProjectsRepos, Projects>
    {
        public ProjectsController(IMapper mapper
            , ILogger<ProjectsController> logger
            , IProjectsRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsProjectsBySearch")]
        public async Task<IActionResult> GetsProjectsBySearch(SearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsProjectsBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.GetsProjectsBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("CreateProjects")]
        public async Task<IActionResult> CreateProjects(Projects model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.CreateProjects(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.CreateProjects");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("UpdateProjects")]
        public async Task<IActionResult> UpdateProjects(Projects model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.UpdateProjects(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.UpdateProjects");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ImportProjects")]
        public async Task<IActionResult> ImportProjects(IFormFile file)
        {
            try
            {
                return ResponseResult(await _repos.ImportProjects(file));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.ImportProjects");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ProposeProjects")]
        public async Task<IActionResult> ProposeProjects(Projects model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.ProposeProjects(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.ProposeProjects");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsStudentsProposedTopics")]
        public async Task<IActionResult> GetsStudentsProposedTopics(StudentsProposedTopicsSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsStudentsProposedTopics(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.GetsStudentsProposedTopics");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ApproveTopic")]
        public async Task<IActionResult> ApproveTopic(int ProjectId)
        {
            try
            {
                return ResponseResult(await _repos.ApproveTopic(ProjectId));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.ApproveTopic");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("RejectTopic")]
        public async Task<IActionResult> RejectTopic(int ProjectId)
        {
            try
            {
                return ResponseResult(await _repos.RejectTopic(ProjectId));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsController.RejectTopic");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }
    }
}
