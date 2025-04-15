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
using Dapper;
using System.Data;
using Z.Dapper.Plus;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using VnPostLib.Common.Helpers;
using System.Reflection;
using DocumentFormat.OpenXml.Spreadsheet;

namespace ElectronicProjectManagement.Repository
{
    public class ProjectBatchRepos : BaseRepos<ProjectBatch>, IProjectBatchRepos
    {
        private readonly IConfiguration _configuration;

        public ProjectBatchRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult> CreateProjectBatch(ProjectBatchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                //using var transaction = connection.BeginTransaction(); // Bắt đầu transaction

                await connection.ExecuteAsync(@"
                        UPDATE EPM.ProjectBatch 
                        SET Status = 2, Modified = @Modified, ModifiedBy = @ModifiedBy",
                        new { Modified = DateTime.Now, ModifiedBy = model.ModifiedBy });

                await connection.ExecuteAsync(@"
                        UPDATE EPM.ProjectsTeachersStudents 
                        SET Status = 2, Modified = @Modified, ModifiedBy = @ModifiedBy",
                        new { Modified = DateTime.Now, ModifiedBy = model.ModifiedBy });

                var listData = new List<ProjectBatch>
                {
                    new()
                    {
                        Name = model.Name,
                        BeginDate = model.BeginDate,
                        EndDate = model.EndDate,
                        Status = model.Status,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };

                // Insert vào bảng ProjectBatch
                await connection.BulkInsertAsync(listData);

                // Lấy ID vừa chèn
                var lastInsertedId = await connection.ExecuteScalarAsync<int>("SELECT MAX(Id) FROM EPM.ProjectBatch");


                // Danh sách lưu instructors (sinh viên & giảng viên)
                var listInstructorsByBatch = new List<InstructorsByBatch>();

                if (model.IdStudent?.Any() == true)
                {
                    await connection.ExecuteAsync(@"
                        UPDATE EPM.InstructorsByBatch 
                        SET Status = 2, Modified = @Modified, ModifiedBy = @ModifiedBy 
                        WHERE IdStudent IN @IdStudents",
                        new { IdStudents = model.IdStudent, Modified = DateTime.Now, ModifiedBy = model.ModifiedBy });
                }

                if (model.IdTeacher?.Any() == true)
                {
                    await connection.ExecuteAsync(@"
                        UPDATE EPM.InstructorsByBatch 
                        SET Status = 2, Modified = @Modified, ModifiedBy = @ModifiedBy 
                        WHERE IdTeacher IN @IdTeachers",
                        new { IdTeachers = model.IdTeacher, Modified = DateTime.Now, ModifiedBy = model.ModifiedBy });
                }

                if (model.IdProjetcs?.Any() == true)
                {
                    await connection.ExecuteAsync(@"
                        UPDATE EPM.InstructorsByBatch 
                        SET Status = 2, Modified = @Modified, ModifiedBy = @ModifiedBy 
                        WHERE IdProjetcs IN @IdProjetcs",
                        new { IdProjetcs = model.IdProjetcs, Modified = DateTime.Now, ModifiedBy = model.ModifiedBy });
                }

                // Thêm danh sách sinh viên (nếu có)
                if (model.IdStudent?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdStudent.Select(studentId => new InstructorsByBatch
                    {
                        IdProjectBatch = lastInsertedId,
                        IdStudent = studentId,
                        IdTeacher = null,
                        IdProjetcs = null,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                // Thêm danh sách giáo viên (nếu có)
                if (model.IdTeacher?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdTeacher.Select(teacherId => new InstructorsByBatch
                    {
                        IdProjectBatch = lastInsertedId,
                        IdTeacher = teacherId,
                        IdStudent = null,
                        IdProjetcs = null,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                if (model.IdProjetcs?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdProjetcs.Select(IdProjetcs => new InstructorsByBatch
                    {
                        IdProjectBatch = lastInsertedId,
                        IdTeacher = null,
                        IdStudent = null,
                        IdProjetcs = IdProjetcs,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                // Nếu danh sách có dữ liệu thì chèn vào bảng InstructorsByBatch
                if (listInstructorsByBatch.Any())
                {
                    await connection.BulkInsertAsync(listInstructorsByBatch);
                }

                //transaction.Commit(); // Commit transaction nếu mọi thứ thành công

                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }


        public async Task<MethodResult> DeleteProjectBatch(long id)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                await connection.ExecuteAsync(" UPDATE EPM.InstructorsByBatch  set Status = 2 WHERE IdProjectBatch = @Id", new { Id = id });
                await connection.ExecuteAsync("Update EPM.ProjectBatch set Status = 2 WHERE Id = @Id", new { Id = id });
                return MethodResult.ResultWithSuccess("Delete success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        private async Task<DataTable> ExportExcelToDataTable(ProjectBatchSearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.GetProjectBatchExcel", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Keyword", (model.Keyword ?? ""));
                    command.Parameters.AddWithValue("@BeginDate", model.BeginDate ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@EndDate", model.EndDate ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@isDesc", model.IsDesc);
                    command.Parameters.AddWithValue("@orderCol", model.OrderCol);
                    command.Parameters.AddWithValue("@status", model.Status);
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

        public async Task<MemoryStream> ExportExcel(ProjectBatchSearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ProjectBatchReport.xlsx"); ;

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:G" + (result.Rows.Count + 6).ToString()];
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

        public async Task<MethodResult<ProjectBatchModel>> GetProjectBatchById(long id)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Id", id);
                var data = await connection.QueryFirstOrDefaultAsync<ProjectBatchModel>("EPM.GetProjectBatchById", parameters, commandType: CommandType.StoredProcedure);
                data.IdTeacher = !string.IsNullOrEmpty(data.IdTeachers?.ToString())
                    ? JsonSerializer.Deserialize<List<int?>>(data.IdTeachers.ToString())
                    : new List<int?>();

                data.IdStudent = !string.IsNullOrEmpty(data.IdStudents?.ToString())
                    ? JsonSerializer.Deserialize<List<int?>>(data.IdStudents.ToString())
                    : new List<int?>();

                data.IdProjetcs = !string.IsNullOrEmpty(data.IdProjetc?.ToString())
                    ? JsonSerializer.Deserialize<List<int?>>(data.IdProjetc.ToString())
                    : new List<int?>();
                return MethodResult<ProjectBatchModel>.ResultWithData(data, "SUCCESS", 1);
            }
            catch (Exception ex)
            {
                return MethodResult<ProjectBatchModel>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectBatch>>> GetsAllProjectBatch()
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                var data = await connection.QueryAsync<ProjectBatch>("EPM.GetAllProjectBatch",  commandType: CommandType.StoredProcedure);
                return MethodResult<List<ProjectBatch>>.ResultWithData(data.ToList(), "", 0);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectBatch>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectBatch>>> GetsProjectBatchBySearch(ProjectBatchSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Keyword", model.Keyword);
                parameters.Add("@BeginDate", model.BeginDate);
                parameters.Add("@EndDate", model.EndDate);
                parameters.Add("@isDesc", model.IsDesc);
                parameters.Add("@orderCol", model.OrderCol ?? "Id");
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                parameters.Add("@status", model.Status);

                var data = await connection.QueryAsync<ProjectBatch>("EPM.GetProjectBatchBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetProjectBatchBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectBatch>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectBatch>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectBatchUserModel>>> GetsProjectBatchUserByProjectBatchId(ProjectBatchUserSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Id", model.id);
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                string storeName = model.Type == 1 ?  "EPM.GetProjectBatchTeacherByProjectBatchId" : "EPM.GetProjectBatchStudentByProjectBatchId";
                string storeNameCount = model.Type == 1 ? "EPM.GetProjectBatchTeacherByProjectBatchId_Count" : "EPM.GetProjectBatchStudentByProjectBatchId_Count";
                var data = await connection.QueryAsync<ProjectBatchUserModel>(storeName, parameters, commandType: CommandType.StoredProcedure);
                int totalRecord = await connection.ExecuteScalarAsync<int>(storeNameCount, parameters, commandType: CommandType.StoredProcedure);
                return MethodResult<List<ProjectBatchUserModel>>.ResultWithData(data.ToList(), "SUCCESS", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectBatchUserModel>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult> UpdateProjectBatch(ProjectBatchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                //using var transaction = connection.BeginTransaction(); // Bắt đầu transaction
                var listData = new List<ProjectBatch>
                {
                    new()
                    {
                        Id = model.Id,
                        Name = model.Name,
                        BeginDate = model.BeginDate,
                        EndDate = model.EndDate,
                        Status = model.Status,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                // Update vào bảng ProjectBatch
                await connection.BulkUpdateAsync(listData);
                // Xóa dữ liệu cũ trong bảng InstructorsByBatch
                await connection.ExecuteAsync("DELETE FROM EPM.InstructorsByBatch WHERE IdProjectBatch = @Id", new { Id = model.Id });
                // Danh sách lưu instructors (sinh viên & giảng viên)
                var listInstructorsByBatch = new List<InstructorsByBatch>();
                // Thêm danh sách sinh viên (nếu có)
                if (model.IdStudent?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdStudent.Select(studentId => new InstructorsByBatch
                    {
                        IdProjectBatch = model.Id,
                        IdStudent = studentId,
                        IdTeacher = null,
                        IdProjetcs = null,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }
                // Thêm danh sách giáo viên (nếu có)
                if (model.IdTeacher?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdTeacher.Select(teacherId => new InstructorsByBatch
                    {
                        IdProjectBatch = model.Id,
                        IdTeacher = teacherId,
                        IdStudent = null,
                        IdProjetcs = null,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                if (model.IdProjetcs?.Any() == true)
                {
                    listInstructorsByBatch.AddRange(model.IdProjetcs.Select(IdProjetcs => new InstructorsByBatch
                    {
                        IdProjectBatch = model.Id,
                        IdTeacher = null,
                        IdStudent = null,
                        IdProjetcs = IdProjetcs,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }
                // Nếu danh sách có dữ liệu thì chèn vào bảng InstructorsByBatch
                if (listInstructorsByBatch.Any())
                {
                    await connection.BulkInsertAsync(listInstructorsByBatch);
                }
                //transaction.Commit(); // Commit transaction nếu mọi thứ thành công
                return MethodResult.ResultWithSuccess("Update success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }
    }
}
