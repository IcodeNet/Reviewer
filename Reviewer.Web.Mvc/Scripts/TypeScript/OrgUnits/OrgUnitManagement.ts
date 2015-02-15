/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {

    export class OrgUnitManagementViewModel extends HasCallbacks {
        // Declare the variables
        public SetOrgUnitToBusinessunitUri: string;
        public UnSetOrgUnitFromBusinessUnitsUri: string;
         
        OrganizationalUnits: KnockoutObservableArray;
        OrganizationalBusinessUnits: KnockoutObservableArray;

        RemovingOrgUnit: KnockoutObservableAny;
        
        IsLoading: KnockoutObservableBool;

        public SelectedOrgUnit: KnockoutObservableAny;
        public CanAddOrgUnit: KnockoutComputedFunctions;

        constructor() {
            super();

            // Initialize the variables
            this.IsLoading = ko.observable(false);
            this.SelectedOrgUnit = ko.observable({});
            this.OrganizationalUnits = ko.observableArray();
            this.OrganizationalBusinessUnits = ko.observableArray();
            this.RemovingOrgUnit = ko.observable('');

            this.CanAddOrgUnit = ko.computed(() => {
                var entityId = this.SelectedOrgUnit().EntityId;
                if (entityId == null) {
                    return false;
                }

                var exists = Enumerable.From(this.OrganizationalBusinessUnits()).Any((x) => { return x.EntityId == entityId });
                if (exists) {
                    return false;
                }

                return true;
            });
        }

        Populate(json: string) {
            var obj = <any>$.parseJSON(json);

            // Populate the list to only show Organizational Units that are not business units
            var UnitsThatAreNotBusinessUnits = Enumerable.From(obj.AllOrgUnits).Where((x) => {
                return x.IsBusinessUnit == false;
            }).ToArray();

            this.OrganizationalUnits(UnitsThatAreNotBusinessUnits);

            // Populate the grid to show the organizational units that are business units
            var UnitsThatAreBusinessUnits = Enumerable.From(obj.AllOrgUnits).Where((x) => {
                return x.IsBusinessUnit == true;
            }).ToArray();
             
            this.OrganizationalBusinessUnits(UnitsThatAreBusinessUnits);
        }
         
        SetIsBusinessUnit() {
            
                var data = { orgUnitId: this.SelectedOrgUnit().EntityId };

                this.IsLoading(true);
                $.post(this.SetOrgUnitToBusinessunitUri, data, (response) => {
                    if (response.Success == true) {
                        // Add the org unit to the business org unit list.
                        this.OrganizationalBusinessUnits.push(
                            {
                                EntityId: this.SelectedOrgUnit().EntityId, 
                                OrgTitle: this.SelectedOrgUnit().Name
                            });
                    } else {
                        alert(response.Message);
                    }

                    // Finished with the view model
                    this.IsLoading(false);

                }, 'JSON');
        } 

        UnSetBusinessUnit(orgUnit: any) {
            var data = { orgUnitId: orgUnit.EntityId };

            this.IsLoading(true);

            $.post(this.UnSetOrgUnitFromBusinessUnitsUri, data, (response) => {
                if (response.Success == true) {

                    // Unset the org unit from a business unit
                    this.OrganizationalBusinessUnits.remove(orgUnit);

                    // Add unit back to the all organizational unit list
                    this.OrganizationalUnits.push(orgUnit);
                } else {
                    alert(response.Message);
                }

                // Finished with the view model
                this.IsLoading(false);

            }, 'JSON');
        }

        OnOrgUnitSelected(node)
        {
            this.SelectedOrgUnit(node);
        }
        cb_OnOrgUnitSelected(node) { this.OnOrgUnitSelected(node); }
    }
}