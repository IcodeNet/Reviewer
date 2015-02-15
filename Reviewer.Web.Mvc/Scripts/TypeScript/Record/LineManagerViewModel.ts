/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {
    export class LineManagerViewModel extends SearchViewModel {
        public LineManagerFirstName: KnockoutObservableString; 
        public LineManagerLastName: KnockoutObservableString; 
        public LineManagerNavigatorId: KnockoutObservableString; 

        public ResourceName: KnockoutObservableString;
        public StaffID: KnockoutObservableString;
        public OrgUnit: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;
        public Resource: KnockoutObservableAny;

        public CanSelect: KnockoutObservableBool; 

        Element: any; 

        constructor(searchResourcesUri: string, element: any) {
            super(searchResourcesUri); 

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

        SelectLineManager() {
            
        }
        cb_SelectLineManager() { this.SelectLineManager(); }

        Close() {
            $(this.Element).modal('hide'); 
        }
        cb_Close() {
            this.Close();
        }

        SelectResource(resource: IResourceDto) {
            this.Resource(resource);
            this.CanSelect(true);
            this.LineManagerFirstName(this.Resource().FirstName);
            this.LineManagerLastName(this.Resource().LastName);
            this.LineManagerNavigatorId(this.Resource().NavigatorID);
            this.Close();
        }
        cb_SelectResource(resource: IResourceDto) { this.SelectResource(resource); }

        Search(searchRequest: IResourceSearchRequestModel) {
            this.Resource({});

            searchRequest.Name = this.ResourceName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();

            super.Search(searchRequest);
        }
    }
}