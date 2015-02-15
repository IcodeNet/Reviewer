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
    var OrgUnitManagementViewModel = (function (_super) {
        __extends(OrgUnitManagementViewModel, _super);
        function OrgUnitManagementViewModel() {
            var _this = this;
            _super.call(this);

            // Initialize the variables
            this.IsLoading = ko.observable(false);
            this.SelectedOrgUnit = ko.observable({});
            this.OrganizationalUnits = ko.observableArray();
            this.OrganizationalBusinessUnits = ko.observableArray();
            this.RemovingOrgUnit = ko.observable('');

            this.CanAddOrgUnit = ko.computed(function () {
                var entityId = _this.SelectedOrgUnit().EntityId;
                if (entityId == null) {
                    return false;
                }

                var exists = Enumerable.From(_this.OrganizationalBusinessUnits()).Any(function (x) {
                    return x.EntityId == entityId;
                });
                if (exists) {
                    return false;
                }

                return true;
            });
        }
        OrgUnitManagementViewModel.prototype.Populate = function (json) {
            var obj = $.parseJSON(json);

            // Populate the list to only show Organizational Units that are not business units
            var UnitsThatAreNotBusinessUnits = Enumerable.From(obj.AllOrgUnits).Where(function (x) {
                return x.IsBusinessUnit == false;
            }).ToArray();

            this.OrganizationalUnits(UnitsThatAreNotBusinessUnits);

            // Populate the grid to show the organizational units that are business units
            var UnitsThatAreBusinessUnits = Enumerable.From(obj.AllOrgUnits).Where(function (x) {
                return x.IsBusinessUnit == true;
            }).ToArray();

            this.OrganizationalBusinessUnits(UnitsThatAreBusinessUnits);
        };

        OrgUnitManagementViewModel.prototype.SetIsBusinessUnit = function () {
            var _this = this;
            var data = { orgUnitId: this.SelectedOrgUnit().EntityId };

            this.IsLoading(true);
            $.post(this.SetOrgUnitToBusinessunitUri, data, function (response) {
                if (response.Success == true) {
                    // Add the org unit to the business org unit list.
                    _this.OrganizationalBusinessUnits.push({
                        EntityId: _this.SelectedOrgUnit().EntityId,
                        OrgTitle: _this.SelectedOrgUnit().Name
                    });
                } else {
                    alert(response.Message);
                }

                // Finished with the view model
                _this.IsLoading(false);
            }, 'JSON');
        };

        OrgUnitManagementViewModel.prototype.UnSetBusinessUnit = function (orgUnit) {
            var _this = this;
            var data = { orgUnitId: orgUnit.EntityId };

            this.IsLoading(true);

            $.post(this.UnSetOrgUnitFromBusinessUnitsUri, data, function (response) {
                if (response.Success == true) {
                    // Unset the org unit from a business unit
                    _this.OrganizationalBusinessUnits.remove(orgUnit);

                    // Add unit back to the all organizational unit list
                    _this.OrganizationalUnits.push(orgUnit);
                } else {
                    alert(response.Message);
                }

                // Finished with the view model
                _this.IsLoading(false);
            }, 'JSON');
        };

        OrgUnitManagementViewModel.prototype.OnOrgUnitSelected = function (node) {
            this.SelectedOrgUnit(node);
        };
        OrgUnitManagementViewModel.prototype.cb_OnOrgUnitSelected = function (node) {
            this.OnOrgUnitSelected(node);
        };
        return OrgUnitManagementViewModel;
    })(HasCallbacks);
    ViewModels.OrgUnitManagementViewModel = OrgUnitManagementViewModel;
})(ViewModels || (ViewModels = {}));
