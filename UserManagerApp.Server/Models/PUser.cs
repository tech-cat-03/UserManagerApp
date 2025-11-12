using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace UserManagerApp.Server.Models
{
    public class PUser
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName ="nvarchar(50)")]
        public string UserName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string FullName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Phone { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Language { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Culture { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Password { get; set; }
    }
}
