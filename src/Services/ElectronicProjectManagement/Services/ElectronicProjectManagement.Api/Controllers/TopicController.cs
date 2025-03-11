using AutoMapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VnPostLib.Common.Api.Attributes;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Api.Services.Interfaces;
using VnPostLib.Common.Base;

namespace ElectronicProjectManagement.Api.Controllers
{
    [Route("[controller]")]
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
    }
}
