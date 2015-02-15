/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {

    export interface OrgUnitNode {
        Name: string;
        Children: OrgUnitNode[];
        EntityId: number;

        Parent: OrgUnitNode;
    }

    export class OrgUnitDrillDownViewModel extends HasCallbacks {

        OnSelectedNodeChanged: Function;

        DisplayNode: KnockoutObservableAny;
        OrganizationalUnits: KnockoutObservableArray;
        AllOrganizationalUnits: OrgUnitNode[];

        SelectedOrgUnit: KnockoutObservableAny;
        IsSelected: KnockoutObservableBool;

        Element: any;
        IsControlEnabled: KnockoutObservableBool;

        ParentNode: any; 

        constructor(element: any, organizationalUnits: any) {
            super();

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

        SelectOrgUnit(orgUnitName: string)
        {
            var selectedNode = <OrgUnitNode>Enumerable.From(this.AllOrganizationalUnits).FirstOrDefault(null, (x: OrgUnitNode) => {
                return x.Name == orgUnitName;
            });
            if (selectedNode != null)
            {
                this.SelectedOrgUnit(selectedNode);
                this.DrillDown(selectedNode.Parent);
            }
        }
                
        SetParents(parentNode: any) {
            this.AllOrganizationalUnits.push(parentNode);

            $.each(parentNode.Children, (i, child) => {
                child.Parent = parentNode;
                this.SetParents(child);
            });
        }

        SelectedNodeChanged(node: OrgUnitNode) {
            this.SelectedOrgUnit(node);
            this.IsSelected(node != null);

            if (this.OnSelectedNodeChanged) {
                this.OnSelectedNodeChanged(node);
            }
        }
        cb_Select(node: OrgUnitNode) { this.SelectedNodeChanged(node); }

        DrillDown(node: OrgUnitNode) {
            this.DisplayNode(node);
            this.OrganizationalUnits(node.Children);
            this.IsSelected(false);
        }
        cb_DrillDown(node: OrgUnitNode) { this.DrillDown(node); }

        Back() {
            this.DrillDown(this.DisplayNode().Parent);
        }
        cb_Back() { this.Back(); }


        EnableOrgUnitSelector() {
            this.Element.unblock();
            this.IsControlEnabled(true);
        }
        cb_EnableOrgUnitSelector() { return this.EnableOrgUnitSelector(); }

        DisableOrgUnitSelector() {
            this.Element.block({ message: null });
            this.IsControlEnabled(false);
        }
        cb_DisableOrgUnitSelector() { return this.DisableOrgUnitSelector(); }

        ClearOrgUnitSelector() {
            this.SelectedOrgUnit(null);
            this.DrillDown(this.ParentNode);
        }
        cb_ClearOrgUnitSelector() { this.ClearOrgUnitSelector(); }
    }
}