
using System.Collections.Generic;
using Core.Common.Contracts;

namespace Reviewer.Web.Mvc.Core
{
    /// <summary>
    ///     The ServiceAwareController interface.
    /// </summary>
    public interface IServiceAwareController
    {
        #region Public Properties

        /// <summary>
        ///     Gets the disposable services.
        ///     Will return the registered disposable services that this controller is using
        /// </summary>
        List<IServiceContract> DisposableServices { get; }

        #endregion

        #region Public Methods and Operators

        /// <summary>
        /// Will register disposable services that this controller is using.
        /// </summary>
        /// <param name="disposableServices">
        /// The disposable services.
        /// </param>
        void RegisterDisposableServices(List<IServiceContract> disposableServices);

        #endregion
    }
}