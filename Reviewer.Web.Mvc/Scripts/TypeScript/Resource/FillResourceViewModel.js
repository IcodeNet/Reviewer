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
    var FillResourceViewModel = (function (_super) {
        __extends(FillResourceViewModel, _super);
        function FillResourceViewModel(searchUri, fillUri, model) {
            var _this = this;
            _super.call(this, searchUri);
            this.FillUri = fillUri;

            this.ResourceId = model.ResourceId;
            this.FirstName = model.FirstName;
            this.LastName = model.LastName;
            this.BRID = model.BRID;
            this.StaffNumber = model.StaffNumber;
            this.ResourceName = ko.computed(function () {
                return _this.LastName + ', ' + _this.FirstName;
            });

            this.Vacancy = ko.observable({});
            this.ActualStartDate = ko.observable(new Date());

            this.IsFilling = ko.observable(false);
            this.CanFill = ko.computed(this.cb_ComputeCanFill);
        }
        FillResourceViewModel.prototype.Fill = function () {
            var _this = this;
            this.IsFilling(true);

            var data = {
                vacancyId: this.Vacancy().VacancyId,
                resourceId: this.ResourceId,
                firstName: this.FirstName,
                lastName: this.LastName,
                BRID: this.BRID,
                StaffNumber: this.StaffNumber,
                ActualStartDate: this.ActualStartDate()
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
                        location.href = document.referrer;
                    } else {
                        alert(result.Message);
                    }
                }
            });
        };
        FillResourceViewModel.prototype.cb_Fill = function () {
            this.Fill();
        };

        FillResourceViewModel.prototype.ComputeCanFill = function () {
            if (this.IsFilling())
                return false;
            if (this.Vacancy() == null)
                return false;
            if (this.Vacancy().VacancyId == null)
                return false;
            if (this.ActualStartDate() == null)
                return false;

            return true;
        };
        FillResourceViewModel.prototype.cb_ComputeCanFill = function () {
            return this.ComputeCanFill();
        };

        FillResourceViewModel.prototype.SelectVacancy = function (vacancy) {
            this.Vacancy(vacancy);
        };
        FillResourceViewModel.prototype.cb_SelectVacancy = function (vacancy) {
            this.SelectVacancy(vacancy);
        };

        FillResourceViewModel.prototype.Search = function (searchRequest) {
            if (searchRequest == null) {
                searchRequest = {};
            }
            searchRequest.OnlyFillable = true;

            _super.prototype.Search.call(this, searchRequest);
        };
        return FillResourceViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.FillResourceViewModel = FillResourceViewModel;
})(ViewModels || (ViewModels = {}));
