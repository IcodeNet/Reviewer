namespace Core.Common.Contracts
{
    /// <summary>
    ///     The AccountOwnedEntity interface denotes the Account or User that Owns an Entity that represents a record.
    /// </summary>
    public interface IAccountOwnedEntity
    {
        #region Public Properties

        /// <summary>
        /// Gets the owner account id.
        /// </summary>
        int OwnerAccountId { get; }

        #endregion
    }
}