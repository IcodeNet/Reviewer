
namespace Core.Common.Contracts
{
    /// <summary>
    ///     The DataRepositoryFactory interface where implemented it will return an IDataRepository.
    /// </summary>
    public interface IDataRepositoryFactory
    {
        #region Public Methods and Operators

        /// <summary>
        ///     Will create and return a <see cref="IDataRepository" />.
        /// </summary>
        /// <typeparam name="T">This will be the type of the repository that will implement the IDataRepository interface.</typeparam>
        /// <returns>
        ///     The <see cref="T" />.
        /// </returns>
        T CreateRepository<T>() where T : IDataRepository;

        #endregion
    }
}