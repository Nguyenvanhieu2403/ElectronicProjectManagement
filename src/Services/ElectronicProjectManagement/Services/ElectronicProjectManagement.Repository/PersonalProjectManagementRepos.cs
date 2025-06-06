using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Base;
using VnPostLib.Common.Api.Models;
using ElectronicProjectManagement.DataContext.Model;
using Microsoft.AspNetCore.Http;
using System.Drawing;
using System.Data;
using Z.Dapper.Plus;
using Dapper;
using ElectronicProjectManagement.DataContext.Dtos;
using System.Diagnostics;
using ElectronicProjectManagement.Repository.Common;
using static System.Runtime.InteropServices.JavaScript.JSType;
using DocumentFormat.OpenXml.Wordprocessing;
using Pipelines.Sockets.Unofficial.Arenas;
using Dapper.Contrib.Extensions;
using Microsoft.Data.SqlClient;
using VnPostLib.Common.Helpers;
using System.Reflection;
using Elasticsearch.Net;
using Xceed.Words.NET;
using ConvertApiDotNet;

namespace ElectronicProjectManagement.Repository
{
    public class PersonalProjectManagementRepos : BaseRepos<PersonalProjectManagement>, IPersonalProjectManagementRepos
    {
        private readonly IConfiguration _configuration;
        public Double PlagiarismRate = -1;

        public PersonalProjectManagementRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult> CheckPlagiarism(string FilePath, long? IdProjectsTeachersStudents)
        {
            string baseDir = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";
            string imageDir = Path.Combine(baseDir, "ReferencesFile");

            if (!Directory.Exists(imageDir))
            {
                return MethodResult.ResultWithError("error", "Không có file tài liệu nào được chọn", 400);
            }
            var files = Directory.GetFiles(imageDir).Select(Path.GetFileName).ToList();

            var filePathsFromBase = Directory.GetFiles(imageDir).ToList();

            string filePathsToCompare = Path.Combine(baseDir, FilePath);
            if (!System.IO.File.Exists(filePathsToCompare))
            {
                return MethodResult.ResultWithError("error", "File cần kiểm tra không tồn tại", 400);
            }

            var filePathsToCompares = new List<string> { filePathsToCompare };

            #region So sánh file
            Stopwatch stopwatch = Stopwatch.StartNew();
            

            var comparisonTasks = new List<Task>();

            List<(List<string>, double, string baseFilePath, string targetFilePath)> SimilarSentences = new List<(List<string>, double, string baseFilePath, string targetFilePath)>();
            foreach (var targetFilePath in filePathsToCompares)
            {
                foreach (var baseFilePath in filePathsFromBase)
                {
                    string tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetFileName(baseFilePath));

                    try
                    {
                        // Copy file gốc sang file tạm
                        File.Copy(baseFilePath, tempFilePath, true);

                        // Thêm task xử lý so sánh và xóa file tạm sau khi xong
                        comparisonTasks.Add(Task.Run(async () =>
                        {
                            try
                            {
                                await Plagiarism.CompareTwoFileAsync(tempFilePath, targetFilePath, SimilarSentences);
                            }
                            finally
                            {
                                // Dọn dẹp file tạm
                                try
                                {
                                    if (File.Exists(tempFilePath))
                                        File.Delete(tempFilePath);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Lỗi khi xóa file tạm: {ex.Message}");
                                }
                            }
                        }));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Lỗi khi tạo file tạm: {ex.Message}");
                    }
                }
            }

            // Đợi tất cả các tác vụ hoàn thành
            await Task.WhenAll(comparisonTasks);

            // Dừng thời gian
            stopwatch.Stop();
            SimilarSentences = SimilarSentences.OrderByDescending(x => x.Item2).ToList();

            var listData = new List<CheckPlagiarism>
                {
                    new()
                    {
                        IdProjectsTeachersStudents = IdProjectsTeachersStudents,
                        PlagiarismRate = (decimal)SimilarSentences[0].Item2,
                        TargetFile = Path.GetFileName(SimilarSentences[0].targetFilePath),
                        FileHighestRatio = Path.GetFileName(SimilarSentences[0].baseFilePath),
                        ContentDuplicated = SimilarSentences[0].Item1.Count > 0 ? string.Join("\n", SimilarSentences[0].Item1) : null,
                        TestType = "Tool",
                        TimeCheck = stopwatch.ElapsedMilliseconds,
                        Status = 1,
                        CreateBy = 1,
                        CreateDate = DateTime.Now,
                        Modified = null,
                        ModifiedBy = null
                    }
                };

