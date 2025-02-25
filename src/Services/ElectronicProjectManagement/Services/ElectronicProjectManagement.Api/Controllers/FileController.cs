using ElectronicProjectManagement.DataContext.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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


        [HttpGet("download/{folder}/{fileName}")]
        public async Task<IActionResult> DownloadFile(string folder, string fileName)
        {
            string baseDirData = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                                 ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";

            string filePath = Path.Combine(baseDirData, folder, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File không tồn tại.");
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                await stream.CopyToAsync(memory);
            }

            memory.Position = 0;
            string contentType = "application/octet-stream";
            return File(memory, contentType, fileName);
        }
    }
}
