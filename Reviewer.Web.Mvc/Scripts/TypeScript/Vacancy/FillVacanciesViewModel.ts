/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />

module ViewModels {
    export class FillVacanciesViewModel extends SearchViewModel {
        FillUri: string;
        Element: any;
        IsFilling: KnockoutObservableBool;
        CanFill: KnockoutComputedFunctions;
        OnFill: Function;

        public Vacancy: KnockoutObservableAny;
        public Resource: KnockoutObservableAny;

        public ResourceName: KnockoutObservableString;
        public StaffID: KnockoutObservableString;
        public OrgUnit: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;

        public FirstName: KnockoutObservableString;
        public LastName: KnockoutObservableString;
        public BRID: KnockoutObservableString;
        public StaffNumber: KnockoutObservableString;
        public ActualStartDate: KnockoutObservableDate;

        public IsSAP: KnockoutObservableFunctions;

        constructor(fillUri: string, searchResourcesUri: string, element : any)
        {
            super(searchResourcesUri);

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
            this.IsSAP = ko.computed(() => {
                if (this.Vacancy())
                {
                    return this.Vacancy().IsSAP;
                }
                return false;
            });
        }

        Clear()
        {
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
        }

        Search(searchRequest: IResourceSearchRequestModel)
        {
            this.Resource({});

            searchRequest.Name = this.ResourceName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();
            searchRequest.OnlyOrphan = true;

            super.Search(searchRequest);
        }

        SelectResource(resource: IResourceDto)
        {
            this.Resource(resource);
        }
        cb_SelectResource(resource: IResourceDto) { this.SelectResource(resource); }

        Close() {
            $(this.Element).modal('hide');
        }
        cb_Close() { this.Close(); }

        Fill() {
            this.IsFilling(true);

            var data = {
                vacancyId: this.Vacancy().VacancyId,
                resourceId: this.Resource().ResourceId,

                firstName: this.FirstName(),
                lastName: this.LastName(),
                BRID: this.BRID(),
                StaffNumber: this.StaffNumber(),
                ActualStartDate:
                    this.ActualStartDate().getFullYear() + '-' +
                    (this.ActualStartDate().getMonth() + 1) + '-' +
                    this.ActualStartDate().getDate()
            };

            $.ajax({
                type: "POST",
                url: this.FillUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result: IFillVacancyResponse) => {
                    this.IsFilling(false);
                    if (result.Success)
                    {
                        alert('This vacancy has been filled.');
                        this.Close();
                        if (this.OnFill != null)
                            this.OnFill();
                    }
                    else
                    {
                        alert(result.Message);
                    }
                }
            });
        }
        cb_Fill() { this.Fill(); }

        ComputeCanFill() {
            var hasVacancy = this.Vacancy().VacancyId != null;
            var hasResource = this.Resource().ResourceId != null;
            var isFilling = this.IsFilling();
            var validNewResource = this.FirstName() != '' &&
                this.LastName() != '' &&
                this.BRID() != '' &&
                this.StaffNumber() != '';

            if (isFilling)
                return false;

            if (!hasVacancy)
                return false;

            if (hasResource || validNewResource) {
                return true;
            }

            return false;
        }
        cb_ComputeCanFill() { return this.ComputeCanFill(); }
    }

}