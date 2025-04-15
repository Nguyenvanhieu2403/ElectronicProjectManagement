using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Dtos
{
    public class ProjectStatisticsByTopic
    {
        public string Topic { get; set; }
        public int ProjectCount { get; set; }
    }
}
