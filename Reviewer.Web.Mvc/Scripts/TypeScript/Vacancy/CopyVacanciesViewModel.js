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
    var CopyVacanciesViewModel = (function (_super) {
        __extends(CopyVacanciesViewModel, _super);
        function CopyVacanciesViewModel(copyUri, vacancyUri, element) {
            _super.call(this);
            this.CopyUri = copyUri;
            this.VacancyUri = vacancyUri;
            this.Element = element;
            this.IsLoading = ko.observable(false);
            this.Vacancies = ko.observableArray(new Array());
            this.CanCopy = ko.computed(this.cb_ComputeCanCopy);
        }
        CopyVacanciesViewModel.prototype.ComputeCanCopy = function () {
            var count = Enumerable.From(this.Vacancies()).Where(function (x) {
                return x.CopyResult() == '';
            }).Count();
            if (count == 0 || this.IsLoading())
                return false;
else
                return true;
        };
        CopyVacanciesViewModel.prototype.cb_ComputeCanCopy = function () {
            return this.ComputeCanCopy();
        };

        CopyVacanciesViewModel.prototype.Copy = function () {
            var _this = this;
            var vacancies = Enumerable.From(this.Vacancies()).Where(function (x) {
                return x.CopyResult() == '';
            });
            var data = {
                vacancyIds: vacancies.Select(function (x) {
                    return x.VacancyId;
                }).ToArray()
            };

            this.IsLoading(true);

            var tThis = this;

            $.ajax({
                type: "POST",
                url: this.CopyUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    Enumerable.From(result.Results).ForEach(function (item) {
                        var vacancy = vacancies.First(function (x) {
                            return x.VacancyId == item.OriginalVacancyId;
                        });
                        if (item.Errors == null || item.Errors.length == 0) {
                            vacancy.CopyResult('Vacancy copied succesfully.<br /><a class="btn" href="' + (_this).VacancyUri.format(item.NewVacancyId) + '">Open</a>');
                        } else {
                            vacancy.CopyResult('Errors whilst copying.');
                        }
                        _this.IsLoading(false);

                        if (_this.OnCopy != null)
                            _this.OnCopy();
                    });
                }
            });
        };
        CopyVacanciesViewModel.prototype.cb_Copy = function () {
            this.Copy();
        };

        CopyVacanciesViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        CopyVacanciesViewModel.prototype.cb_Close = function () {
            this.Close();
        };
        return CopyVacanciesViewModel;
    })(HasCallbacks);
    ViewModels.CopyVacanciesViewModel = CopyVacanciesViewModel;
})(ViewModels || (ViewModels = {}));
