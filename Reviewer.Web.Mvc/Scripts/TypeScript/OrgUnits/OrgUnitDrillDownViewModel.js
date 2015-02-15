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
    var OrgUnitDrillDownViewModel = (function (_super) {
        __extends(OrgUnitDrillDownViewModel, _super);
        function OrgUnitDrillDownViewModel(element, organizationalUnits) {
            _super.call(this);

            this.Element = element;
            this.OrganizationalUnits = new ko.observableArray();

            this.IsControlEnabled = ko.observable(true);
            this.AllOrganizationalUnits = new Array();

            this.SelectedOrgUnit = ko.observable({ Name: 'root' });
            this.DisplayNode = ko.observable(null);
            this.IsSelected = ko.observable(false);

            var root = organizationalUnits;
            this.SetParents(root);
            this.DrillDown(root);

            this.ParentNode = root;
        }
        OrgUnitDrillDownViewModel.prototype.SelectOrgUnit = function (orgUnitName) {
            var selectedNode = Enumerable.From(this.AllOrganizationalUnits).FirstOrDefault(null, function (x) {
                return x.Name == orgUnitName;
            });
            if (selectedNode != null) {
                this.SelectedOrgUnit(selectedNode);
                this.DrillDown(selectedNode.Parent);
            }
        };

        OrgUnitDrillDownViewModel.prototype.SetParents = function (parentNode) {
            var _this = this;
            this.AllOrganizationalUnits.push(parentNode);

            $.each(parentNode.Children, function (i, child) {
                child.Parent = parentNode;
                _this.SetParents(child);
            });
        };

        OrgUnitDrillDownViewModel.prototype.SelectedNodeChanged = function (node) {
            this.SelectedOrgUnit(node);
            this.IsSelected(node != null);

            if (this.OnSelectedNodeChanged) {
                this.OnSelectedNodeChanged(node);
            }
        };
        OrgUnitDrillDownViewModel.prototype.cb_Select = function (node) {
            this.SelectedNodeChanged(node);
        };

        OrgUnitDrillDownViewModel.prototype.DrillDown = function (node) {
            this.DisplayNode(node);
            this.OrganizationalUnits(node.Children);
            this.IsSelected(false);
        };
        OrgUnitDrillDownViewModel.prototype.cb_DrillDown = function (node) {
            this.DrillDown(node);
        };

        OrgUnitDrillDownViewModel.prototype.Back = function () {
            this.DrillDown(this.DisplayNode().Parent);
        };
        OrgUnitDrillDownViewModel.prototype.cb_Back = function () {
            this.Back();
        };

        OrgUnitDrillDownViewModel.prototype.EnableOrgUnitSelector = function () {
            this.Element.unblock();
            this.IsControlEnabled(true);
        };
        OrgUnitDrillDownViewModel.prototype.cb_EnableOrgUnitSelector = function () {
            return this.EnableOrgUnitSelector();
        };

        OrgUnitDrillDownViewModel.prototype.DisableOrgUnitSelector = function () {
            this.Element.block({ message: null });
            this.IsControlEnabled(false);
        };
        OrgUnitDrillDownViewModel.prototype.cb_DisableOrgUnitSelector = function () {
            return this.DisableOrgUnitSelector();
        };

        OrgUnitDrillDownViewModel.prototype.ClearOrgUnitSelector = function () {
            this.SelectedOrgUnit(null);
            this.DrillDown(this.ParentNode);
        };
        OrgUnitDrillDownViewModel.prototype.cb_ClearOrgUnitSelector = function () {
            this.ClearOrgUnitSelector();
        };
        return OrgUnitDrillDownViewModel;
    })(HasCallbacks);
    ViewModels.OrgUnitDrillDownViewModel = OrgUnitDrillDownViewModel;
})(ViewModels || (ViewModels = {}));
