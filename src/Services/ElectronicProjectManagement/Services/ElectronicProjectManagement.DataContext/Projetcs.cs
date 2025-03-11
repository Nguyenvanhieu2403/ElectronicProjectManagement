using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class Projects
    {
        public int Topic { get; set; }
        public string? TopicName { get; set; }
        public string? UnitName { get; set; }
        public string Name { get; set; }
    }
}
