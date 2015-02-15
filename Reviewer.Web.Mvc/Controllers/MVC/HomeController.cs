using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Reviewer.Web.Mvc.Common.Contracts;
using Reviewer.Web.Mvc.Common.Export;
using Reviewer.Web.Mvc.Common.Filters;
using Reviewer.Web.Mvc.Common.Interceptors.Selectors;
using Reviewer.Web.Mvc.Data;
using Reviewer.Web.Mvc.Extensions;

namespace Reviewer.Web.Mvc.Controllers.MVC
{
    /// <summary>
    ///     Controller to respond to REST requests regarding Home and other operations.
    /// </summary>
    [LogInvocations]
    [DisableCache]
    public class HomeController : BaseController
    {
        /// <summary>
        ///     Returns the Index view.
        /// </summary>
        /// <returns>The returned view.</returns>
        public virtual ActionResult Dashboard()
        {
            var model = new DashboardModel();

            return View(model);
        }


        public SearchResponseModel<ReportDataModel> GetTableViewRecords(SearchRequestModel searchRequestModel)
        {
            if (searchRequestModel.FilterKeyValues != null)
            {
                dynamic tableName = searchRequestModel.FilterKeyValues.First(fkv => fkv.Key == "TableName").Value;

             
                ReportDataModel reportDataModel = GetTableDataModelData(tableName);

                switch (searchRequestModel.SortOrder)
                {
                    case "asc":
                        reportDataModel.Rows = reportDataModel.Rows.OrderBy(r => searchRequestModel.OrderBy);
                        break;
                    case "desc":
                        reportDataModel.Rows =
                            reportDataModel.Rows.AsQueryable().OrderByDescending(searchRequestModel.OrderBy);
                        break;
                }

                int pageIndex = Convert.ToInt32(searchRequestModel.Page) - 1;
                int pageSize = searchRequestModel.PageSize;
                int totalRecords = reportDataModel.Rows.Count();
                var totalPages = (int)Math.Ceiling(totalRecords / (float)pageSize);
                reportDataModel.Rows = reportDataModel.Rows.Skip(pageIndex * pageSize).Take(pageSize).ToList();

                return new SearchResponseModel<ReportDataModel>
                {
                    Page = pageIndex,
                    PageSize = pageSize,
                    Result = reportDataModel,
                    TotalPages = totalPages,
                    TotalResults = totalRecords
                };
            }
            return null;
        }

        private static ReportDataModel ReadDataModelFrom(DbDataReader reader)
        {
            var values = new List<string>();
            var names = new List<string>();
            var rows = new List<string[]>();

            while (reader.Read())
            {
                names.Clear();
                values.Clear();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    names.Add(reader.GetName(i));
                    values.Add(reader.GetValue(i).ToString());
                }
                rows.Add(values.ToArray());
            }

            return new ReportDataModel() { ColumnsNames = names.ToArray(), Rows = rows.ToArray() };
        }


        public ReportDataModel GetTableDataModelData(string tableName)
        {
            using (var entityContext = new MyDbContext())
            {
                using (var cmd = entityContext.Database.Connection.CreateCommand())
                {
                    string inlineQuery = @" SELECT * FROM  " + tableName;
                    entityContext.Database.Connection.Open();
                    cmd.CommandText = inlineQuery;
                    using (var reader = cmd.ExecuteReader())
                    {
                        var reportDataModel = ReadDataModelFrom(reader);

                        return reportDataModel;
                    }
                }
            }
        }

        public ActionResult ExportDataToExcel(string tableName)
        {
            var criteria = new SearchRequestModel
            {
                FilterKeyValues = new[] {new FilterKeyValue {Key = "TableName", Value = tableName}},
                LoggedInUserEmail = User.Identity.Name,
                Page = 1,
                PageSize = Int32.MaxValue
            };

            var responseModel = GetTableViewRecords(criteria);


            var columnsNames = responseModel.Result.ColumnsNames;
            var rows = responseModel.Result.Rows;

            var data = new List<string[]>(rows.Count());
            data.AddRange(rows);

            DataForExcel.DataType[] colunmTypes =
            {
                DataForExcel.DataType.Integer, DataForExcel.DataType.String,
                DataForExcel.DataType.String, DataForExcel.DataType.String
            };

            var headerLabels = columnsNames;

            return new ExcelResult(headerLabels, colunmTypes, data, tableName + ".xlsx", tableName);
        }

