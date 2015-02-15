using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Mvc;
using AttributeRouting.Web.Http;
using Core.Common.Contracts;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Reviewer.Web.Mvc.Core;
using Reviewer.Web.Mvc.Data;

namespace Reviewer.Web.Mvc.Controllers.API
{
    /// <summary>
    ///     The Resources API controller will return resources.
    /// </summary>
    [UserDisposableService]
    public class ResourcesController : ApiControllerBase
    {
        /// <summary>
        ///     Register services that will be flagged for disposal.
        /// </summary>
        /// <param name="disposableServices">
        ///     The disposable services.
        /// </param>
        protected override void RegisterServices(List<IServiceContract> disposableServices)
        {
            //disposableServices.Add(this.aService);
        }

        [HttpGet]
        [GET("/api/resources/tablenames")]
        public HttpResponseMessage GetTableNames(HttpRequestMessage request)
        {
            return GetHttpResponse(
                request,
                () =>
                {
                    var tables = Enum.GetNames(typeof (ApplicationTables));

                    var response = request.CreateResponse(HttpStatusCode.OK, tables);
                    return response;
                });
        }

        [HttpGet]
        [GET("/api/resources/tablestatistics")]
        public HttpResponseMessage GetCountForEntityAndClause(HttpRequestMessage request)
        {
            return GetHttpResponse(
                request,
                () =>
                {
                    TableStatisticRecord[] results;

                    using (var context = new MyDbContext())
                    {
                       results =  context.Database.SqlQuery<TableStatisticRecord>("SELECT * FROM dbo.TableCounts").ToArray();
                    }
                 
                    var response = request.CreateResponse(HttpStatusCode.OK, results);
                    return response;
                });
        }


        [System.Web.Mvc.HttpGet]
        [GET("/api/resources/zones")]
        public HttpResponseMessage GetAllZones(HttpRequestMessage request)
        {
            return this.GetHttpResponse(
                request,
                () =>
                {
                  var zones = new List<Zone>();

                    for (int i = 0; i < 10; i++)
                    {
                        var z = new Zone() {Id = i, Name = "Name" + i};
                        zones.Add(z);
                    }


                    HttpResponseMessage response = request.CreateResponse(HttpStatusCode.OK, zones);
                    return response;
                });
        }



        [System.Web.Mvc.HttpGet]
        [GET("/api/resources/categoriesjson")]
        public HttpResponseMessage GetBusinessLinesAsJson(HttpRequestMessage request, string forZone = null)
        {
            return this.GetHttpResponse(
                request,
                () =>
                {
                    var results = new List<Category>();
                    for (int i = 0; i < 10; i++)
                    {
                        var z = new Category { Id = i, Name = "Name" + i };
                        results.Add(z);
                    }
                    HttpResponseMessage response = request.CreateResponse(
                        HttpStatusCode.OK,
                        results.Select(r=> r.Name),
                        new JsonMediaTypeFormatter());
                    return response;
                });
        }
    
    }

    public class TableStatisticRecord
    {
        public long DataPages { get; set; }
        public long DataSpaceMB { get; set; }
        public string IndexName { get; set; }
        public Int32 Rows { get; set; }
        public string TableName { get; set; }
        public long TotalPages { get; set; }
        public long TotalSpaceMB { get; set; }
        public long UsedPages { get; set; }
        public long UsedSpaceMB { get; set; }
    }
}