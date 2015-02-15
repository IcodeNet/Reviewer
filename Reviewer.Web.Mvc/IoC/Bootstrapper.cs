

using Castle.Facilities.Logging;
using Castle.MicroKernel;
using Castle.Windsor;
using Castle.Windsor.Installer;
using Castle.Windsor.Proxy;
using Reviewer.Web.Mvc.IoC.Installers;

namespace Reviewer.Web.Mvc.IoC
{
    /// <summary>
    ///     Bootstrapper class to set up Castle Windsor and AutoMapper.
    /// </summary>
    public static class Bootstrapper
    {
        #region Public Methods and Operators

        /// <summary>
        ///     Configures the static AutoMapper with custom maps.
        /// </summary>
        public static void ConfigureAutoMapper()
        {
        }

        /// <summary>
        ///     Returns a new IWindsorContainer which has been fully initialized.
        /// </summary>
        /// <returns>a new IWindsorContainer</returns>
        public static IWindsorContainer InitializeWindsor()
        {
            var container =
                new WindsorContainer(
                    new DefaultKernel(new InlineDependenciesPropagatingDependencyResolver(), new DefaultProxyFactory()),
                    new DefaultComponentInstaller());

            container.AddFacility<LoggingFacility>(f => f.UseLog4Net().WithAppConfig());

            container.Install(new InterceptorInstaller());

            container.Install(new ServicesInstaller());
            container.Install(new ControllerInstaller());

            return container;
        }

        #endregion
    }
}