using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dualback.Domain.Entities;

namespace dualback.Domain.Concrete
{
    public class EFDbContext : DbContext
    {
        public DbSet<Score> Scores { get; set; }
    }
}
