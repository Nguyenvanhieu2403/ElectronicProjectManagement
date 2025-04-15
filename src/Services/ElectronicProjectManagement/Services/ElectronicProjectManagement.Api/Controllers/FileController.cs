using ElectronicProjectManagement.DataContext.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VnPostLib.Common.Api.Attributes;

namespace ElectronicProjectManagement.Api.Controllers
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public FileController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpGet("download")]
        [CheckPermission("Tải tài liệu tham khảo", 11)]
        public async Task<IActionResult> DownloadFile([FromQuery] string filePath)
        {
            string baseDirData = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                                 ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";

            string fileUrl = Path.Combine(baseDirData, filePath);
            if (!System.IO.File.Exists(fileUrl))
            {
                return NotFound("File không tồn tại.");
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(fileUrl, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                await stream.CopyToAsync(memory);
            }

            memory.Position = 0;
            string contentType = "application/octet-stream";
            return File(memory, contentType, Path.GetFileName(fileUrl));
        }


    }
}
