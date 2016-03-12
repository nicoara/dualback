using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using dualback.Domain;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using dualback.Domain.Abstract;
using dualback.Domain.Entities;
using dualback.Infrastructure;

namespace dualback.Controllers 
{
    public class HomeController : Controller
    {
        private IScoreRepository repositoryScore;

        public HomeController(IScoreRepository scoreRepository)
        {
            this.repositoryScore = scoreRepository;
        }

        public ActionResult Index()
        {
            //set level
            List<Score> lstLastScores = repositoryScore.Scores
                .OrderByDescending(s => s.s_Timestamp)
                .Take(3).ToList();
            if (lstLastScores[0].s_Percent >= 50)
            {
                ViewBag.Level = lstLastScores[0].s_Level + 1;
            }
            else
            {
                //if i was at the same level last three tries and all scores were below 30% then drop a level
                bool dropLevel = lstLastScores[0].s_Level == lstLastScores[1].s_Level &&
                                  lstLastScores[0].s_Level == lstLastScores[2].s_Level &&
                                  lstLastScores[0].s_Percent < 30 &&
                                  lstLastScores[1].s_Percent < 30 &&
                                  lstLastScores[2].s_Percent < 30;
                if (dropLevel)
                {
                    ViewBag.Level = lstLastScores[0].s_Level - 1;
                }
                else
                {
                    ViewBag.Level = lstLastScores[0].s_Level;
                }   
            }
            

            return View();
        }

        [HttpPost]
        public ActionResult SaveScore(Score score)
        {
            repositoryScore.SaveScore(score);

            return RedirectToAction("Index", "Home");
        }

    }
}
