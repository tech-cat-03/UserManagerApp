using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace UserManagerApp.Server.Models
{ 
    public class DBContext:DbContext
    {
        public DBContext(DbContextOptions<DBContext> options):base(options)
        {
            
        }
        public DbSet<PUser> Users { get; set; }
    }
}