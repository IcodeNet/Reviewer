using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using AttributeRouting.Web.Http;
using Core.Common.Contracts;
using Reviewer.Web.Mvc.Common.Contracts;
using Reviewer.Web.Mvc.Controllers.MVC;
using Reviewer.Web.Mvc.Core;
using Reviewer.Web.Mvc.Data;

namespace Reviewer.Web.Mvc.Controllers.API
{
    [UserDisposableService]
    public class OperationsController : ApiControllerBase
    {
        /// <summary>
        ///     Register services that will be flagged for disposal.
        /// </summary>
        /// <param name="disposableServices">
        ///     The disposable services.
        /// </param>
        protected override void RegisterServices(List<IServiceContract> disposableServices)
        {
            //disposableServices.Add(aService);
        }

        [HttpPost]
        [POST("api/operations/tablerecords")]
        public HttpResponseMessage SearchTableRecords(
            HttpRequestMessage request,
            [FromBody] SearchRequestModel searchRequestModel)
        {
            if (searchRequestModel == null) // should we return all?
            {
                return request.CreateErrorResponse(
                    HttpStatusCode.ExpectationFailed,
                    "No SearchRequestModel were passed in to modify. Model Binder returned null model from post data.");
            }

            return GetHttpResponse(
                request,
                () =>
                {
                    var sortOrderArray = HttpContext.Current.Request.Form.GetValues("sord");
                    var boundvalueOfSortOrder = (sortOrderArray != null && sortOrderArray.First() != string.Empty)
                        ? sortOrderArray.First()
                        : "asc";
                    var sord = boundvalueOfSortOrder;

                    var pageSizeArray = HttpContext.Current.Request.Form.GetValues("rows");
                    var boundvalueOfhowManyRowsToDisplay = (pageSizeArray != null
                                                            && int.Parse(pageSizeArray.First()) != 0)
                        ? int.Parse(pageSizeArray.First())
                        : 5;
                    var rows = boundvalueOfhowManyRowsToDisplay;

                    var indexColumnArray = HttpContext.Current.Request.Form.GetValues("sidx");
                    var sidx = (indexColumnArray != null && indexColumnArray.First() != string.Empty)
                        ? indexColumnArray.First()
                        : "Id";

                    var currentPageArray = HttpContext.Current.Request.Form.GetValues("page");
                    var boundvalueOfcurrentPageToDisplay = (currentPageArray != null
                                                            && int.Parse(currentPageArray.First()) != 0)
                        ? int.Parse(currentPageArray.First())
                        : 1;
                    var page = boundvalueOfcurrentPageToDisplay;

                    searchRequestModel.SortOrder = (String.IsNullOrEmpty(sord) ? "asc" : sord);
                    searchRequestModel.OrderBy = (String.IsNullOrEmpty(sidx) ? "Id" : sidx);
                    searchRequestModel.Page = (page == 0 ? 1 : page);
                    searchRequestModel.PageSize = (rows == 0 ? 5 : rows);
                    searchRequestModel.LoggedInUserEmail = User.Identity.Name;

                    if (searchRequestModel.FilterKeyValues != null
                        && searchRequestModel.FilterKeyValues.Count(fkv => fkv.Value != null) > 0)
                    {
                        // only members of certain roles should be allowed to do this
                        var criteria = new SearchRequestModel
                        {
                            FilterKeyValues =
                                (searchRequestModel.FilterKeyValues == null
                                    ? null
                                    : searchRequestModel.FilterKeyValues.Where(
                                        fkv => fkv.Value != null).ToArray()),
                            SortOrder =
                                (String.IsNullOrEmpty(
                                    searchRequestModel.SortOrder)
                                    ? "asc"
                                    : searchRequestModel.SortOrder),
                            OrderBy =
                                (String.IsNullOrEmpty(searchRequestModel.OrderBy)
                                    ? "Id"
                                    : searchRequestModel.OrderBy),
                            Page =
                                (searchRequestModel.Page == 0
                                    ? 1
                                    : searchRequestModel.Page),
                            PageSize =
                                (searchRequestModel.PageSize == 0
                                    ? 5
                                    : searchRequestModel.PageSize),
                            LoggedInUserEmail = User.Identity.Name
                        };


                        /* SERVICE CALL*/
                        var tableName = criteria.FilterKeyValues.First().Value;

                        var responseModel =
                            new SearchResponseModel<ReportDataModel>
                            {
                                Page = 1,
                                PageSize = 10,
                                Result = GetTableDataModelData(tableName),
                                TotalPages = 1,
                                TotalResults = 10
                            };

                        var jsonResults =
                            new
                            {
                                total = responseModel.TotalPages,
                                page = criteria.Page,
                                records = responseModel.TotalResults,
                                columns = responseModel.Result.ColumnsNames,
                                rows = (from record in responseModel.Result.Rows
                                    select
                                        new
                                        {
                                            i = record[0].ToString(CultureInfo.InvariantCulture),
                                            cell = record
                                        }).ToArray()
                            };

                        var response = request.CreateResponse(
                            HttpStatusCode.OK,
                            jsonResults,
                            new JsonMediaTypeFormatter());

                        return response;
                    }
                    return request.CreateResponse(HttpStatusCode.OK);
                });
        }

