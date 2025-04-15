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
    public class ProjectsTeachersStudentsController : BaseController<IProjectsTeachersStudentsRepos, ProjectsTeachersStudents>
    {
        public ProjectsTeachersStudentsController(IMapper mapper
            , ILogger<ProjectsTeachersStudentsController> logger
            , IProjectsTeachersStudentsRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsProjectsTeachersStudentsBySearch")]
        [CheckPermission("Tìm kiếm đăng ký giảng viên hướng dẫn", 11)]
        public async Task<IActionResult> GetsProjectsTeachersStudentsBySearch(SearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsProjectsTeachersStudentsBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsTeachersStudentsController.GetsProjectsTeachersStudentsBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("RegisterTeachers")]
        [CheckPermission("Đăng ký giảng viên hướng dẫn", 12)]
        public async Task<IActionResult> RegisterTeachers(ProjectsTeachersStudents model)
        {
            try
            {
                return ResponseResult(await _repos.RegisterTeachers(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsTeachersStudentsController.RegisterTeachers");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetStudentRegister")]
        [CheckPermission("Lấy danh sách sinh viên đăng ký", 13)]
        public async Task<IActionResult> GetStudentRegister(ProjectsTeachersStudentsRegisterModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetStudentRegister(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsTeachersStudentsController.GetStudentRegister");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("RegisterProjects")]
        [CheckPermission("Đăng ký đồ án", 14)]
        public async Task<IActionResult> RegisterProjects(ProjectsTeachersStudents model)
        {
            try
            {
                return ResponseResult(await _repos.RegisterProjects(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsTeachersStudentsController.RegisterProjects");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsProjectForStudentRegister")]
        [CheckPermission("Lấy danh sách đồ án cho sinh viên đăng ký", 15)]
        public async Task<IActionResult> GetsProjectForStudentRegister(SearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsProjectForStudentRegister(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ProjectsTeachersStudentsController.GetsProjectForStudentRegister");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ProjectsTeachersStudentsExportExcel")]
        [CheckPermission("Xuất danh sách đăng ký giảng viên hướng dẫn", 16)]
        public async Task<ActionResult> ProjectsTeachersStudentsExcel(SearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.ProjectsTeachersStudentsExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ProjectsTeachersStudentsReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }
    }
}
