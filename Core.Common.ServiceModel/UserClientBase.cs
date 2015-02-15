using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Threading;

namespace Core.Common.ServiceModel
{
    /// <summary>
    /// The user client base.
    /// </summary>
    /// <typeparam name="T">
    /// The type of the client service contract.
    /// </typeparam>
    public abstract class UserClientBase<T> : ClientBase<T>
        where T : class
    {
        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="UserClientBase{T}"/> class.
        /// </summary>
        protected UserClientBase()
        {
            string userName = Thread.CurrentPrincipal.Identity.Name;
           
            // Create before usage to avoid null.
            var operationContextScope = new OperationContextScope(this.InnerChannel);

            MessageHeader headerUserName = MessageHeader.CreateHeader(  "Username-CustomHeader",
                                                                 "http://www.kss.com/reviewer",
                                                                 userName
                                                                 );

            OperationContext.Current.OutgoingMessageHeaders.Add(headerUserName);
        }

        #endregion
    }
}