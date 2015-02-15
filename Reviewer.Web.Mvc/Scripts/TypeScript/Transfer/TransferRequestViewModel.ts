/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />

module ViewModels {

    export class TransferRequestViewModel extends SearchViewModel {
        private CreateTransferUri: string;

        public ResourceFirstName: KnockoutObservableString;
        public ResourceLastName: KnockoutObservableString;
        public StaffID: KnockoutObservableString;
        public OrgUnit: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;

        public ReceiverOrgUnit: KnockoutObservableString;
        public ReasonForTransfer: KnockoutObservableString;
        public EffectiveFromDate: KnockoutObservableDate;

        public CanCreateTransfer: KnockoutObservableFunctions;
        public HasResources: KnockoutObservableFunctions;
        public ResourceCount: KnockoutObservableFunctions;

        public IsCreatingTransfer: KnockoutObservableBool;

        constructor(searchResourceUri: string, createTransferUri: string) {
            super(searchResourceUri);
            this.CreateTransferUri = createTransferUri;

            this.IsCreatingTransfer = ko.observable(false);

            this.ReceiverOrgUnit = ko.observable('');
            this.ReasonForTransfer = ko.observable('');
            this.EffectiveFromDate = ko.observable(new Date());
            this.CanCreateTransfer = ko.computed(() => {
                if (this.ReceiverOrgUnit() == '')
                    return false;
                if (this.ReasonForTransfer() == '')
                    return false;
                if (this.EffectiveFromDate() == null)
                    return false;

                return true;
            });

            this.ResourceCount = ko.computed(() => {
                var count = Enumerable.From(this.Results()).Count((x) => { return x.IsSelected(); });
                return count;
            });
            this.HasResources = ko.computed(() => {
                var count = Enumerable.From(this.Results()).Count((x) => { return x.IsSelected(); });
                return count != 0;
            });

            this.ResourceFirstName = ko.observable('');
            this.ResourceLastName = ko.observable('');
            this.StaffID = ko.observable('');
            this.OrgUnit = ko.observable('');
            this.CostCentre = ko.observable('');

            
        }

        CreateTransfer() {
            this.IsCreatingTransfer(true);

            var resourceIds = Enumerable.From(this.Results()).Where((x) => { return x.IsSelected() }).Select((x) => { return x.ResourceId }).ToArray();

            var data = {
                ResourceIds: resourceIds,
                ReasonForTransfer: this.ReasonForTransfer(),
                ReceiverOrganizationalUnit: this.ReceiverOrgUnit(),
                EffectiveFromDate:
                    this.EffectiveFromDate().getFullYear() + '-' +
                    (this.EffectiveFromDate().getMonth() + 1) + '-' +
                    this.EffectiveFromDate().getDate()
            };

            $.ajax({
                type: "POST",
                url: this.CreateTransferUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {
                    if (result.Success)
                    {
                        this.Clear();
                    }
                    alert(result.Message);
                    this.IsCreatingTransfer(false);
                }
            });
        }
        cb_CreateTransfer() { this.CreateTransfer(); }

        Clear() {
            this.ResourceFirstName('');
            this.ResourceLastName('');
            this.StaffID('');
            this.OrgUnit('');
            this.CostCentre('');
            this.Results().forEach((x) => {
                x.IsSelected(false);
            });
        }

        Search(searchRequest: IResourceSearchRequestModel) {
            searchRequest.FirstName = this.ResourceFirstName();
            searchRequest.LastName = this.ResourceLastName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();

            super.Search(searchRequest);
        }

        OnResponse(response: ISearchResponse) {

            response.Results.forEach((x) => {
                x.IsSelected = ko.observable(false);
            });

            super.OnResponse(response);
        }

        OnOrgUnitSelected(node) {
            this.ReceiverOrgUnit(node.Name);
        }
        cb_OnOrgUnitSelected(node) { this.OnOrgUnitSelected(node); }
    }
}
