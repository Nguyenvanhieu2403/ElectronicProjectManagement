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
    public class PersonalProjectManagementController : BaseController<IPersonalProjectManagementRepos, PersonalProjectManagement>
    {
        public PersonalProjectManagementController(IMapper mapper
            , ILogger<PersonalProjectManagementController> logger
            , IPersonalProjectManagementRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsPersonalProjectManagementBySearch")]
        public async Task<IActionResult> GetsPersonalProjectManagementBySearch(PersonalProjectManagementSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsPersonalProjectManagementBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.GetsPersonalProjectManagementBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsPersonalProjectManagementApprovalBySearch")]
        public async Task<IActionResult> GetsPersonalProjectManagementApprovalBySearch(PersonalProjectManagementSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsPersonalProjectManagementApprovalBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.GetsPersonalProjectManagementApprovalBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsPersonalProjectManagementByStudentId")]
        public async Task<IActionResult> GetsPersonalProjectManagementByStudentId(PersonalProjectManagementSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsPersonalProjectManagementByStudentId(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.GetsPersonalProjectManagementByStudentId");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("UploadProject")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadProject(IFormFile PDF, IFormFile PPT, IFormFile Source, long? IdStudent, int IdProjectsTeachersStudents)
        {
            try
            {
                return ResponseResult(await _repos.UploadProject(PDF, PPT, Source, IdStudent, IdProjectsTeachersStudents));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.UploadProject");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("CheckPlagiarism")]
        public async Task<IActionResult> CheckPlagiarism(string FilePath, long? IdProjectsTeachersStudents)
        {
            try
            {
                return ResponseResult(await _repos.CheckPlagiarism(FilePath, IdProjectsTeachersStudents));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.CheckPlagiarism");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ProjectApproval")]
        public async Task<IActionResult> ProjectApproval(int IdProjectsTeachersStudents, int Status, string? Reason)
        {
            try
            {
                return ResponseResult(await _repos.ProjectApproval(IdProjectsTeachersStudents, Status, Reason));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.ProjectApproval");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("RejectProject")]
        public async Task<IActionResult> RejectProject(int IdProjectsTeachersStudents, int Status, string? Reason)
        {
            try
            {
                return ResponseResult(await _repos.ProjectApproval(IdProjectsTeachersStudents, Status, Reason));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"PersonalProjectManagementController.RejectProject");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }
    }
}
