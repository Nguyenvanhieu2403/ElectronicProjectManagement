using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using ElectronicProjectManagement.DataContext.Model;

namespace ElectronicProjectManagement.Repository.Common
{
    public class SendEmail
    {
        public static void SendApprovalEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Đề Tài Đồ Án Của Bạn Đã Được Phê Duyệt";
            string body = $"""
                Kính gửi {model.StudentName},
        
                Chúng tôi xin thông báo rằng đề tài đồ án của bạn với tiêu đề "{model.ProjectTitle}" đã được hội đồng phê duyệt. Bạn có thể bắt đầu thực hiện theo kế hoạch đã đề ra.
        
                Vui lòng liên hệ với giảng viên hướng dẫn của bạn, {model.SupervisorName}, để được hỗ trợ trong quá trình thực hiện đồ án.
        
                Trân trọng,
                Hội đồng xét duyệt đồ án
            """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendRegistrationSuccessEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Đăng Ký Đồ Án Tốt Nghiệp Thành Công";
            string body = $"""
                Kính gửi {model.StudentName},
        
                Chúc mừng bạn đã đăng ký thành công đồ án tốt nghiệp với đề tài "{model.ProjectTitle}". Đề tài của bạn sẽ do {model.SupervisorName} hướng dẫn.
        
                Vui lòng liên hệ với giảng viên hướng dẫn để nhận thêm thông tin và kế hoạch thực hiện.
        
                Chúc bạn hoàn thành tốt đồ án của mình!
        
                Trân trọng,
                Hội đồng xét duyệt đồ án
                """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendLecturerRegistrationSuccessEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Đăng Ký Hướng Dẫn Đồ Án Thành Công";
            string body = $"""
            Kính gửi {model.SupervisorName},
        
            Chúng tôi xin thông báo rằng bạn đã được phân công làm giảng viên hướng dẫn cho sinh viên {model.StudentName} ".
        
            Vui lòng liên hệ với sinh viên để hướng dẫn và theo dõi tiến độ thực hiện.
        
            Trân trọng,
            Hội đồng xét duyệt đồ án
            """;

            string studentBody = $"""
            Kính gửi {model.StudentName},
        
            Chúng tôi xin thông báo rằng bạn đã đăng ký thành công giảng viên hướng dẫn, giảng viên hướng dẫn của bạn là {model.SupervisorName}.
        
            Vui lòng liên hệ với giảng viên để nhận thêm thông tin và kế hoạch thực hiện.
        
            Chúc bạn hoàn thành tốt đồ án của mình!
        
            Trân trọng,
            Hội đồng xét duyệt đồ án
            """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.SupervisorEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);

                    MailMessage studentMail = new MailMessage();
                    studentMail.From = new MailAddress(fromEmail);
                    studentMail.To.Add(model.StudentEmail);
                    studentMail.Subject = subject;
                    studentMail.Body = studentBody;
                    studentMail.IsBodyHtml = false;
                    client.Send(studentMail);

