using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Castle.Core.Logging;
using Castle.Windsor;
using Reviewer.Web.Mvc.Common.Factories;
using Reviewer.Web.Mvc.Common.Filters;
using Reviewer.Web.Mvc.IoC;

namespace Reviewer.Web.Mvc
{
    using WebApiContrib.IoC.CastleWindsor;

    /// <summary>
    ///     Class hosting the MVC Application.
    /// </summary>
    public class MvcApplication : HttpApplication
    {
        #region Static Fields

        /// <summary>
        ///     References an IWindsorContainer
        /// </summary>
        public static IWindsorContainer Container;

        #endregion

        #region Methods

        /// <summary>
        ///     Raised on Application BeginRequest
        /// </summary>
        protected void Application_BeginRequest()
        {

        }

        /// <summary>
        ///     Raised on Application EndRequest
        /// </summary>
        protected void Application_EndRequest()
        {

        }

        /// <summary>
        ///     Raised on Application Start
        /// </summary>
        protected void Application_Start()
        {
           
            // Disable SSL Check for use on Development machines.
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            ////#endif
            Bootstrapper.ConfigureAutoMapper();

            Container = Bootstrapper.InitializeWindsor();

            var logger = Container.Resolve<ILogger>();

            logger.Info("Application starting.");

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            ControllerBuilder.Current.SetControllerFactory(new WindsorControllerFactory(Container));

            // GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator), new WindsorCompositionRoot(container));
            GlobalConfiguration.Configuration.DependencyResolver = new WindsorResolver(Container);

            FilterProviders.Providers.Clear();
            FilterProviders.Providers.Add(new WindsorFilterAttributeFilterProvider(Container));

            AreaRegistration.RegisterAllAreas();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        #endregion
    }
}