using AutoMapper;
using ElectronicProjectManagement.DataContext;
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
    public class DashboardController : BaseController<IDashboardRepos, Dashboard>
    {
        public DashboardController(IMapper mapper
            , ILogger<DashboardController> logger
            , IDashboardRepos repos
            , IUserPrincipalService userPrincipalService
            ) : base(mapper, logger, repos, userPrincipalService)
        {
        }

        [HttpGet("GetDashboardTotal")]
        [CheckPermission("Lấy tổng quan dashboard", 11)]
        public async Task<IActionResult> GetDashboardTotal()
        {
            try
            {
                return ResponseResult(await _repos.GetDashboardTotal());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"DashboardController.GetDashboardTotal");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetDashboardProjectScoreStatisticsForYear")]
        [CheckPermission("Lấy thống kê điểm dự án theo năm", 12)]
        public async Task<IActionResult> GetDashboardProjectScoreStatisticsForYear()
        {
            try
            {
                return ResponseResult(await _repos.GetDashboardProjectScoreStatisticsForYear());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"DashboardController.GetDashboardProjectScoreStatisticsForYear");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }

        [HttpGet("GetDashboardProjectStatisticsByTopic")]
        [CheckPermission("Lấy thống kê dự án theo đề tài", 13)]
        public async Task<IActionResult> GetDashboardProjectStatisticsByTopic()
        {
            try
            {
                return ResponseResult(await _repos.GetDashboardProjectStatisticsByTopic());
            }
            catch (Exception ex)
            {
                Exception e = ex;
                _logger.LogError(e, $"DashboardController.GetDashboardProjectStatisticsByTopic");
                return ResponseResult(MethodResult.ResultWithError("Có lỗi xảy ra"));
            }
        }
    }
}
