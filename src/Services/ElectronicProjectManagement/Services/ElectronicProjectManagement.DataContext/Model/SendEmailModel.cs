using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class SendEmailModel
    {
        public string? StudentEmail { get; set; }
        public string? StudentName { get; set; }
        public string? ProjectTitle { get; set; }
        public string? SupervisorName { get; set; }
        public string? SupervisorEmail { get; set; }
    }
}
