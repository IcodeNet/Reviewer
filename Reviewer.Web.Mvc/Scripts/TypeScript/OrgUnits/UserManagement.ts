/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {
    export class OrgUserManagementViewModel extends HasCallbacks {
        public AddUserToOrgUnitUri: string;
        public RemoveUserFromOrgUnitUri: string;

        private IsLoading: KnockoutObservableBool;

        private FilterUsername: KnockoutObservableString;
        private FilterOrgUnit: KnockoutObservableString;

        private AssociatedUsers: KnockoutObservableArray;
        private AvailableBusinessUnits: KnockoutObservableArray;

        private AssociateUsername: KnockoutObservableString;
        private AssociateMode: KnockoutObservableString;
        private AssociateOrgUnitName: KnockoutObservableString;
        private AssociateBusinessUnitName: KnockoutObservableString;

        constructor()
        {
            super();

            this.IsLoading = ko.observable(false);
            this.AssociateUsername = ko.observable('');
            this.AssociateOrgUnitName = ko.observable('');
            this.AssociateBusinessUnitName = ko.observable('');
            this.AssociateMode = ko.observable('');
            this.AssociatedUsers = ko.observableArray();
            this.AvailableBusinessUnits = ko.observableArray();
            this.FilterUsername = ko.observable('');
            this.FilterOrgUnit = ko.observable('');
        }

        Populate(obj: any)
        {
            this.AssociatedUsers(jQuery.map(obj.AssociatedUsers, (v) => {
                return {
                    IsLoading: ko.observable(false),
                    Username: v.Username,
                    Role: v.Role,
                    OrgUnits: ko.observableArray(v.OrgUnits),
                    RemoveAssociation: this.RemoveAssociation
                };
            }));

            this.AvailableBusinessUnits(obj.AvailableBusinessUnits);
        }

        RemoveAssociation(associatedUser: any, orgUnit: any)
        {
            associatedUser.IsLoading(true);

            var data = { username: associatedUser.Username, orgUnit: orgUnit.OrganizationalUnit };
            $.post(this.RemoveUserFromOrgUnitUri, data, () => {

                // Remove the Org Unit from this Associated User.
                (<KnockoutObservableArray>associatedUser.OrgUnits).remove(orgUnit);
                associatedUser.IsLoading(false);

            }, 'JSON');
        }

        AddAssociation()
        {
            var username = this.AssociateUsername();
            var mode = this.AssociateMode();
            var orgUnitName;
            switch (mode) {
                case 'BusinessUnit':
                    orgUnitName = this.AssociateBusinessUnitName();
                    break;
                case 'OrganisationalUnit':
                    orgUnitName = this.AssociateOrgUnitName();
                    break;
                default:
                    alert('You must select a mode to create an association in.');
                    return;
            }

            if (orgUnitName == null || orgUnitName == '')
            {
                alert('You must select an Organisational Unit');
                return;
            }

            // Get the AssociatedUser if they already exist (ie, we are adding them to another Org Unit we control.)
            var associatedUser = Enumerable.From(this.AssociatedUsers()).FirstOrDefault(null, (x) => {
                return x.Username == username
            });

            if (associatedUser) {

                // Check if the associated user is already a member of this group.
                if (Enumerable.From(associatedUser.OrgUnits()).Any(x => x.OrganizationalUnit == orgUnitName)) {
                    alert('This user is already associated to the Organizational Unit \'' + orgUnitName + '\'.');
                    return;
                }

                associatedUser.IsLoading(true);
            }

            this.IsLoading(true);
            var data = { username: username, orgUnit: orgUnitName, mode: mode };
            $.post(this.AddUserToOrgUnitUri, data, (response) => {
                if (response.Success) {
                    // If the associated user does exist, create it.
                    if (associatedUser == null) {
                        associatedUser = {
                            Username: username,
                            Role: response.Role,
                            OrgUnits: ko.observableArray(),
                            RemoveAssociation: this.RemoveAssociation,
                            IsLoading: ko.observable(true)
                        };
                        this.AssociatedUsers.push(associatedUser);
                    }

                    // Add the Org Unit to the associated user.
                    associatedUser.OrgUnits.push({
                        OrganizationalUnit: orgUnitName,
                        Mode: mode,
                        CreatedBy: response.CreatedBy,
                        CreatedDate: response.CreatedDate
                    });
                }
                else
                {
                    alert(response.Message);
                }

                if (associatedUser)
                {
                    // Finished dealing with this Org Unit.
                    associatedUser.IsLoading(false);
                }

                // Finished dealing with this view model.
                this.IsLoading(false);
            }, 'JSON');
        }

        GetModeName(mode: string)
        {
            switch(mode)
            {
                case "BusinessUnit":
                    return "Business Unit";
                case "OrganisationalUnit":
                    return "Organisational Unit";
                default:
                    return "Unknown";
            }
        }

        OnOrgUnitSelected(node) {
            this.AssociateOrgUnitName(node.Name);
        }
        cb_OnOrgUnitSelected(node) { this.OnOrgUnitSelected(node); }
    }
}