using System;
using System.Runtime.Serialization;

namespace Reviewer.Web.Mvc.Common.Contracts
{
    [DataContract]
    public class ExceptionsViewRecord
    {
        [DataMember]
        public int UploadRowExceptionId { get; set; }

        [DataMember]
        public long UploadMetadataId { get; set; }

        [DataMember]
        public long LineNumber { get; set; }

        [DataMember]
        public string RowData { get; set; }

        [DataMember]
        public string ExceptionType { get; set; }

        [DataMember]
        public DateTime ExceptionDate { get; set; }

        [DataMember]
        public string UploadFileName { get; set; }

        [DataMember]
        public string UploadUserName { get; set; }

        [DataMember]
        public string UploadType { get; set; }
    }
}