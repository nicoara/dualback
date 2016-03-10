using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dualback.Domain.Abstract;
using dualback.Domain.Entities;

namespace dualback.Domain.Concrete
{
    public class EFScoreRepository : IScoreRepository
    {
        private EFDbContext context = new EFDbContext();

        public IQueryable<Score> Scores
        {
            get { return context.Scores; }
        }

        public int SaveScore(Score score)
        {
            Score submittedScore = new Score
            {
                s_Level = score.s_Level,
                s_Matches = score.s_Matches,
                s_DetectedAudio = score.s_DetectedAudio,
                s_DetectedAudioWrong = score.s_DetectedAudioWrong,
                s_DetectedVideo = score.s_DetectedVideo,
                s_DetectedVideoWrong = score.s_DetectedVideoWrong,
                s_Percent = score.s_Percent,
                s_Timestamp = DateTime.Now,
            };
            context.Scores.Add(submittedScore);
            context.SaveChanges();
            return submittedScore.s_ID;
        }
    }
}
