
namespace Core.Common.Contracts
{
    /// <summary>
    ///     The ServiceFactory interface.
    ///     Clients can use implementations of this interface to instantiate clients to WCF services on demand and on per call.
    /// </summary>
    public interface IServiceFactory
    {
        #region Public Methods and Operators

        /// <summary>
        ///     Will create a client to a Service.
        /// </summary>
        /// <typeparam name="T">The Type of the Contract.
        /// </typeparam>
        /// <returns>
        ///     The <see cref="T" />.
        /// </returns>
        T CreateClient<T>() where T : IServiceContract;

        #endregion
    }
}