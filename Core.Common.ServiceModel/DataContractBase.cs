
using System.Runtime.Serialization;

namespace Core.Common.ServiceModel
{
    /// <summary>
    /// The data contract base.
    /// </summary>
    [DataContract]
    public class DataContractBase : IExtensibleDataObject
    {
        /// <summary>
        /// Gets or sets the extension data.
        /// </summary>
        public ExtensionDataObject ExtensionData { get; set; }
    }
}