
using System;

namespace Reviewer.Web.Mvc.Common
{
    /// <summary>
    /// SpreadsheetProgressEventHandler is an event handler for the Spreadsheet.Create process
    /// </summary>
    /// <param name="sender">The object that sends the event</param>
    /// <param name="eventargs">An SpreadsheetProgressEventArgs object</param>
    public delegate void SpreadsheetProgressEventHandler(object sender, SpreadsheetProgressEventArgs eventargs);

    /// <summary>
    /// SpreadsheetProgressEventArgs is an EventArgs for the progress of the Spreadsheet.Create
    /// </summary>
    public class SpreadsheetProgressEventArgs : EventArgs
    {
        /// <summary>
        /// Gets or sets the current row index that is being processed
        /// </summary>
        public int RowIndex { get; set; }

        /// <summary>
        /// Gets or sets the total number of rows that will be processed
        /// </summary>
        public int RowCount { get; set; }
    }
}