/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../Models.ts" />
/// <reference path="CopyVacanciesViewModel.ts" />
/// <reference path="SanctionVacancyViewModel.ts" />
/// <reference path="FillVacanciesViewModel.ts" />
/// <reference path="DeleteVacancyViewModel.ts" />

module ViewModels {
    
    export class ViewVacanciesViewModel extends SearchViewModel	{
        public CanDoCopy: KnockoutObservableFunctions;
        public CanDoFill: KnockoutObservableFunctions;
        public CanDoSanction: KnockoutObservableFunctions;
        public CanDoEdit: KnockoutObservableFunctions;
        public CanDoDelete: KnockoutObservableFunctions;

        CopyViewModel: KnockoutObservableAny;
        FillViewModel: KnockoutObservableAny;
        SanctionViewModel: KnockoutObservableAny;
        DeleteViewModel: KnockoutObservableAny;
        CopyElement: any;
        FillElement: any;
        SanctionElement: any;
        DeleteElement: any;

        VacancyUri: string;

        constructor(searchUri: string, copyUri: string, fillUri: string, searchResourcesUri: string, sanctionUri: string, vacancyUri: string, deleteUri: string)
        {
            super(searchUri);

            this.CopyElement = $('#CopyVacanciesViewModel')[0];
            this.CopyViewModel = ko.observable(new CopyVacanciesViewModel(copyUri, vacancyUri, this.CopyElement));
            this.CopyViewModel().OnCopy = this.cb_Search;

            this.FillElement = $('#FillVacanciesViewModel')[0];
            this.FillViewModel = ko.observable(new FillVacanciesViewModel(fillUri, searchResourcesUri, this.FillElement));
            this.FillViewModel().OnFill = this.cb_Search;

            this.SanctionElement = $('#SanctionVacancyViewModel')[0];
            this.SanctionViewModel = ko.observable(new SanctionVacancyViewModel(sanctionUri, vacancyUri, this.SanctionElement));
            this.SanctionViewModel().OnSanction = this.cb_Search;

            this.DeleteElement = $('#DeleteVacancyViewModel')[0];
            this.DeleteViewModel = ko.observable(new DeleteVacancyViewModel(deleteUri, this.DeleteElement));
            this.DeleteViewModel().OnDelete = this.cb_Search;

            this.CanDoCopy = ko.computed(this.cb_ComputeCanDoCopy);
            this.CanDoFill = ko.computed(this.cb_ComputeCanDoFill);
            this.CanDoSanction = ko.computed(this.cb_ComputeCanDoSanction);
            this.CanDoEdit = ko.computed(this.cb_ComputeCanDoEdit);
            this.CanDoDelete = ko.computed(this.cb_ComputeCanDoDelete);

            this.VacancyUri = vacancyUri;
        }

        ComputeCanDoCopy(): boolean {
            var selected = Enumerable.From(this.Results()).Count(x => x.IsSelected() == true);
            if (selected > 0)
                return true;
            else {
                return false;
            }  
        }
        cb_ComputeCanDoCopy() { return this.ComputeCanDoCopy(); }

        ComputeCanDoFill(): boolean {
            var selected = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).ToArray();
            if (selected.length == 1)
            {
                if (selected[0].Status == 'Sanctioned')
                {
                    return true;
                }
            }
            return false;
        }
        cb_ComputeCanDoFill() { return this.ComputeCanDoFill(); }

        ComputeCanDoEdit(): boolean {
            var selected = Enumerable.From(this.Results()).Count(x => x.IsSelected() == true);
            if (selected == 1)
                return true;
            else {
                return false;
            }
        }
        cb_ComputeCanDoEdit() { return this.ComputeCanDoEdit(); }

        ComputeCanDoDelete(): boolean { 
            var selected = Enumerable.From(this.Results()).Count(x => x.IsSelected() == true);
            if (selected == 1)
                return true;
            else {
                return false;
            }
        }
        cb_ComputeCanDoDelete() { return this.ComputeCanDoDelete(); }

        ComputeCanDoSanction(): boolean {
            var selected = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).ToArray();
            if (selected.length == 1) {
                if (selected[0].IsSanctioned == false) {
                    return true;
                }
            }
            return false;
        }
        cb_ComputeCanDoSanction() { return this.ComputeCanDoSanction(); }

        Copy() {
            if (!this.CanDoCopy.peek())
                return;

            var selectedVacancies = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).ToArray();
            Enumerable.From(selectedVacancies).ForEach(x => x.CopyResult = new ko.observable(''));
            this.CopyViewModel().Vacancies(selectedVacancies);
            $(this.CopyElement).modal();
        }
        cb_Copy() { this.Copy(); }

        Fill() {
            if (!this.CanDoFill.peek())
                return;

            var selectedVacancies = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).ToArray();
            this.FillViewModel().Clear();
            this.FillViewModel().Vacancy(selectedVacancies[0]);
            $(this.FillElement).modal().css({ width: 'auto', 'margin-left': function () { return -($(this).width() / 2); } });

        }
        cb_Fill() { this.Fill(); }

        Sanction() {
            if (!this.CanDoSanction.peek())
                return;

            var selectedVacancies = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).ToArray();
            Enumerable.From(selectedVacancies).ForEach(x => x.SanctionResult = new ko.observable(''));
            this.SanctionViewModel().Clear();
            this.SanctionViewModel().Vacancies(selectedVacancies);
            $(this.SanctionElement).modal(); 
        }
        cb_Sanction() { this.Sanction(); }

        Edit() {
            if (!this.CanDoEdit.peek())
                return;

            var selectedVacancy = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).First();
            window.location = (<any>this).VacancyUri.format(selectedVacancy.VacancyId);
        }
        cb_Edit() { this.Edit(); }

        Delete() {
            if (!this.CanDoDelete.peek())
                return;

            var selectedVacancy = Enumerable.From(this.Results()).Where(x => x.IsSelected() == true).First();
            this.DeleteViewModel().Vacancy(selectedVacancy);
            $(this.DeleteElement).modal();
        }
        cb_Delete() { this.Delete(); }

        OnResponse(response : ISearchResponse)
        {
            // Modify the results getting populated.
            Enumerable.From(response.Results).ForEach((x: IViewVacanciesRecord) => {
                x.IsSelected = ko.observable(false);
            });

            super.OnResponse(response);
    	}
    }
}