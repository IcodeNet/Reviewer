
using System.Web.Mvc;
using AttributeRouting.Web.Http;

namespace Reviewer.Web.Mvc.Controllers.MVC
{
    /// <summary>
    ///     The operations controller.
    /// </summary>
    public class DisplayController : Controller
    {
        #region Public Methods and Operators

      
        [HttpGet]
        [GET("display/reports")]
        public ActionResult Reports()
        {
            return this.View();
        }

        #endregion
    }
}