                    Console.WriteLine("Email đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendProjectRejectionEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Đề Tài Đồ Án Không Được Phê Duyệt";
            string body = $"""
            Kính gửi {model.StudentName},
        
            Chúng tôi xin thông báo rằng đề tài đồ án tốt nghiệp "{model.ProjectTitle}" của bạn không được phê duyệt.
        
            Vui lòng chọn một đề tài khác hoặc đề xuất lại một đề tài mới phù hợp hơn.
        
            Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với giảng viên hướng dẫn để biết thêm chi tiết.
        
            Trân trọng,
            Hội đồng xét duyệt đồ án
            """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email từ chối đề tài đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendPlagiarismCheckEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Kết Quả Kiểm Tra Đạo Văn Đồ Án";

            string body = $"""
                Kính gửi {model.SupervisorName} và {model.StudentName},
        
                Chúng tôi xin thông báo rằng quá trình kiểm tra đạo văn cho đề tài "{model.ProjectTitle}" đã hoàn tất.
        
                - File cần kiểm tra: {model.CheckedFile}
                - File đối chiếu: {model.ReferenceFile}
                - Tỷ lệ đạo văn: {model.PlagiarismRate}%
                - Thời gian so sánh: {model.TimeCheck} ms
                - Các đoạn văn bản trùng lặp: "{model.ContentDuplicated}"
        
                Vui lòng xem xét kết quả và có phương án điều chỉnh nếu cần thiết. Nếu tỷ lệ đạo văn vượt quá mức cho phép, sinh viên cần chỉnh sửa lại nội dung để đảm bảo tính trung thực và tuân thủ quy định của nhà trường.
        
                Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với hội đồng để được hỗ trợ.
        
                Trân trọng,
                Hội đồng xét duyệt đồ án
                """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.SupervisorEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email kết quả kiểm tra đạo văn đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendProjectSubmissionEmail(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            var submissionDate = DateTime.Now;

            string subject = "Thông Báo: Xác Nhận Nộp Đồ Án Tốt Nghiệp";

            string body = $"""
                Kính gửi {model.SupervisorName} và {model.StudentName},
        
                Chúng tôi xin thông báo rằng sinh viên {model.StudentName} đã hoàn tất việc nộp đồ án tốt nghiệp với thông tin sau:
        
                - Đề tài: {model.ProjectTitle}
                - Ngày nộp: {submissionDate:dd/MM/yyyy HH:mm:ss}
        
                Vui lòng kiểm tra và xác nhận. Nếu có bất kỳ yêu cầu bổ sung nào, xin hãy phản hồi sớm nhất có thể.
        
                Trân trọng,
                Hội đồng xét duyệt đồ án
                """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.SupervisorEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email xác nhận nộp đồ án đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendApprovalOrRejectionEmail(SendEmailModel model, Boolean isApproved)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = isApproved ? "Thông Báo: Đồ Án Đã Được Phê Duyệt" : "Thông Báo: Đồ Án Bị Từ Chối";

            string body = isApproved ?
                $"""
                Kính gửi {model.SupervisorName} và {model.StudentName},
            
                Chúng tôi xin thông báo rằng đề tài "{model.ProjectTitle}" đã được PHÊ DUYỆT.
            
                Sinh viên có thể tiến hành thực hiện đồ án theo kế hoạch.
            
                Trân trọng,
                Hội đồng xét duyệt đồ án
                """ :
                    $"""
                Kính gửi {model.SupervisorName} và {model.StudentName},
            
                Chúng tôi xin thông báo rằng đề tài "{model.ProjectTitle}" đã bị TỪ CHỐI.
            
                Lý do từ chối: {model.Reason}
            
                Vui lòng điều chỉnh hoặc đề xuất đề tài mới và nộp lại để hội đồng xem xét.
            
                Trân trọng,
                Hội đồng xét duyệt đồ án
            """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.SupervisorEmail);
                    mailMessage.To.Add(model.StudentEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email thông báo phê duyệt/từ chối đồ án đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public static void SendDefenseNotification(SendEmailModel model)
        {
            string fromEmail = "nguyenvanhieu2422003@gmail.com"; // Email của bạn
            string fromPassword = "petd buab wytk bzjh"; // Mật khẩu email

            string subject = "Thông Báo: Lịch Bảo Vệ Đồ Án";

            // Tạo danh sách giảng viên
            string lecturerList = "";
            foreach (var lecturer in model.Teachers)
            {
                lecturerList += $"- {lecturer.Name} ({lecturer.Email})\n";
            }

            // Nội dung email
            string body = $"""
            Kính gửi Hội đồng bảo vệ và sinh viên {model.StudentName},

            Chúng tôi xin thông báo về lịch bảo vệ đồ án của sinh viên {model.StudentName} như sau:

            🔹 **Đợt bảo vệ:** {model.ThesisDefenceName}
            📅 **Thời gian:** {model.StartTime:dd/MM/yyyy HH:mm} - {model.EndTime:dd/MM/yyyy HH:mm}
            🏫 **Phòng bảo vệ:** {model.Location}

            🔹 **Hội đồng bảo vệ:**
            {lecturerList}

            Vui lòng có mặt đúng giờ để buổi bảo vệ diễn ra thuận lợi.

            Trân trọng,  
            Hội đồng bảo vệ đồ án
            """;

            try
            {
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // SMTP của Gmail
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(model.StudentEmail);

                    // Gửi cho từng giảng viên
                    foreach (var lecturer in model.Teachers)
                    {
                        mailMessage.To.Add(lecturer.Email);
                    }

                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = false;

                    client.Send(mailMessage);
                    Console.WriteLine("Email thông báo lịch bảo vệ đồ án đã được gửi thành công!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }
    }
}
