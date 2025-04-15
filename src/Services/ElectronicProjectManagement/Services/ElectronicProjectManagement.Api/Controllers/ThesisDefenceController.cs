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
    public class ThesisDefenceController : BaseController<IThesisDefenceRepos, ThesisDefence>
    {
        public ThesisDefenceController(IMapper mapper
            , ILogger<ThesisDefenceController> logger
            , IThesisDefenceRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsThesisDefenceBySearch")]
        [CheckPermission("Tìm kiếm hội đồng bảo vệ đồ án", 11)]
        public async Task<IActionResult> GetsThesisDefenceBySearch(SearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsThesisDefenceBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ThesisDefenceController.GetsThesisDefenceBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("CreateThesisDefence")]
        [CheckPermission("Thêm mới hội đồng bảo vệ đồ án", 12)]
        public async Task<IActionResult> CreateThesisDefence(ThesisDefenceModel model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.CreateThesisDefence(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ThesisDefenceController.CreateThesisDefence");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("UpdateThesisDefence")]
        [CheckPermission("Cập nhật hội đồng bảo vệ đồ án", 13)]
        public async Task<IActionResult> UpdateThesisDefence(ThesisDefenceModel model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.UpdateThesisDefence(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ThesisDefenceController.UpdateThesisDefence");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetsAllPersonalProjectManagement")]
        [CheckPermission("Lấy danh sách đồ án được bảo vệ", 14)]
        public async Task<IActionResult> GetsAllPersonalProjectManagement()
        {
            try
            {
                return ResponseResult(await _repos.GetsAllPersonalProjectManagement());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ThesisDefenceController.GetsAllPersonalProjectManagement");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ScoringThesisDefence")]
        [CheckPermission("Chấm điểm hội đồng bảo vệ đồ án", 15)]
        public async Task<IActionResult> ScoringThesisDefence(ThesisDefenceDetail model)
        {
            try
            {
                model.ModifiedBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.ScoringThesisDefence(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"ThesisDefenceController.ScoringThesisDefence");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("GetsThesisDefenceExportExcel")]
        [CheckPermission("Xuất danh sách hội đồng bảo vệ đồ án", 16)]
        public async Task<ActionResult> GetsThesisDefenceExportExcel(SearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.GetsThesisDefenceExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ThesisDefenceReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }
    }
}
