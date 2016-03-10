using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dualback.Domain.Entities;

namespace dualback.Domain.Abstract
{
    public interface IScoreRepository
    {
        IQueryable<Score> Scores { get; }

        int SaveScore(Score score);
    }
}
