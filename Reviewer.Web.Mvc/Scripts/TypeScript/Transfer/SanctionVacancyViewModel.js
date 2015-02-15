var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var SanctionVacancyViewModel = (function (_super) {
        __extends(SanctionVacancyViewModel, _super);
        function SanctionVacancyViewModel(sanctionUri, vacancyUri, element) {
                _super.call(this);
            this.SanctionUri = sanctionUri;
            this.VacancyUri = vacancyUri;
            this.Element = element;
            this.SapPositionNumber = ko.observable('');
            this.PeoplePositionNumber = ko.observable('');
            this.IsLoading = ko.observable(false);
            this.Vacancies = ko.observableArray(new Array());
            this.CanSanction = ko.computed(this.cb_ComputeCanSanction);
        }
        SanctionVacancyViewModel.prototype.Clear = function () {
            this.IsLoading(false);
            this.SapPositionNumber('');
            this.PeoplePositionNumber('');
        };
        SanctionVacancyViewModel.prototype.ComputeCanSanction = function () {
            if(this.SapPositionNumber().length == 8 && this.PeoplePositionNumber().length != 0) {
                return true;
            } else {
                return false;
            }
        };
        SanctionVacancyViewModel.prototype.cb_ComputeCanSanction = function () {
            return this.ComputeCanSanction();
        };
        SanctionVacancyViewModel.prototype.Sanction = function () {
            var _this = this;
            var vacancies = Enumerable.From(this.Vacancies()).Where(function (x) {
                return x.SanctionResult() == '';
            });
            var data = {
                vacancyId: vacancies.Select(function (x) {
                    return x.VacancyId;
                }).ToArray(),
                sapPositionNumber: this.SapPositionNumber(),
                sanctionedReferenceNumber: this.PeoplePositionNumber()
            };
            this.IsLoading(true);
            $.ajax({
                type: "POST",
                url: this.SanctionUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    _this.IsLoading(false);
                    _this.Close();
                    if(_this.OnSanction != null) {
                        _this.OnSanction();
                    }
                    alert('Vacancy has been sanctioned');
                }
            });
        };
        SanctionVacancyViewModel.prototype.cb_Sanction = function () {
            this.Sanction();
        };
        SanctionVacancyViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        SanctionVacancyViewModel.prototype.cb_Close = function () {
            this.Close();
        };
        return SanctionVacancyViewModel;
    })(HasCallbacks);
    ViewModels.SanctionVacancyViewModel = SanctionVacancyViewModel;    
})(ViewModels || (ViewModels = {}));
