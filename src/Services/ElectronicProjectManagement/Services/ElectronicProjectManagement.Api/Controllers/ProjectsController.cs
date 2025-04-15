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
        [CheckPermission("Tìm kiếm đồ án", 11)]
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
        [CheckPermission("Thêm mới đồ án", 12)]
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
        [CheckPermission("Cập nhật đồ án", 13)]
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
        [CheckPermission("Import danh sách đồ án", 14)]
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
        [CheckPermission("Đề xuất đồ án", 15)]
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
        [CheckPermission("Tìm kiếm đồ án sinh viên đề xuất", 16)]
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
        [CheckPermission("Phê duyệt đồ án đề xuất", 17)]
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
        [CheckPermission("Từ chối đồ án đề xuất", 18)]
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

        [HttpPost("ExportExcel")]
        [CheckPermission("Xuất danh sách đồ án", 19)]
        public async Task<ActionResult> ExportExcel(SearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.ExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ProjectReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }

        [HttpPost("ExportStudentsProposedTopics")]
        [CheckPermission("Xuất danh sách đồ án sinh viên đề xuất", 20)]
        public async Task<ActionResult> ExportStudentsProposedTopics(StudentsProposedTopicsSearchModel model)
        {
            var toDay = DateTime.Today;
            var result = await _repos.ExportStudentsProposedTopics(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_GetsStudentsProposedTopicsReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";
            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }
    }
}
