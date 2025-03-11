using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class InstructorsByBatchModel
    {
        public int Id { get; set; }
        public long IdUser { get; set; }
        public string Department { get; set; }
    }
}
