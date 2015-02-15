var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var ViewVacanciesViewModel = (function (_super) {
        __extends(ViewVacanciesViewModel, _super);
        function ViewVacanciesViewModel(searchUri, copyUri, fillUri, searchResourcesUri, sanctionUri, vacancyUri, deleteUri) {
                _super.call(this, searchUri);
            this.CopyElement = $('#CopyVacanciesViewModel')[0];
            this.CopyViewModel = ko.observable(new ViewModels.CopyVacanciesViewModel(copyUri, vacancyUri, this.CopyElement));
            this.CopyViewModel().OnCopy = this.cb_Search;
            this.FillElement = $('#FillVacanciesViewModel')[0];
            this.FillViewModel = ko.observable(new ViewModels.FillVacanciesViewModel(fillUri, searchResourcesUri, this.FillElement));
            this.FillViewModel().OnFill = this.cb_Search;
            this.SanctionElement = $('#SanctionVacancyViewModel')[0];
            this.SanctionViewModel = ko.observable(new ViewModels.SanctionVacancyViewModel(sanctionUri, vacancyUri, this.SanctionElement));
            this.SanctionViewModel().OnSanction = this.cb_Search;
            this.DeleteElement = $('#DeleteVacancyViewModel')[0];
            this.DeleteViewModel = ko.observable(new ViewModels.DeleteVacancyViewModel(deleteUri, this.DeleteElement));
            this.DeleteViewModel().OnDelete = this.cb_Search;
            this.CanDoCopy = ko.computed(this.cb_ComputeCanDoCopy);
            this.CanDoFill = ko.computed(this.cb_ComputeCanDoFill);
            this.CanDoSanction = ko.computed(this.cb_ComputeCanDoSanction);
            this.CanDoEdit = ko.computed(this.cb_ComputeCanDoEdit);
            this.CanDoDelete = ko.computed(this.cb_ComputeCanDoDelete);
            this.VacancyUri = vacancyUri;
        }
        ViewVacanciesViewModel.prototype.ComputeCanDoCopy = function () {
            var selected = Enumerable.From(this.Results()).Count(function (x) {
                return x.IsSelected() == true;
            });
            if(selected > 0) {
                return true;
            } else {
                return false;
            }
        };
        ViewVacanciesViewModel.prototype.cb_ComputeCanDoCopy = function () {
            return this.ComputeCanDoCopy();
        };
        ViewVacanciesViewModel.prototype.ComputeCanDoFill = function () {
            var selected = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).ToArray();
            if(selected.length == 1) {
                if(selected[0].Status == 'Sanctioned') {
                    return true;
                }
            }
            return false;
        };
        ViewVacanciesViewModel.prototype.cb_ComputeCanDoFill = function () {
            return this.ComputeCanDoFill();
        };
        ViewVacanciesViewModel.prototype.ComputeCanDoEdit = function () {
            var selected = Enumerable.From(this.Results()).Count(function (x) {
                return x.IsSelected() == true;
            });
            if(selected == 1) {
                return true;
            } else {
                return false;
            }
        };
        ViewVacanciesViewModel.prototype.cb_ComputeCanDoEdit = function () {
            return this.ComputeCanDoEdit();
        };
        ViewVacanciesViewModel.prototype.ComputeCanDoDelete = function () {
            var selected = Enumerable.From(this.Results()).Count(function (x) {
                return x.IsSelected() == true;
            });
            if(selected == 1) {
                return true;
            } else {
                return false;
            }
        };
        ViewVacanciesViewModel.prototype.cb_ComputeCanDoDelete = function () {
            return this.ComputeCanDoDelete();
        };
        ViewVacanciesViewModel.prototype.ComputeCanDoSanction = function () {
            var selected = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).ToArray();
            if(selected.length == 1) {
                if(selected[0].Status == 'Unsanctioned') {
                    return true;
                }
            }
            return false;
        };
        ViewVacanciesViewModel.prototype.cb_ComputeCanDoSanction = function () {
            return this.ComputeCanDoSanction();
        };
        ViewVacanciesViewModel.prototype.Copy = function () {
            if(!this.CanDoCopy.peek()) {
                return;
            }
            var selectedVacancies = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).ToArray();
            Enumerable.From(selectedVacancies).ForEach(function (x) {
                return x.CopyResult = new ko.observable('');
            });
            this.CopyViewModel().Vacancies(selectedVacancies);
            $(this.CopyElement).modal();
        };
        ViewVacanciesViewModel.prototype.cb_Copy = function () {
            this.Copy();
        };
        ViewVacanciesViewModel.prototype.Fill = function () {
            if(!this.CanDoFill.peek()) {
                return;
            }
            var selectedVacancies = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).ToArray();
            this.FillViewModel().Clear();
            this.FillViewModel().Vacancy(selectedVacancies[0]);
            $(this.FillElement).modal().css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        };
        ViewVacanciesViewModel.prototype.cb_Fill = function () {
            this.Fill();
        };
        ViewVacanciesViewModel.prototype.Sanction = function () {
            if(!this.CanDoSanction.peek()) {
                return;
            }
            var selectedVacancies = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).ToArray();
            Enumerable.From(selectedVacancies).ForEach(function (x) {
                return x.SanctionResult = new ko.observable('');
            });
            this.SanctionViewModel().Clear();
            this.SanctionViewModel().Vacancies(selectedVacancies);
            $(this.SanctionElement).modal();
        };
        ViewVacanciesViewModel.prototype.cb_Sanction = function () {
            this.Sanction();
        };
        ViewVacanciesViewModel.prototype.Edit = function () {
            if(!this.CanDoEdit.peek()) {
                return;
            }
            var selectedVacancy = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).First();
            window.location = (this).VacancyUri.format(selectedVacancy.VacancyId);
        };
        ViewVacanciesViewModel.prototype.cb_Edit = function () {
            this.Edit();
        };
        ViewVacanciesViewModel.prototype.Delete = function () {
            if(!this.CanDoDelete.peek()) {
                return;
            }
            var selectedVacancy = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected() == true;
            }).First();
            this.DeleteViewModel().Vacancy(selectedVacancy);
            $(this.DeleteElement).modal();
        };
        ViewVacanciesViewModel.prototype.cb_Delete = function () {
            this.Delete();
        };
        ViewVacanciesViewModel.prototype.OnResponse = function (response) {
            Enumerable.From(response.Results).ForEach(function (x) {
                x.IsSelected = ko.observable(false);
            });
            _super.prototype.OnResponse.call(this, response);
        };
        return ViewVacanciesViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.ViewVacanciesViewModel = ViewVacanciesViewModel;    
})(ViewModels || (ViewModels = {}));
