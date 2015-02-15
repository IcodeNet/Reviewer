
using System;
using System.ServiceModel;
using System.Web;
using Castle.Facilities.WcfIntegration;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Core.Common.Contracts;
using Reviewer.Web.Mvc.Common.Facilities;
using Reviewer.Web.Mvc.IoC.Wcf;
using Castle.Windsor;

namespace Reviewer.Web.Mvc.IoC.Installers
{
    /// <summary>
    ///     Castle Installer to add Services to the Container.
    /// </summary>
    public class ServicesInstaller : IWindsorInstaller
    {
        #region Public Methods and Operators

        /// <summary>
        ///     Install method.
        /// </summary>
        /// <param name="container">
        ///     Container to modify.
        /// </param>
        /// <param name="store">
        ///     Configuration store to interrogate.
        /// </param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.AddFacility<WcfFacility>();
            container.AddFacility<WcfSessionFacility>();


        }

        #endregion

        #region Methods

       

        /// <summary>
        ///     Creates a ComponentRegistration of T as a WcfClient.
        /// </summary>
        /// <typeparam name="T">
        ///     Type of Service
        /// </typeparam>
        /// <param name="serviceUri">
        ///     URI of Service
        /// </param>
        /// <returns>
        ///     Component Registration
        /// </returns>
        private static ComponentRegistration<T> RegisterWcfClientComponentBasicHttp<T>(string serviceUri)
            where T : class
        {
            return
                Component.For<T>()
                    .AsWcfClient(
                        new DefaultClientModel
                        {
                            Endpoint =
                                WcfEndpoint.BoundTo(new BasicHttpBinding("Default"))
                                .At(new EndpointAddress(serviceUri))
                                .AddExtensions(new MaxObjectsInGraphBehavior())
                        })
                    .LifestylePerWebRequest();
        }

        /// <summary>
        ///     Creates a ComponentRegistration of T as a WcfClient.
        /// </summary>
        /// <typeparam name="T">
        ///     Type of Service
        /// </typeparam>
        /// <param name="serviceUri">
        ///     URI of Service
        /// </param>
        /// <returns>
        ///     Component Registration
        /// </returns>
        private static ComponentRegistration<T> RegisterWcfClientComponentNetTcp<T>(string serviceUri) where T : class
        {
            return
                Component.For<T>()
                    .AsWcfClient(
                        new DefaultClientModel
                        {
                            Endpoint =
                                WcfEndpoint.BoundTo(new NetTcpBinding("Default"))
                                .At(new EndpointAddress(serviceUri))
                        })
                    .LifestylePerWebRequest();
        }

        #endregion
    }
}