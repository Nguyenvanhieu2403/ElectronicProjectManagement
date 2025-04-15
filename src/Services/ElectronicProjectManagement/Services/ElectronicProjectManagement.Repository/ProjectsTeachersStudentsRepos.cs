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
using ElectronicProjectManagement.Repository.Common;
using Microsoft.Data.SqlClient;
using VnPostLib.Common.Helpers;
using System.Reflection;

namespace ElectronicProjectManagement.Repository
{
    public class ProjectsTeachersStudentsRepos : BaseRepos<ProjectsTeachersStudents>, IProjectsTeachersStudentsRepos
    {
        private readonly IConfiguration _configuration;

        public ProjectsTeachersStudentsRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult<List<ProjectsTeachersStudents>>> GetsProjectForStudentRegister(SearchModel model)
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

                var data = await connection.QueryAsync<ProjectsTeachersStudents>("EPM.GetsProjectForStudentRegister", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetsProjectForStudentRegister_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectsTeachersStudents>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectsTeachersStudents>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectsTeachersStudents>>> GetsProjectsTeachersStudentsBySearch(SearchModel model)
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

                var data = await connection.QueryAsync<ProjectsTeachersStudents>("EPM.GetProjectsTeachersStudentsBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetProjectsTeachersStudentsBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectsTeachersStudents>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectsTeachersStudents>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectBatchUserModel>>> GetStudentRegister(ProjectsTeachersStudentsRegisterModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdTeacher", model.IdTeacher);
                parameters.Add("@IdProjectBatch", model.IdProjectBatch);
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                var data = await connection.QueryAsync<ProjectBatchUserModel>("EPM.GetStudentRegister", parameters, commandType: CommandType.StoredProcedure);
                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetStudentRegister_Count", parameters, commandType: CommandType.StoredProcedure);
                return MethodResult<List<ProjectBatchUserModel>>.ResultWithData(data.ToList(), "SUCCESS", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectBatchUserModel>>.ResultWithError(ex.Message, 400);
            }
        }

        private async Task<DataTable> ExportExcelProjectsTeachersStudentsToDataTable(SearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.GetProjectsTeachersStudentsExportExcel", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Keyword", (model.Keyword ?? ""));
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

        public async Task<MemoryStream> ProjectsTeachersStudentsExportExcel(SearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelProjectsTeachersStudentsToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ProjectsTeachersStudentsReport.xlsx"); ;

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:E" + (result.Rows.Count + 6).ToString()];
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

        public async Task<MethodResult> RegisterProjects(ProjectsTeachersStudents model)
        {
            try
            {

                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdStudent", model.IdStudent);

                var data = await connection.QueryAsync<ProjectsTeachersStudents>("EPM.CheckStudentRegisterProject", parameters, commandType: CommandType.StoredProcedure);
                if (data.Count() < 1)
                {
                    return MethodResult.ResultWithError("Sinh viên phải đăng ký giảng viên hướng dẫn trước");
                }

                if (data.Count() > 0 && data.FirstOrDefault().IdProject != null)
                {
                    return MethodResult.ResultWithError("Mỗi sinh viên chỉ được đăng ký 1 đề tài đồ án tốt nghiệp");
                }
                var parameters3 = new DynamicParameters();
                parameters3.Add("@IdProject", model.IdProject);
                parameters3.Add("@IdStudent", model.IdStudent);
                var dataUpdate = await connection.QueryFirstOrDefaultAsync<ProjectsTeachersStudents>("EPM.UpdateIdProjectForStudent", parameters3, commandType: CommandType.StoredProcedure);

                var parameters1 = new DynamicParameters();
                parameters1.Add("@IdStudent", model.IdStudent);
                var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);
                
                var parameters2 = new DynamicParameters();
                parameters2.Add("@IdProject", dataUpdate?.IdProject);
                var dataProject = await connection.QueryFirstOrDefaultAsync<Projects>("EPM.GetProjectSendEmailApproveTopic", parameters2, commandType: CommandType.StoredProcedure);

                connection.Close();
                if (dataUpdate?.IdProject != null)
                {
                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ProjectTitle = dataProject.Name,
                        SupervisorName = dataUserTeacher.DisplayName
                    };
                    SendEmail.SendRegistrationSuccessEmail(sendEmailModel);
                    return MethodResult.ResultWithSuccess("Updated success");
                }
                return MethodResult.ResultWithSuccess("Updated fail");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public async Task<MethodResult> RegisterTeachers(ProjectsTeachersStudents model)
        {
            try
            {

                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdProjectBatch", model.IdProjectBatch);
                parameters.Add("@IdTeacher", model.IdTeacher);
                parameters.Add("@IdStudent", model.IdStudent);

                var data = await connection.QueryAsync<ProjectsTeachersStudents>("EPM.GetProjectsTeachersStudentsByIdStudent", parameters, commandType: CommandType.StoredProcedure);
                if(data.Count() > 0)
                {
                    return MethodResult.ResultWithError("Mỗi sinh viên chỉ được đăng ký 1 giảng viên hướng dẫn");
                }
                var listData = new List<ProjectsTeachersStudents>
                {
                    new() {
                        IdProjectBatch = model.IdProjectBatch,
                        IdTeacher = model.IdTeacher,
                        IdStudent = model.IdStudent,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                var result = await connection.BulkInsertAsync(listData);

                var parameters1 = new DynamicParameters();
                parameters1.Add("@IdStudent", model.IdStudent);
                var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                connection.Close();

                SendEmailModel sendEmailModel = new SendEmailModel
                {
                    StudentEmail = dataUserStudent.Email,
                    StudentName = dataUserStudent.DisplayName,
                    SupervisorName = dataUserTeacher.DisplayName,
                    SupervisorEmail = dataUserTeacher.Email
                };
                SendEmail.SendLecturerRegistrationSuccessEmail(sendEmailModel);

                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }
    }
}
