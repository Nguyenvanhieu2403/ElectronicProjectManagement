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
    public class TopicController : BaseController<ITopicRepos, Topic>
    {
        public TopicController(IMapper mapper
            , ILogger<TopicController> logger
            , ITopicRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpPost("GetsTopicBySearch")]
        [CheckPermission("Tìm kiếm chủ đề", 11)]
        public async Task<IActionResult> GetsTopicBySearch(TopicSearchModel model)
        {
            try
            {
                return ResponseResult(await _repos.GetsTopicBySearch(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"TopicController.GetsTopicBySearch");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("CreateTopic")]
        [CheckPermission("Thêm mới chủ đề", 12)]
        public async Task<IActionResult> CreateTopic(TopicModel model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.CreateTopic(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"TopicController.CreateTopic");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("UpdateTopic")]
        [CheckPermission("Cập nhật chủ đề", 13)]
        public async Task<IActionResult> UpdateTopic(TopicModel model)
        {
            try
            {
                model.CreateBy = _userPrincipalService.UserId;
                return ResponseResult(await _repos.UpdateTopic(model));
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"TopicController.UpdateTopic");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpPost("ExportExcel")]
        [CheckPermission("Xuất excel chủ đề", 14)]
        public async Task<ActionResult> ExportExcel(TopicSearchModel model)
        {
            var toDay = DateTime.Today;

            var result = await _repos.ExportExcel(model);
            string templateFileURL = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_TopicReport.xlsx");
            string fileName = $"{ExtensionFile.GetFileNameWithoutExtension(templateFileURL)}_{toDay.ToString().Replace('/', '_').Replace(':', '_').Replace(' ', '_')}.xlsx";

            Response.Headers.Add("fileName", fileName);
            return File(result.ToArray(), ExtensionFile.GetContentType(templateFileURL), fileName);
        }
    }
}
