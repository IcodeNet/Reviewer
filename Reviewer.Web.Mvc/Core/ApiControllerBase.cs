
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security;
using System.ServiceModel;
using System.Web.Http;
using System.Web.Http.Filters;
using Common.Exceptions;
using Core.Common.Contracts;
using Reviewer.Web.Mvc.Extensions;

namespace Reviewer.Web.Mvc.Core
{
    /// <summary>
    ///     The controller base for all Web.API controllers.
    ///     It will have mainly two responsibilities.
    ///     One is to make sure that when the controller is
    /// </summary>
    public class ApiControllerBase : ApiController, IServiceAwareController
    {
        #region Fields

        /// <summary>
        ///     The _ disposable services.
        /// </summary>
        private List<IServiceContract> _disposableServices;

        #endregion

        #region Public Properties

        /// <summary>
        ///     Gets the disposable services.
        /// </summary>
        public List<IServiceContract> DisposableServices
        {
            get
            {
                if (this._disposableServices == null)
                {
                    this._disposableServices = new List<IServiceContract>();
                }

                return this._disposableServices;
            }
        }

        #endregion

        #region Explicit Interface Methods

        /// <summary>
        /// The register disposable services.
        /// </summary>
        /// <param name="disposableServices">
        /// The disposable services.
        /// </param>
        void IServiceAwareController.RegisterDisposableServices(List<IServiceContract> disposableServices)
        {
            this.RegisterServices(disposableServices);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Will make sure that the error handling is done in one place.
        ///     Here we make sure that any Fault Exceptions that are raised from WCF services that we use
        ///     are propagated to the client within the HttpResponseMessage using the right code.
        /// </summary>
        /// <param name="request">
        /// The request.
        /// </param>
        /// <param name="codeToExecute">
        /// The code to execute that we want error handled.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        protected HttpResponseMessage GetHttpResponse(
            HttpRequestMessage request, Func<HttpResponseMessage> codeToExecute)
        {
            HttpResponseMessage response = null;

            try
            {
                response = codeToExecute.Invoke();
            }
            catch (SecurityException ex)
            {
                response = request.CreateResponse(HttpStatusCode.Unauthorized, ex.FlattenAllMessages());
            }
            catch (FaultException<AuthorizationValidationException> ex)
            {
                response = request.CreateResponse(HttpStatusCode.Unauthorized, ex.FlattenAllMessages());
            }
            catch (FaultException ex)
            {
                response = request.CreateResponse(HttpStatusCode.InternalServerError, ex.FlattenAllMessages());
            }
            catch (Exception ex)
            {
                response = request.CreateResponse(HttpStatusCode.InternalServerError, ex.FlattenAllMessages());
            }

            return response;
        }

        /// <summary>
        /// Controllers based on this class will have the responsibility to register services,
        ///     that on ActionExecuted will be flagged for disposal.
        ///     The disposal of Services will be the responsibility of a <see cref="ActionFilterAttribute"/>
        /// </summary>
        /// <param name="disposableServices">
        /// The disposable services.
        /// </param>
        protected virtual void RegisterServices(List<IServiceContract> disposableServices)
        {
        }

        #endregion
    }
}