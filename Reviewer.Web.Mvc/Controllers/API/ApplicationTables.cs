namespace Reviewer.Web.Mvc.Controllers.API
{
    /// <summary>
    ///     Application Tables Enumeration
    ///     SELECT TABLE_NAME
    ///     FROM INFORMATION_SCHEMA.TABLES
    ///     WHERE TABLE_TYPE = 'BASE TABLE'
    ///     ORDER by TABLE_NAME
    /// </summary>
    public enum ApplicationTables
    {
        Messages,
        Zones,
        Categories
    }
}