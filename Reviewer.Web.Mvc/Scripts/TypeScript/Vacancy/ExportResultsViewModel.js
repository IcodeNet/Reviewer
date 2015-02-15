/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Shared/SearchFiltersViewModel.ts" />
/// <reference path="../HasCallbacks.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var ExportResultsViewModel = (function (_super) {
        __extends(ExportResultsViewModel, _super);
        function ExportResultsViewModel(postUrl, searchFilterModel) {
            _super.call(this);
            this.PostUrl = postUrl;

            this.FileName = ko.observable('');
            this.FileType = ko.observable('');
            this.SearchFilter = searchFilterModel;
            this.ExportElement = $('#ExportResultsViewModel')[0];
            this.SearchFiltersViewModel = new ViewModels.SearchFiltersViewModel(searchFilterModel.DomicileCountry, searchFilterModel.DomicileSite);

            this.CanExport = ko.computed(this.cb_ComputeCanExport);
        }
        ExportResultsViewModel.prototype.ShowExport = function () {
            $(this.ExportElement).modal();
        };

        ExportResultsViewModel.prototype.cb_ShowExport = function () {
            this.ShowExport();
        };
        ExportResultsViewModel.prototype.Export = function () {
            this.SearchFilter.FileName = this.FileName();
            this.SearchFilter.Exportfiletype = this.FileType();

            window.location.href = this.PostUrl + '?' + $.param(this.SearchFilter);
            ;
        };

        ExportResultsViewModel.prototype.ComputeCanExport = function () {
            if ($('#resultsGrid').is(':hidden')) {
                return true;
            } else {
                return false;
            }
        };

        ExportResultsViewModel.prototype.cb_ComputeCanExport = function () {
            return this.ComputeCanExport();
        };

        ExportResultsViewModel.prototype.cb_Export = function () {
            this.Export();
        };

        ExportResultsViewModel.prototype.Close = function () {
        };

        ExportResultsViewModel.prototype.cb_Close = function () {
            this.Close();
        };
        return ExportResultsViewModel;
    })(HasCallbacks);
    ViewModels.ExportResultsViewModel = ExportResultsViewModel;
})(ViewModels || (ViewModels = {}));
