
namespace Common.Exceptions
{
    using System;

    /// <summary>
    ///     The authorization validation exception.
    /// </summary>
    public class AuthorizationValidationException : ApplicationException
    {
        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorizationValidationException"/> class.
        /// </summary>
        /// <param name="message">
        /// The message.
        /// </param>
        public AuthorizationValidationException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorizationValidationException"/> class.
        /// </summary>
        /// <param name="message">
        /// The message.
        /// </param>
        /// <param name="innerException">
        /// The inner exception.
        /// </param>
        public AuthorizationValidationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        #endregion
    }
}