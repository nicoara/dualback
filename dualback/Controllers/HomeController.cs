using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using dualback.Domain;
using System.Web.Mvc;
using System.Web.Script.Serialization;
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
