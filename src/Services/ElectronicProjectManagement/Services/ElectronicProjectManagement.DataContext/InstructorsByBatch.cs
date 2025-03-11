using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class InstructorsByBatch
    {
        public long IdProjectBatch { get; set; }
        public int? IdTeacher { get; set; }
        public int? IdStudent { get; set; }
        public int? IdProjetcs { get; set; }
    }
}
