using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class ProjectsTeachersStudentsRegisterModel
    {
        public long? IdTeacher { get; set; }
        public long? IdStudent { get; set; }
        public long? IdProject { get; set; }
        public long? IdProjectBatch { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
    }
}
