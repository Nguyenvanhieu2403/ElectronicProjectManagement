using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Base.Interfaces;

namespace ElectronicProjectManagement.DataContext
{
    public partial class ThesisDefence : IBaseModel
    {
        [Key]
        public long Id { get; set; }
        public byte? Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public long? CreateBy { get; set; }
        public DateTime? Modified { get; set; }
        public long? ModifiedBy { get; set; }   
    }
}
