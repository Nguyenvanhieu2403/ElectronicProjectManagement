using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Dtos
{
    public class DashboardTotal
    {
        public int NotRegisteredInstructor { get; set; }
        public int RegisteredInstructor { get; set; }
        public int Approve { get; set; }
        public int NotYetApprove { get; set; }
    }
}
