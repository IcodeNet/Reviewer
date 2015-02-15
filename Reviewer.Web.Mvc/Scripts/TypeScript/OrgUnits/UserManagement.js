/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var OrgUserManagementViewModel = (function (_super) {
        __extends(OrgUserManagementViewModel, _super);
        function OrgUserManagementViewModel() {
            _super.call(this);

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
        OrgUserManagementViewModel.prototype.Populate = function (obj) {
            var _this = this;
            this.AssociatedUsers(jQuery.map(obj.AssociatedUsers, function (v) {
                return {
                    IsLoading: ko.observable(false),
                    Username: v.Username,
                    Role: v.Role,
                    OrgUnits: ko.observableArray(v.OrgUnits),
                    RemoveAssociation: _this.RemoveAssociation
                };
            }));

            this.AvailableBusinessUnits(obj.AvailableBusinessUnits);
        };

        OrgUserManagementViewModel.prototype.RemoveAssociation = function (associatedUser, orgUnit) {
            associatedUser.IsLoading(true);

            var data = { username: associatedUser.Username, orgUnit: orgUnit.OrganizationalUnit };
            $.post(this.RemoveUserFromOrgUnitUri, data, function () {
                // Remove the Org Unit from this Associated User.
                (associatedUser.OrgUnits).remove(orgUnit);
                associatedUser.IsLoading(false);
            }, 'JSON');
        };

        OrgUserManagementViewModel.prototype.AddAssociation = function () {
            var _this = this;
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

            if (orgUnitName == null || orgUnitName == '') {
                alert('You must select an Organisational Unit');
                return;
            }

            // Get the AssociatedUser if they already exist (ie, we are adding them to another Org Unit we control.)
            var associatedUser = Enumerable.From(this.AssociatedUsers()).FirstOrDefault(null, function (x) {
                return x.Username == username;
            });

            if (associatedUser) {
                if (Enumerable.From(associatedUser.OrgUnits()).Any(function (x) {
                    return x.OrganizationalUnit == orgUnitName;
                })) {
                    alert('This user is already associated to the Organizational Unit \'' + orgUnitName + '\'.');
                    return;
                }

                associatedUser.IsLoading(true);
            }

            this.IsLoading(true);
            var data = { username: username, orgUnit: orgUnitName, mode: mode };
            $.post(this.AddUserToOrgUnitUri, data, function (response) {
                if (response.Success) {
                    if (associatedUser == null) {
                        associatedUser = {
                            Username: username,
                            Role: response.Role,
                            OrgUnits: ko.observableArray(),
                            RemoveAssociation: _this.RemoveAssociation,
                            IsLoading: ko.observable(true)
                        };
                        _this.AssociatedUsers.push(associatedUser);
                    }

                    // Add the Org Unit to the associated user.
                    associatedUser.OrgUnits.push({
                        OrganizationalUnit: orgUnitName,
                        Mode: mode,
                        CreatedBy: response.CreatedBy,
                        CreatedDate: response.CreatedDate
                    });
                } else {
                    alert(response.Message);
                }

                if (associatedUser) {
                    // Finished dealing with this Org Unit.
                    associatedUser.IsLoading(false);
                }

                // Finished dealing with this view model.
                _this.IsLoading(false);
            }, 'JSON');
        };

        OrgUserManagementViewModel.prototype.GetModeName = function (mode) {
            switch (mode) {
                case "BusinessUnit":
                    return "Business Unit";
                case "OrganisationalUnit":
                    return "Organisational Unit";
                default:
                    return "Unknown";
            }
        };

        OrgUserManagementViewModel.prototype.OnOrgUnitSelected = function (node) {
            this.AssociateOrgUnitName(node.Name);
        };
        OrgUserManagementViewModel.prototype.cb_OnOrgUnitSelected = function (node) {
            this.OnOrgUnitSelected(node);
        };
        return OrgUserManagementViewModel;
    })(HasCallbacks);
    ViewModels.OrgUserManagementViewModel = OrgUserManagementViewModel;
})(ViewModels || (ViewModels = {}));