            using IDbConnection connection = GetOpenConnection();
            var result = await connection.BulkInsertAsync(listData);

            var parameters = new DynamicParameters();
            parameters.Add("@IdProjectsTeachersStudents", IdProjectsTeachersStudents);

            var dataUpdate = await connection.QueryFirstOrDefaultAsync<Projects>("EPM.GetProjectByIdProjectsTeachersStudents", parameters, commandType: CommandType.StoredProcedure);

            var parameters1 = new DynamicParameters();
            parameters1.Add("@IdStudent", dataUpdate.CreateBy);
            var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

            var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);
            connection.Close();

            if (dataUpdate.Id > 0 && dataUserStudent.DisplayName != null && dataUserTeacher.DisplayName != null)
            {
                SendEmailModel sendEmailModel = new SendEmailModel
                {
                    StudentEmail = dataUserStudent.Email,
                    StudentName = dataUserStudent.DisplayName,
                    ProjectTitle = dataUpdate.Name,
                    SupervisorName = dataUserTeacher.DisplayName,
                    SupervisorEmail = dataUserTeacher.Email,
                    CheckedFile = SimilarSentences[0].targetFilePath,
                    ReferenceFile = SimilarSentences[0].baseFilePath,
                    PlagiarismRate = SimilarSentences[0].Item2 * 100,
                    ContentDuplicated = SimilarSentences[0].Item1.Count > 0 ? string.Join("\n", SimilarSentences[0].Item1) : null,
                    TimeCheck = stopwatch.ElapsedMilliseconds

                };
                if((SimilarSentences[0].Item2 * 100) > 30)
                {
                    SendEmail.SendPlagiarismCheckEmail(sendEmailModel);
                }
                SendEmail.SendProjectSubmissionEmail(sendEmailModel);
                return MethodResult.ResultWithSuccess("So sánh thành công");
            }

