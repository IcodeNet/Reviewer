/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../HasCallbacks.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var LineManagerViewModel = (function (_super) {
        __extends(LineManagerViewModel, _super);
        function LineManagerViewModel(searchResourcesUri, element) {
            _super.call(this, searchResourcesUri);

            this.LineManagerFirstName = ko.observable('');
            this.LineManagerLastName = ko.observable('');
            this.LineManagerNavigatorId = ko.observable('');

            this.ResourceName = ko.observable('');
            this.StaffID = ko.observable('');
            this.OrgUnit = ko.observable('');
            this.CostCentre = ko.observable('');
            this.Resource = ko.observable({});

            this.CanSelect = ko.observable(false);

            this.Element = element;
        }
        LineManagerViewModel.prototype.SelectLineManager = function () {
        };
        LineManagerViewModel.prototype.cb_SelectLineManager = function () {
            this.SelectLineManager();
        };

        LineManagerViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        LineManagerViewModel.prototype.cb_Close = function () {
            this.Close();
        };

        LineManagerViewModel.prototype.SelectResource = function (resource) {
            this.Resource(resource);
            this.CanSelect(true);
            this.LineManagerFirstName(this.Resource().FirstName);
            this.LineManagerLastName(this.Resource().LastName);
            this.LineManagerNavigatorId(this.Resource().NavigatorID);
            this.Close();
        };
        LineManagerViewModel.prototype.cb_SelectResource = function (resource) {
            this.SelectResource(resource);
        };

        LineManagerViewModel.prototype.Search = function (searchRequest) {
            this.Resource({});

            searchRequest.Name = this.ResourceName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();

            _super.prototype.Search.call(this, searchRequest);
        };
        return LineManagerViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.LineManagerViewModel = LineManagerViewModel;
})(ViewModels || (ViewModels = {}));
