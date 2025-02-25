using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class ReferencesFileModel
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string DocumentType { get; set; }
        public DateTime YearPublication { get; set; }
        public string? FileName { get; set; }
        public string? Path { get; set; }
        public string? Description { get; set; }
        public string Field { get; set; }
        public byte? Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public long? CreateBy { get; set; }
        public DateTime? Modified { get; set; }
        public long? ModifiedBy { get; set; }
    }
}
