
namespace Core.Common.Contracts
{
    /// <summary>
    ///     Where implemented it will designate the property that is identified by the Entity.
    /// </summary>
    public interface IIdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the EntityId.
        /// The Property that Identifies an Entity through its lifetime.
        /// </summary>
        int EntityId { get; set; }
    }
}