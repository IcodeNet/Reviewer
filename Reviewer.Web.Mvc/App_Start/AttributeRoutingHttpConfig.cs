
using System.Web.Http;
using AttributeRouting.Web.Http.WebHost;
using Reviewer.Web.Mvc;
using WebActivator;

[assembly: PreApplicationStartMethod(typeof(AttributeRoutingHttpConfig), "Start")]

namespace Reviewer.Web.Mvc
{
    /// <summary>
    ///     The attribute routing http config.
    /// </summary>
    public static class AttributeRoutingHttpConfig
    {
        #region Public Methods and Operators

        /// <summary>
        /// The register routes.
        /// </summary>
        /// <param name="routes">
        /// The routes.
        /// </param>
        public static void RegisterRoutes(HttpRouteCollection routes)
        {
            // See http://github.com/mccalltd/AttributeRouting/wiki for more options.
            // To debug routes locally using the built in ASP.NET development server, go to /routes.axd
            routes.MapHttpAttributeRoutes();
        }

        /// <summary>
        ///     The start.
        /// </summary>
        public static void Start()
        {
            RegisterRoutes(GlobalConfiguration.Configuration.Routes);
        }

        #endregion
    }
}