using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class ProjectBatch
    {
        public string Name { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? TotalTeacher { get; set; }
        public int? TotalStudent { get; set; }
        public int? IdProjetcs { get; set; }
    }
}
