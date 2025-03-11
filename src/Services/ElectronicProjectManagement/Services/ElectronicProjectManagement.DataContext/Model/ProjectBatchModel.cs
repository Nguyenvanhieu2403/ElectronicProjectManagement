using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class ProjectBatchModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public List<int?>? IdTeacher { get; set; }
        public string? IdTeachers { get; set; }
        public List<int?>? IdStudent { get; set; }   
        public string? IdStudents { get; set; }
        public string? IdProjetc { get; set; }
        public List<int?>? IdProjetcs { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
        public byte? Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public long? CreateBy { get; set; }
        public DateTime? Modified { get; set; }
        public long? ModifiedBy { get; set; }
    }
}
