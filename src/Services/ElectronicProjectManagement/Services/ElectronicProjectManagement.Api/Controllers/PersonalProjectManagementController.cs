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
        [CheckPermission("Tìm kiếm đề tài cá nhân", 11)]
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
        [CheckPermission("Tìm kiếm đề tài cá nhân cần phê duyệt", 12)]
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
        [CheckPermission("Tìm kiếm đề tài cá nhân theo sinh viên", 13)]
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
        [CheckPermission("Tải lên tài liệu đề tài cá nhân", 14)]
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
        [CheckPermission("Kiểm tra đạo văn", 15)]
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
        [CheckPermission("Phê duyệt đề tài cá nhân", 16)]
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
        [CheckPermission("Từ chối phê duyệt đề tài cá nhân", 17)]
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

        [HttpPost("GetsPersonalProjectManagementApprovalExportExcel")]
        [CheckPermission("Xuất file đề tài cá nhân cần phê duyệt", 18)]
        public async Task<ActionResult> GetsPersonalProjectManagementApprovalExportExcel(PersonalProjectManagementSearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.GetsPersonalProjectManagementApprovalExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_GetsPersonalProjectManagementApprovalReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }

        [HttpPost("DownloadReportCheckPlagiarism")]
        //[CheckPermission("Xuất file báo cáo đạo văn", 19)]
        public async Task<ActionResult> DownloadReportCheckPlagiarism(long IdProjectsTeachersStudents)
        {
            var toDay = DateTime.Today;
            var Author = _userPrincipalService.UserId;
            var result = await _repos.DownloadReportCheckPlagiarism(IdProjectsTeachersStudents, Author);
            string fileName = $"CheckPlagiarism_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.pdf";
            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), "application/pdf", fileName);
        }
    }
}
