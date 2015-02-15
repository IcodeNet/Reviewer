using System;
using System.Collections.Generic;
using System.Linq;

namespace Reviewer.Web.Mvc.Extensions
{
    public static class ExceptionExtensions
    {
        #region Public Methods and Operators

        public static IEnumerable<TSource> FromHierarchy<TSource>(
            this TSource source,
            Func<TSource, TSource> nextItem,
            Func<TSource, bool> canContinue)
        {
            for (TSource current = source; canContinue(current); current = nextItem(current))
            {
                yield return current;
            }
        }

        public static IEnumerable<TSource> FromHierarchy<TSource>(this TSource source, Func<TSource, TSource> nextItem)
            where TSource : class
        {
            return FromHierarchy(source, nextItem, s => s != null);
        }

        public static string FlattenAllMessages(this Exception exception)
        {
            IEnumerable<string> messages = exception.FromHierarchy(ex => ex.InnerException).Select(ex => ex.Message);
            return String.Join(Environment.NewLine, messages);
        }

        #endregion
    }
}