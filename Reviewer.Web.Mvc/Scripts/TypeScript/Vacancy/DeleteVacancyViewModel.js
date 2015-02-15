/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var DeleteVacancyViewModel = (function (_super) {
        __extends(DeleteVacancyViewModel, _super);
        function DeleteVacancyViewModel(deleteUri, element) {
            _super.call(this);
            this.DeleteUri = deleteUri;
            this.Element = element;
            this.IsLoading = ko.observable(false);
            this.Vacancy = ko.observable({});
            this.CanDelete = ko.computed(this.cb_ComputeCanDelete);
        }
        DeleteVacancyViewModel.prototype.ComputeCanDelete = function () {
            return this.IsLoading() == false;
        };
        DeleteVacancyViewModel.prototype.cb_ComputeCanDelete = function () {
            return this.ComputeCanDelete();
        };

        DeleteVacancyViewModel.prototype.Delete = function () {
            var _this = this;
            this.IsLoading(true);
            $.ajax({
                type: "POST",
                url: (this.DeleteUri).format(this.Vacancy().VacancyId),
                dataType: "json",
                traditional: true,
                success: function (result) {
                    _this.IsLoading(false);
                    _this.Close();

                    if (_this.OnDelete != null)
                        _this.OnDelete();
                }
            });
        };
        DeleteVacancyViewModel.prototype.cb_Delete = function () {
            this.Delete();
        };

        DeleteVacancyViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        DeleteVacancyViewModel.prototype.cb_Close = function () {
            this.Close();
        };
        return DeleteVacancyViewModel;
    })(HasCallbacks);
    ViewModels.DeleteVacancyViewModel = DeleteVacancyViewModel;
})(ViewModels || (ViewModels = {}));
