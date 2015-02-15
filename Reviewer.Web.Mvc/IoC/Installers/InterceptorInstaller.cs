using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Reviewer.Web.Mvc.Common.Interceptors;

namespace Reviewer.Web.Mvc.IoC.Installers
{
    /// <summary>
    ///     Castle Installer to add Interceptors to the Container.
    /// </summary>
    public class InterceptorInstaller : IWindsorInstaller
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
                Component.For<ProfilingInterceptor>().LifestyleTransient(), 
                Component.For<MemoryCacheInterceptor>().LifestyleSingleton(), 
                Component.For<LoggingInterceptor>().LifestyleSingleton(), 
                Component.For<ExceptionInterceptor>().LifestyleSingleton());
        }

        #endregion
    }
}