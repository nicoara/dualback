using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dualback.Domain.Entities
{
    public class Score
    {
        [Key] 
        public int          s_ID { get; set; }

        public int          s_Level { get; set; }
        public int          s_Matches { get; set; }
        public int          s_DetectedAudio { get; set; }
        public int          s_DetectedAudioWrong { get; set; }
        public int          s_DetectedVideo { get; set; }
        public int          s_DetectedVideoWrong { get; set; }
        public int          s_Percent { get; set; }
        public DateTime     s_Timestamp { get; set; }
        public string       s_Comment { get; set; }



    }
}
