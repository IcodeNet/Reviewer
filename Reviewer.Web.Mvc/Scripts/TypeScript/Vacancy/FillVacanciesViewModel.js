/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var FillVacanciesViewModel = (function (_super) {
        __extends(FillVacanciesViewModel, _super);
        function FillVacanciesViewModel(fillUri, searchResourcesUri, element) {
            var _this = this;
            _super.call(this, searchResourcesUri);

            this.FillUri = fillUri;
            this.Element = element;

            this.IsFilling = ko.observable(false);
            this.Vacancy = ko.observable({});
            this.Resource = ko.observable({});

            this.ResourceName = ko.observable('');
            this.StaffID = ko.observable('');
            this.OrgUnit = ko.observable('');
            this.CostCentre = ko.observable('');

            this.FirstName = ko.observable('');
            this.LastName = ko.observable('');
            this.BRID = ko.observable('');
            this.StaffNumber = ko.observable('');
            this.ActualStartDate = ko.observable(new Date());

            this.CanFill = ko.computed(this.cb_ComputeCanFill);
            this.IsSAP = ko.computed(function () {
                if (_this.Vacancy()) {
                    return _this.Vacancy().IsSAP;
                }
                return false;
            });
        }
        FillVacanciesViewModel.prototype.Clear = function () {
            this.IsFilling(false);

            this.Vacancy({});
            this.Resource({});

            this.ResourceName('');
            this.StaffID('');
            this.OrgUnit('');
            this.CostCentre('');

            this.FirstName('');
            this.LastName('');
            this.BRID('');
            this.StaffNumber('');
            this.ActualStartDate(new Date());
        };

        FillVacanciesViewModel.prototype.Search = function (searchRequest) {
            this.Resource({});

            searchRequest.Name = this.ResourceName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();
            searchRequest.OnlyOrphan = true;

            _super.prototype.Search.call(this, searchRequest);
        };

        FillVacanciesViewModel.prototype.SelectResource = function (resource) {
            this.Resource(resource);
        };
        FillVacanciesViewModel.prototype.cb_SelectResource = function (resource) {
            this.SelectResource(resource);
        };

        FillVacanciesViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        FillVacanciesViewModel.prototype.cb_Close = function () {
            this.Close();
        };

        FillVacanciesViewModel.prototype.Fill = function () {
            var _this = this;
            this.IsFilling(true);

            var data = {
                vacancyId: this.Vacancy().VacancyId,
                resourceId: this.Resource().ResourceId,
                firstName: this.FirstName(),
                lastName: this.LastName(),
                BRID: this.BRID(),
                StaffNumber: this.StaffNumber(),
                ActualStartDate: this.ActualStartDate().getFullYear() + '-' + (this.ActualStartDate().getMonth() + 1) + '-' + this.ActualStartDate().getDate()
            };

            $.ajax({
                type: "POST",
                url: this.FillUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    _this.IsFilling(false);
                    if (result.Success) {
                        alert('This vacancy has been filled.');
                        _this.Close();
                        if (_this.OnFill != null)
                            _this.OnFill();
                    } else {
                        alert(result.Message);
                    }
                }
            });
        };
        FillVacanciesViewModel.prototype.cb_Fill = function () {
            this.Fill();
        };

        FillVacanciesViewModel.prototype.ComputeCanFill = function () {
            var hasVacancy = this.Vacancy().VacancyId != null;
            var hasResource = this.Resource().ResourceId != null;
            var isFilling = this.IsFilling();
            var validNewResource = this.FirstName() != '' && this.LastName() != '' && this.BRID() != '' && this.StaffNumber() != '';

            if (isFilling)
                return false;

            if (!hasVacancy)
                return false;

            if (hasResource || validNewResource) {
                return true;
            }

            return false;
        };
        FillVacanciesViewModel.prototype.cb_ComputeCanFill = function () {
            return this.ComputeCanFill();
        };
        return FillVacanciesViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.FillVacanciesViewModel = FillVacanciesViewModel;
})(ViewModels || (ViewModels = {}));