        public ActionResult ExportAllExceptionsToExcel()
        {
            var records = new SearchResponseModel<ExceptionsViewRecord>();

            var data = new List<string[]>(records.Results.Count());

            data.AddRange(
                records.Results.Select(
                    record =>
                        new[]
                        {
                            record.UploadRowExceptionId.ToString(CultureInfo.InvariantCulture),
                            record.UploadMetadataId.ToString(CultureInfo.InvariantCulture),
                            record.LineNumber.ToString(CultureInfo.InvariantCulture),
                            (record.RowData == null
                                ? String.Empty
                                : record.RowData.ToString(CultureInfo.InvariantCulture)),
                            (record.ExceptionType == null
                                ? String.Empty
                                : record.ExceptionType.ToString(CultureInfo.InvariantCulture)),
                            record.ExceptionDate.ToString(CultureInfo.InvariantCulture),
                            (record.UploadFileName == null
                                ? String.Empty
                                : record.UploadFileName.ToString(CultureInfo.InvariantCulture)),
                            (record.UploadUserName == null
                                ? String.Empty
                                : record.UploadUserName.ToString(CultureInfo.InvariantCulture))
                        }));

            DataForExcel.DataType[] colunmTypes =
            {
                DataForExcel.DataType.Integer, DataForExcel.DataType.String,
                DataForExcel.DataType.String, DataForExcel.DataType.String,
                DataForExcel.DataType.String, DataForExcel.DataType.String,
                DataForExcel.DataType.String, DataForExcel.DataType.String
            };

            string[] headerLabels =
            {
                "UploadRowExceptionId", "UploadMetadataId", "LineNumber", "RowData", "ExceptionType", "ExceptionDate",
                "UploadFileName", "UploadUserName"
            };

            return new ExcelResult(headerLabels, colunmTypes, data, "ExceptionReport.xlsx", "Exceptions");
        }

        public ActionResult ExportAllToExcel()
        {
            var records = new SearchResponseModel<ScenarioViewRecord>();

            var data = new List<string[]>(records.Results.Count());

            data.AddRange(
                records.Results.Select(
                    item =>
                        new[]
                        {
                            item.Id.ToString(CultureInfo.InvariantCulture),
                            item.ScenarioName.ToString(CultureInfo.InvariantCulture)
                        }));

            DataForExcel.DataType[] colunmTypes =
            {
                DataForExcel.DataType.Integer, DataForExcel.DataType.String,
                DataForExcel.DataType.String, DataForExcel.DataType.String
            };

            string[] headerLabels = {"Id", "ClusterName", "UserEmail", "UserName"};

            return new ExcelResult(headerLabels, colunmTypes, data, "ClusterApprovers.xlsx", "ClusterApprovers");
        }

        public class ExcelResult : ActionResult
        {
            public override void ExecuteResult(ControllerContext context)
            {
                var response = context.HttpContext.Response;
                response.ClearContent();
                response.ClearHeaders();
                response.Cache.SetMaxAge(new TimeSpan(0));

                using (var stream = new MemoryStream())
                {
                    _data.CreateXlsxAndFillData(stream);

                    //Return it to the client - strFile has been updated, so return it. 
                    response.AddHeader("content-disposition", "attachment; filename=" + _fileName);

                    // see http://filext.com/faq/office_mime_types.php
                    response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    response.ContentEncoding = Encoding.UTF8;
                    stream.WriteTo(response.OutputStream);
                }
                response.Flush();
                response.Close();
            }

            #region Fields

            private readonly DataForExcel _data;

            private readonly string _fileName;

            #endregion

            #region Constructors and Destructors

            public ExcelResult(string[] headers, List<string[]> data, string fileName, string sheetName)
            {
                _data = new DataForExcel(headers, data, sheetName);
                _fileName = fileName;
            }

            public ExcelResult(
                string[] headers,
                DataForExcel.DataType[] colunmTypes,
                List<string[]> data,
                string fileName,
                string sheetName)
            {
                _data = new DataForExcel(headers, colunmTypes, data, sheetName);
                _fileName = fileName;
            }

            #endregion
        }

        #region Constructors and Destructors

        #endregion

        public ActionResult Scenaria()
        {
            return View();
        }
    }
}