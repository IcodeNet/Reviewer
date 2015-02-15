using System.Collections.Generic;

namespace Core.Common.Contracts
{
    /// <summary>
    ///     Place Holder Interface Used for factories
    /// </summary>
    public interface IDataRepository
    {
        // Marker Interface
    }

    /// <summary>
    /// Include the Common CRUD operations common to most repositories.
    /// </summary>
    /// <typeparam name="T">
    /// The type that represents a Table.
    /// </typeparam>
    public interface IDataRepository<T> : IDataRepository
        where T : class, new()
    {
        #region Public Methods and Operators

        /// <summary>
        /// The add operation.
        /// </summary>
        /// <param name="entity">
        /// The entity.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Add(T entity);

        /// <summary>
        ///     Get all entities of the underlying type.
        /// </summary>
        /// <returns>
        ///     All entities of the underlying type.
        /// </returns>
        IEnumerable<T> Get();

        /// <summary>
        /// Get an Entity by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Get(int id);

        /// <summary>
        /// Remove an Entity passed in.
        /// </summary>
        /// <param name="entity">
        /// The entity.
        /// </param>
        void Remove(T entity);

        /// <summary>
        /// Remove an Entity by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        void Remove(int id);

        /// <summary>
        /// Update based on the passed in Entity.
        /// </summary>
        /// <param name="entity">
        /// The entity.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Update(T entity);

        #endregion
    }
}