        public ReportDataModel GetTableDataModelData(string tableName)
        {
            using (var entityContext = new MyDbContext())
            {
                using (var cmd = entityContext.Database.Connection.CreateCommand())
                {
                    var inlineQuery = @" SELECT * FROM  " + tableName;
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

        private static ReportDataModel ReadDataModelFrom(DbDataReader reader)
        {
            var values = new List<string>();
            var names = new List<string>();
            var rows = new List<string[]>();

            while (reader.Read())
            {
                names.Clear();
                values.Clear();

                for (var i = 0; i < reader.FieldCount; i++)
                {
                    names.Add(reader.GetName(i));
                    values.Add(reader.GetValue(i).ToString());
                }
                rows.Add(values.ToArray());
            }

            return new ReportDataModel {ColumnsNames = names.ToArray(), Rows = rows.ToArray()};
        }

        [HttpPost]
        [POST("api/operations/searchScenaria")]
        public HttpResponseMessage SearchReturnRecords(
            HttpRequestMessage request,
            [FromBody] SearchRequestModel searchRequestModel)
        {
            if (searchRequestModel == null) // should we return all?
            {
                return request.CreateErrorResponse(
                    HttpStatusCode.ExpectationFailed,
                    "No SearchRequestModel were passed in to modify. Model Binder returned null model from post data.");
            }

            return GetHttpResponse(
                request,
                () =>
                {
                    var sortOrderArray = HttpContext.Current.Request.Form.GetValues("sord");
                    var boundvalueOfSortOrder = (sortOrderArray != null && sortOrderArray.First() != string.Empty)
                        ? sortOrderArray.First()
                        : "asc";
                    var sord = boundvalueOfSortOrder;

                    var pageSizeArray = HttpContext.Current.Request.Form.GetValues("rows");
                    var boundvalueOfhowManyRowsToDisplay = (pageSizeArray != null
                                                            && int.Parse(pageSizeArray.First()) != 0)
                        ? int.Parse(pageSizeArray.First())
                        : 5;
                    var rows = boundvalueOfhowManyRowsToDisplay;

                    var indexColumnArray = HttpContext.Current.Request.Form.GetValues("sidx");
                    var sidx = (indexColumnArray != null && indexColumnArray.First() != string.Empty)
                        ? indexColumnArray.First()
                        : "Id";

                    var currentPageArray = HttpContext.Current.Request.Form.GetValues("page");
                    var boundvalueOfcurrentPageToDisplay = (currentPageArray != null
                                                            && int.Parse(currentPageArray.First()) != 0)
                        ? int.Parse(currentPageArray.First())
                        : 1;
                    var page = boundvalueOfcurrentPageToDisplay;

                    searchRequestModel.SortOrder = (String.IsNullOrEmpty(sord) ? "asc" : sord);
                    searchRequestModel.OrderBy = (String.IsNullOrEmpty(sidx) ? "Id" : sidx);
                    searchRequestModel.Page = (page == 0 ? 1 : page);
                    searchRequestModel.PageSize = (rows == 0 ? 5 : rows);
                    searchRequestModel.LoggedInUserEmail = User.Identity.Name;

                    if (searchRequestModel.FilterKeyValues != null
                        && searchRequestModel.FilterKeyValues.Count(fkv => fkv.Value != null) > 0)
                    {
                        // only members of certain roles should be allowed to do this
                        var criteria = new SearchRequestModel
                        {
                            FilterKeyValues =
                                (searchRequestModel.FilterKeyValues == null
                                    ? null
                                    : searchRequestModel.FilterKeyValues.Where(
                                        fkv => fkv.Value != null).ToArray()),
                            SortOrder =
                                (String.IsNullOrEmpty(
                                    searchRequestModel.SortOrder)
                                    ? "asc"
                                    : searchRequestModel.SortOrder),
                            OrderBy =
                                (String.IsNullOrEmpty(searchRequestModel.OrderBy)
                                    ? "Id"
                                    : searchRequestModel.OrderBy),
                            Page =
                                (searchRequestModel.Page == 0
                                    ? 1
                                    : searchRequestModel.Page),
                            PageSize =
                                (searchRequestModel.PageSize == 0
                                    ? 5
                                    : searchRequestModel.PageSize),
                            LoggedInUserEmail = User.Identity.Name
                        };


                        /* SERVICE CALL*/
                        var results = GetReturnRecords(criteria);

                        var pageIndex = Convert.ToInt32(criteria.Page);
                        var pageSize = criteria.PageSize;
                        var totalRecords = 20;
                        var totalPages = (int) Math.Ceiling(totalRecords/(float) pageSize);

                        var jsonResults =
                            new
                            {
                                total = totalPages,
                                page = pageIndex,
                                records = totalRecords,
                                rows = (from record in results
                                    select new
                                    {
                                        i = record.Id.ToString(),
                                        cell = new[]
                                        {
                                            record.Id.ToString(), //1
                                            record.Zone, //2
                                            record.Category, //3
                                            record.Status, //4
                                            record.Approved.HasValue
                                                ? record.Approved.Value.ToString()
                                                : Boolean.FalseString //5
                                        }
                                    }).ToArray()
                            };

                        var response = request.CreateResponse(
                            HttpStatusCode.OK,
                            jsonResults,
                            new JsonMediaTypeFormatter());

                        return response;
                    }
                    else
                    {
                        HttpResponseMessage response;
                        var operations = HttpContext.Current.Request.Form.GetValues("oper");
                        var statuses = HttpContext.Current.Request.Form.GetValues("Status");
                        var approvedCollectionStrings = HttpContext.Current.Request.Form.GetValues("Approved");

                        var structuredEntityIds = HttpContext.Current.Request.Form.GetValues(
                            "StructuredEntityName");

                        var disclosureTypeIds = HttpContext.Current.Request.Form.GetValues(
                            "TypeOfInterestInEntity");

                        var status = 0;

                        if (statuses != null)
                        {
                            var statusIn = statuses[0];

                            switch (statusIn)
                            {
                                case "In Progress":
                                    status = 1;
                                    break;
                                case "Awaiting Approval":
                                    status = 2;
                                    break;
                                case "Reviewed":
                                    status = 3;
                                    break;
                                case "Rejected in Review":
                                    status = 4;
                                    break;
                                case "Rejected in Signoff":
                                    status = 5;
                                    break;
                                case "Completed/Signed Off":
                                    status = 6;
                                    break;
                            }
                        }

                        var ids = HttpContext.Current.Request.Form.GetValues("Id");

                        if (operations != null && operations[0] == "edit" && ids != null)
                        {
                            var questionnaireId = ids[0];
                            var structuredEntityId = structuredEntityIds != null ? structuredEntityIds[0] : "0";
                            var disclosureTypeId = disclosureTypeIds != null ? disclosureTypeIds[0] : "0";

                            // EDIT using something

                            return request.CreateResponse(HttpStatusCode.OK);
                        }

                        var jsonResults = new {total = 0, page = 0, records = 0, rows = new {}};

                        response = request.CreateResponse(HttpStatusCode.OK, jsonResults, new JsonMediaTypeFormatter());
                        return response;
                    }
                });
        }

        public ReturnViewRecord[] GetReturnRecords(SearchRequestModel searchRequestModel)
        {
            // beased on user's role we should only see records with specific status i.e Submitter should only see records 'In Progress', 'Rejected in Review'
            // TODO: once roles are in the Db then the functionality should move here instead of wrongly being on the client... (BTH)
            var zone = string.Empty;
            var category = string.Empty;
          
            //key: "Zone"  
            //key: "Category" 

            if (searchRequestModel.FilterKeyValues != null)
            {
                var filters = GetFilterModelFrom(searchRequestModel.FilterKeyValues);

                zone = filters.Zone;
                category = filters.Category;
            }

            var returnViewRecords = new List<ReturnViewRecord>();

            for (var i = 0; i < 20; i++)
            {
                var rec = new ReturnViewRecord();
                rec.Id = i;
                rec.Approved = true;
                rec.Category = "Cat" + i;
                rec.Zone = "Zone" + i;
                rec.Status = "Status" + i;

                returnViewRecords.Add(rec);
            }


            var pageIndex = Convert.ToInt32(searchRequestModel.Page) - 1;
            var pageSize = searchRequestModel.PageSize;
            var totalRecords = returnViewRecords.Count();

            var totalPages = (int) Math.Ceiling(totalRecords/(float) pageSize);

            var results = returnViewRecords.Skip(pageIndex*pageSize).Take(pageSize).ToArray();

            return results.ToArray();
        }

        private FilterModel GetFilterModelFrom(FilterKeyValue[] filterKeyValues)
        {
            var filters = new FilterModel
            {
                Zone = filterKeyValues.First(fkv => fkv.Key == "Zone").Value.ToString(),
                Category = filterKeyValues.First(fkv => fkv.Key == "Category").Value.ToString()
            };

            return filters;
        }

        #region Constructors and Destructors

        #endregion
    }

    public class FilterModel
    {
        public string Zone { get; set; }
        public string Category { get; set; }
    }
}