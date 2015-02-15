using System.Runtime.Serialization;

namespace Reviewer.Web.Mvc.Common.Contracts
{
    [DataContract]
    public class LookupViewRecord
    {
        #region Public Properties

        [DataMember]
        public string LookupValue { get; set; }

        [DataMember]
        public string LookupValueCode { get; set; }

        #endregion
    }
}