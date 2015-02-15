using System.Runtime.Serialization;

namespace Reviewer.Web.Mvc.Common.Contracts
{
    [DataContract]
    public class ReturnViewRecord
    {
        #region Public Properties

        [DataMember]
        public bool? Approved { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public string Zone { get; set; }


        [DataMember]
        public int Id { get; set; }


        [DataMember]
        public string Status { get; set; }

        #endregion
    }
}