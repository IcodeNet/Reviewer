
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Reviewer.Web.Mvc.Common.Interceptors;
using Reviewer.Web.Mvc.Common.Interceptors.Selectors;

namespace Reviewer.Web.Mvc.IoC.Installers
{
    /// <summary>
    ///     Castle Installer to add MVC Controllers to the Container.
    /// </summary>
    public class ControllerInstaller : IWindsorInstaller
    {
        #region Public Methods and Operators

        /// <summary>
        /// Install method.
        /// </summary>
        /// <param name="container">
        /// Container to modify.
        /// </param>
        /// <param name="store">
        /// Configuration store to interrogate.
        /// </param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                Types.FromAssembly(Assembly.GetExecutingAssembly())
                     .BasedOn<IController>()
                     .Configure(c => c.Named(c.Implementation.Name.ToLowerInvariant()))
                     .LifestyleTransient()
                     .Configure(
                         x =>
                         x.Interceptors(typeof(LoggingInterceptor), typeof(ExceptionInterceptor))
                          .SelectInterceptorsWith(new LoggingSelector())));
            
            container.Register(
               Classes.FromThisAssembly()
                   .BasedOn<IHttpController>()
                      .ConfigureFor<ApiController>(c => c.PropertiesRequire(pi => false))
                     .LifestyleTransient()
                     .Configure(
                         x =>
                         x.Interceptors(typeof(LoggingInterceptor), typeof(ExceptionInterceptor))
                          .SelectInterceptorsWith(new LoggingSelector())));
        }

        #endregion
    }
}