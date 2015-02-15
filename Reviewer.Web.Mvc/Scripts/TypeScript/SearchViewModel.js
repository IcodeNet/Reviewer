/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />
/// <reference path="Definitions/Knockout/knockout.d.ts" />
/// <reference path="HasCallbacks.ts" />
/// <reference path="Models.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var SearchViewModel = (function (_super) {
        __extends(SearchViewModel, _super);
        function SearchViewModel(searchUri) {
            _super.call(this);

            this.PageSpan = 6;

            this.SearchUri = searchUri;

            this.Results = ko.observableArray();
            this.Page = ko.observable(0);
            this.PageSize = ko.observable(20);
            this.TotalPages = ko.observable(0);
            this.TotalResults = ko.observable(0);
            this.IsLoading = ko.observable(false);

            this.PagerArray = ko.computed(this.cb_ComputePagerArray);
        }
        SearchViewModel.prototype.Search = function (searchRequest) {
            var _this = this;
            if (searchRequest == null)
                searchRequest = {};
            searchRequest.Page = this.Page();
            searchRequest.PageSize = this.PageSize();
            this.IsLoading(true);
            $.get(this.SearchUri, searchRequest, function (response) {
                _this.OnResponse(response);
                _this.IsLoading(false);
            });
        };
        SearchViewModel.prototype.cb_Search = function () {
            this.Search({});
        };

        SearchViewModel.prototype.OnResponse = function (response) {
            this.Page(response.Page);
            this.PageSize(response.PageSize);
            this.TotalPages(response.TotalPages);
            this.TotalResults(response.TotalResults);
            this.Results(response.Results);

            if (this.OnSearchComplete) {
                this.OnSearchComplete();
            }
        };

        SearchViewModel.prototype.ChangePage = function (page) {
            if (page == this.Page() || page < 0 || page > this.TotalPages())
                return;

            this.Page(page);
            this.Search({});
        };

        SearchViewModel.prototype.ComputePagerArray = function () {
            var page = this.Page();
            var startPage = Math.max(0, page - (this.PageSpan / 2));

            var split = page - startPage;
            if (split < this.PageSpan)
                split = this.PageSpan - split;

            var total = this.TotalPages();
            var endPage = Math.min(page + split, total);

            var pages = new Array();
            for (var i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            return pages;
        };
        SearchViewModel.prototype.cb_ComputePagerArray = function () {
            return this.ComputePagerArray();
        };
        return SearchViewModel;
    })(HasCallbacks);
    ViewModels.SearchViewModel = SearchViewModel;
})(ViewModels || (ViewModels = {}));
