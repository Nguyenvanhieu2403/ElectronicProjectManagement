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
    }
}
