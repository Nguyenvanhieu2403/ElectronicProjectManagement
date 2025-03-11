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
    }
}