            return MethodResult.ResultWithSuccess("So sánh thất bại");
            #endregion
        }

        public async Task<MethodResult<List<PersonalProjectManagement>>> GetsPersonalProjectManagementBySearch(PersonalProjectManagementSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Keyword", model.Keyword);
                parameters.Add("@isDesc", model.IsDesc);
                parameters.Add("@orderCol", model.OrderCol ?? "Id");
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                parameters.Add("@status", model.Status);
                parameters.Add("@IdProjectBatch", model.IdProjectBatch);
                parameters.Add("@IdUser", model.IdUser);

                var data = await connection.QueryAsync<PersonalProjectManagement>("EPM.PersonalProjectManagementBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.PersonalProjectManagementBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<PersonalProjectManagement>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<PersonalProjectManagement>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<PersonalProjectManagement>>> GetsPersonalProjectManagementApprovalBySearch(PersonalProjectManagementSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Keyword", model.Keyword);
                parameters.Add("@isDesc", model.IsDesc);
                parameters.Add("@orderCol", model.OrderCol ?? "Id");
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                parameters.Add("@status", model.Status);
                parameters.Add("@IdProjectBatch", model.IdProjectBatch);
                parameters.Add("@IdUser", model.IdUser);

                var data = await connection.QueryAsync<PersonalProjectManagement>("EPM.[GetsPersonalProjectManagementApprovalBySearch]", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetsPersonalProjectManagementApprovalBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<PersonalProjectManagement>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<PersonalProjectManagement>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<PersonalProjectManagement>> GetsPersonalProjectManagementByStudentId(PersonalProjectManagementSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdStudent", model.IdUser);

                var data = await connection.QueryFirstOrDefaultAsync<PersonalProjectManagement>("EPM.GetsPersonalProjectManagementByStudentId", parameters , commandType: CommandType.StoredProcedure);
                return MethodResult<PersonalProjectManagement>.ResultWithData(data, "", 0);
            }
            catch (Exception ex)
            {
                return MethodResult<PersonalProjectManagement>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult> UploadProject(IFormFile PDF, IFormFile PPT, IFormFile Source, long? IdStudent, int IdProjectsTeachersStudents)
        {
            try
            {
                if (PDF == null || PDF.Length == 0)
                {
                    return MethodResult.ResultWithError("error", "Vui lòng tải file PDF", 400);
                }
                if (PPT == null || PPT.Length == 0)
                {
                    return MethodResult.ResultWithError("error", "Vui lòng tải file PPT", 400);
                }
                if (Source == null || Source.Length == 0)
                {
                    return MethodResult.ResultWithError("error", "Vui lòng tải source code", 400);
                }

                string baseDir = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";

                // Định nghĩa thư mục
                string pdfDir = Path.Combine(baseDir, "Upload", "PDF");
                string pptDir = Path.Combine(baseDir, "Upload", "PPT");
                string sourceDir = Path.Combine(baseDir, "Upload", "SourceCode");

                Directory.CreateDirectory(pdfDir);
                Directory.CreateDirectory(pptDir);
                Directory.CreateDirectory(sourceDir);

                using IDbConnection connection = GetOpenConnection();

                // Kiểm tra xem sinh viên đã nộp bài chưa
                string checkQuery = "SELECT NamePDF, PathPDF, NamePPT, PathPPT, NameSource, PathSource FROM EPM.PersonalProjectManagement WHERE IdProjectsTeachersStudents = @IdProjectsTeachersStudents AND CreateBy = @IdStudent";
                var existingProject = await connection.QueryFirstOrDefaultAsync<PersonalProjectManagement>(checkQuery, new { IdProjectsTeachersStudents, IdStudent });

                // Xử lý tên file hợp lệ
                string pdfName = $"{Path.GetFileNameWithoutExtension(PDF.FileName)}_{IdStudent}_{IdProjectsTeachersStudents}{Path.GetExtension(PDF.FileName)}";
                string pptName = $"{Path.GetFileNameWithoutExtension(PPT.FileName)}_{IdStudent}_{IdProjectsTeachersStudents}{Path.GetExtension(PPT.FileName)}";
                string sourceName = $"{Path.GetFileNameWithoutExtension(Source.FileName)}_{IdStudent}_{IdProjectsTeachersStudents}{Path.GetExtension(Source.FileName)}";

                string pdfPath = Path.Combine(pdfDir, pdfName);
                string pptPath = Path.Combine(pptDir, pptName);
                string sourcePath = Path.Combine(sourceDir, sourceName);

                if (existingProject != null)
                {
                    // Nếu đã nộp bài, xóa file cũ trước khi ghi đè
                    DeleteFileIfExists(existingProject.PathPDF);
                    DeleteFileIfExists(existingProject.PathPPT);
                    DeleteFileIfExists(existingProject.PathSource);

                    // Cập nhật database
                    string updateQuery = @"
                UPDATE EPM.PersonalProjectManagement
                SET 
                    NamePDF = @NamePDF,
                    PathPDF = @PathPDF,
                    NamePPT = @NamePPT,
                    PathPPT = @PathPPT,
                    NameSource = @NameSource,
                    PathSource = @PathSource,
                    Status = @Status,
                    Modified = @Modified,
                    ModifiedBy = @ModifiedBy
                WHERE IdProjectsTeachersStudents = @IdProjectsTeachersStudents AND CreateBy = @IdStudent";

                    await connection.ExecuteAsync(updateQuery, new
                    {
                        NamePDF = pdfName,
                        PathPDF = $"Upload\\PDF\\{pdfName}",
                        NamePPT = pptName,
                        PathPPT = $"Upload\\PPT\\{pptName}",
                        NameSource = sourceName,
                        PathSource = $"Upload\\SourceCode\\{sourceName}",
                        Status = 3,
                        Modified = DateTime.Now,
                        ModifiedBy = IdStudent,
                        IdProjectsTeachersStudents,
                        IdStudent
                    });

                    connection.Close();
                    // Ghi đè file mới
                    await SaveFileAsync(PDF, pdfPath);
                    await SaveFileAsync(PPT, pptPath);
                    await SaveFileAsync(Source, sourcePath);

                    return MethodResult.ResultWithSuccess("Update success");
                }
                else
                {
                    // Nếu chưa nộp, lưu file mới
                    await SaveFileAsync(PDF, pdfPath);
                    await SaveFileAsync(PPT, pptPath);
                    await SaveFileAsync(Source, sourcePath);

                    // Thực hiện insert
                    var listData = new List<PersonalProjectManagement>
                    {
                        new()
                        {
                            IdProjectsTeachersStudents = IdProjectsTeachersStudents,
                            NamePDF = pdfName,
                            PathPDF = $"Upload\\PDF\\{pdfName}",
                            NamePPT = pptName,
                            PathPPT = $"Upload\\PPT\\{pptName}",
                            NameSource = sourceName,
                            PathSource = $"Upload\\SourceCode\\{sourceName}",
                            Comment = null,
                            Status = 4,
                            CreateBy = IdStudent,
                            CreateDate = DateTime.Now,
                            Modified = null,
                            ModifiedBy = null
                        }
                    };

                    await connection.BulkInsertAsync(listData);
                    connection.Close();
                    return MethodResult.ResultWithSuccess("Insert success");
                }
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        /// <summary>
        /// Hàm xóa file nếu file đó tồn tại
        /// </summary>
        private void DeleteFileIfExists(string? filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                string fullPath = Path.Combine("D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File", filePath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
        }

        /// <summary>
        /// Hàm lưu file vào đường dẫn chỉ định
        /// </summary>
        private async Task SaveFileAsync(IFormFile file, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        public async Task<MethodResult> ProjectApproval(int IdProjectsTeachersStudents, int Status, string? reason)
        {
            try
            {

                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdProjectsTeachersStudents", IdProjectsTeachersStudents);
                parameters.Add("@Status", Status);

                string storedName = "EPM.ProjectApproval";
                if(Status == 2)
                {
                    storedName = "EPM.ProjectReject";
                    parameters.Add("@Reason", reason);
                }

                var dataUpdate = await connection.QueryFirstOrDefaultAsync<Projects>(storedName, parameters, commandType: CommandType.StoredProcedure);

                var parameters1 = new DynamicParameters();
                parameters1.Add("@IdStudent", dataUpdate.CreateBy);
                var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);
                connection.Close();
                if (Status == 1)
                {
                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ProjectTitle = dataUpdate.Name,
                        SupervisorName = dataUserTeacher.DisplayName,
                        SupervisorEmail = dataUserTeacher.Email,
                    };
                    SendEmail.SendApprovalOrRejectionEmail(sendEmailModel, true);
                    return MethodResult.ResultWithSuccess("Approved success");
                }

                if (Status == 2)
                {
                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ProjectTitle = dataUpdate.Name,
                        Reason = reason,
                        SupervisorName = dataUserTeacher.DisplayName,
                        SupervisorEmail = dataUserTeacher.Email,
                    };
                    SendEmail.SendApprovalOrRejectionEmail(sendEmailModel, false);
                    return MethodResult.ResultWithSuccess("Reject success");
                }
                return MethodResult.ResultWithSuccess("Approved or reject fail");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        private async Task<DataTable> ExportExcelToDataTable(PersonalProjectManagementSearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.GetsPersonalProjectManagementApprovalExportExcel", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Keyword", (model.Keyword ?? ""));
                    command.Parameters.AddWithValue("@isDesc", model.IsDesc);
                    command.Parameters.AddWithValue("@orderCol", model.OrderCol);
                    command.Parameters.AddWithValue("@status", model.Status);
                    command.Parameters.AddWithValue("@IdProjectBatch", model.IdProjectBatch);
                    command.Parameters.AddWithValue("@IdUser", model.IdUser);
                    command.CommandTimeout = 420;
                    using (SqlDataAdapter adapter1 = new SqlDataAdapter(command))
                    {
                        adapter1.Fill(dataTable);
                    }
                }
                conn.Close();
            }
            return dataTable;
        }

        public async Task<MemoryStream> GetsPersonalProjectManagementApprovalExportExcel(PersonalProjectManagementSearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_GetsPersonalProjectManagementApprovalReport.xlsx");

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:O" + (result.Rows.Count + 6).ToString()];
                foreach (var cell in range)
                {
                    var border = cell.Style.Border;
                    border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                }

                package.SaveAs(exportFile);
            }

            exportFile.Position = 0;
            return exportFile;
            #endregion
        }

        public async Task<MemoryStream> DownloadReportCheckPlagiarism(long IdProjectsTeachersStudents, long Author)
        {
            try
            {
                var exportFile = new MemoryStream();
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdProjectsTeachersStudents", IdProjectsTeachersStudents);
                parameters.Add("@Author", Author);

                var data = await connection.QueryFirstOrDefaultAsync<ReportCheckPlagiarism>("EPM.GetDownloadReportCheckPlagiarism", parameters, commandType: CommandType.StoredProcedure);

                string baseDir = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";
                string imageDir = Path.Combine(baseDir, "ReferencesFile");

                if (!Directory.Exists(imageDir))
                {
                    return null;
                }
                var files = Directory.GetFiles(imageDir).Select(Path.GetFileName).ToList();

                var filePathsFromBase = Directory.GetFiles(imageDir).ToList();

                string filePathsToCompare = Path.Combine(baseDir, data.PathPDF);
                if (!System.IO.File.Exists(filePathsToCompare))
                {
                    return null;
                }

                var filePathsToCompares = new List<string> { filePathsToCompare };

                var beginStart = DateTime.Now;

                var comparisonTasks = new List<Task>();

                List<(List<string>, double, string baseFilePath, string targetFilePath)> SimilarSentences = new List<(List<string>, double, string baseFilePath, string targetFilePath)>();
                foreach (var targetFilePath in filePathsToCompares)
                {
                    string tempTargetFilePath = Path.Combine(Path.GetTempPath(), Path.GetFileName(targetFilePath));
                    File.Copy(targetFilePath, tempTargetFilePath, true);
                    foreach (var baseFilePath in filePathsFromBase)
                    {
                        //comparisonTasks.Add(Plagiarism.CompareTwoFileAsync(baseFilePath, targetFilePath, SimilarSentences));
                        string tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetFileName(baseFilePath));

                        try
                        {
                            // Copy file gốc sang file tạm
                             File.Copy(baseFilePath, tempFilePath, true);

                            // Thêm task xử lý so sánh và xóa file tạm sau khi xong
                            comparisonTasks.Add(Task.Run(async () =>
                            {
                                try
                                {
                                    await Plagiarism.CompareTwoFileAsync(tempFilePath, tempTargetFilePath, SimilarSentences);
                                }
                                finally
                                {
                                    // Dọn dẹp file tạm
                                    try
                                    {
                                        //if (File.Exists(tempTargetFilePath))
                                        //    File.Delete(tempTargetFilePath);

                                        //if (File.Exists(tempFilePath))
                                        //    File.Delete(tempFilePath);
                                    }
                                    catch (Exception ex)
                                    {
                                        Console.WriteLine($"Lỗi khi xóa file tạm: {ex.Message}");
                                    }
                                }
                            }));
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Lỗi khi tạo file tạm: {ex.Message}");
                        }
                    }
                }

                await Task.WhenAll(comparisonTasks);

                var endStart = DateTime.Now;

                SimilarSentences = SimilarSentences.OrderByDescending(x => x.Item2).ToList();
                string tempDocxPath = Path.Combine(Path.GetTempPath(), ExtensionFile.GetFileNameWithoutExtension(Path.GetFileName(SimilarSentences[1].targetFilePath)) + ".docx");
                string tempPDFPath = Path.Combine(baseDir, "FileReportPlagiarism");
                string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "TemplateCheckPlagiarism.docx");
                using (DocX document = DocX.Load(templatePath))
                {
                    // Thay thế các placeholder bằng dữ liệu thực tế
                    document.ReplaceText("{TenTacGia}", data.Author);
                    document.ReplaceText("{TenFile}", Path.GetFileName(SimilarSentences[1].targetFilePath));
                    document.ReplaceText("{ThoiGianBatDau}", beginStart.ToString("dd/MM/yyyy HH:mm:ss"));
                    document.ReplaceText("{ThoiGianKetThuc}", endStart.ToString("dd/MM/yyyy HH:mm:ss"));
                    document.ReplaceText("{FileTuongDong}", Path.GetFileName(SimilarSentences[1].baseFilePath));
                    document.ReplaceText("{TyLeTuongDong}", ((float)(SimilarSentences[1].Item2 * 100)).ToString("0.00") + "%");
                    var duplicate = "";
                    foreach (var item in SimilarSentences[1].Item1)
                    {
                        duplicate += $"{item}\n";
                    }
                    document.ReplaceText("{DoanVanTrungLap}", duplicate);

                    // Lưu ra file mới
                    document.SaveAs(tempDocxPath);
                }
                var convertApi = new ConvertApi(_configuration.GetSection("File").GetValue<string>("secretConvertApi"));
                var conversionResult = await convertApi.ConvertAsync("docx", "pdf",
                    new ConvertApiFileParam("File", tempDocxPath)
                );

                await conversionResult.SaveFilesAsync(tempPDFPath);

                // Xóa file tạm
                System.IO.File.Delete(tempDocxPath);
                string fileUrl = Path.Combine(tempPDFPath, ExtensionFile.GetFileNameWithoutExtension(Path.GetFileName(SimilarSentences[1].targetFilePath)) + ".pdf");
                var memory = new MemoryStream();
                await using (var stream = new FileStream(fileUrl, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                return memory;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


    }
}
