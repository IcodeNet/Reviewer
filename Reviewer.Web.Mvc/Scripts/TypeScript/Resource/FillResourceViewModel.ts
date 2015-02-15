/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />

module ViewModels {

    export class FillResourceViewModel extends SearchViewModel {

        public ResourceId: number;
        public FirstName: string;
        public LastName: string;
        public BRID: string;
        public StaffNumber: string;
        public ResourceName: KnockoutComputedFunctions;

        public Vacancy: KnockoutObservableAny;
        public ActualStartDate: KnockoutObservableDate;

        public FillUri: string;
        public IsFilling: KnockoutObservableBool;
        public CanFill: KnockoutComputedFunctions;

        constructor(searchUri: string, fillUri: string, model: any)
        {
            super(searchUri);
            this.FillUri = fillUri;

            this.ResourceId = model.ResourceId;
            this.FirstName = model.FirstName;
            this.LastName = model.LastName;
            this.BRID = model.BRID;
            this.StaffNumber = model.StaffNumber;
            this.ResourceName = ko.computed(() => {
                return this.LastName + ', ' + this.FirstName;
            });

            this.Vacancy = ko.observable({});
            this.ActualStartDate = ko.observable(new Date());

            this.IsFilling = ko.observable(false);
            this.CanFill = ko.computed(this.cb_ComputeCanFill);
        }

        Fill() {
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
                success: (result: IFillVacancyResponse) => {
                    this.IsFilling(false);
                    if (result.Success) {
                        alert('This vacancy has been filled.');
                        location.href = document.referrer;
                    }
                    else {
                        alert(result.Message);
                    }
                }
            });
        }
        cb_Fill() { this.Fill(); }

        ComputeCanFill() {
            if (this.IsFilling())
                return false;
            if (this.Vacancy() == null)
                return false;
            if (this.Vacancy().VacancyId == null)
                return false;
            if (this.ActualStartDate() == null)
                return false;

            return true;
        }
        cb_ComputeCanFill() { return this.ComputeCanFill(); }

        SelectVacancy(vacancy: IViewVacanciesRecord) {
            this.Vacancy(vacancy);
        }
        cb_SelectVacancy(vacancy: IViewVacanciesRecord) { this.SelectVacancy(vacancy); }

        Search(searchRequest) {
            if(searchRequest == null) {
                searchRequest = {};
            } 
            searchRequest.OnlyFillable = true;

            super.Search(searchRequest);
        }
    }
}