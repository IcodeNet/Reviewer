/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../Shared/SearchFiltersViewModel.ts" />
/// <reference path="../SearchViewModel.ts" />

module ViewModels {

    export class BulkUpdateViewModel extends SearchViewModel {

        public SearchFiltersViewModel: any;

        SearchFormElement: any;
        SaveUri: any;
        public Editing: KnockoutObservableArray;

        public InOutStatus: KnockoutObservableString;
        public WorkLocationCountry: KnockoutObservableString;
        public WorkLocationSite: KnockoutObservableString;
        public ActualStartDate: KnockoutObservableDate;
        public ActualExitDate: KnockoutObservableDate;
        public ContractedHoursPerWeek: KnockoutObservableNumber;
        public UsualFTE: KnockoutObservableNumber;
        public Grade: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;
        public MaxContractedHoursPerWeek: KnockoutObservableNumber;
        public Supplier: KnockoutObservableString;
        public Seconded: KnockoutObservableString;
        public RecoveryMethod: KnockoutObservableString;
        public PercentageChargeability: KnockoutObservableString;
        public UnitCostValue: KnockoutObservableString;
        public ContractEndDate: KnockoutObservableDate;
        public PurchaseOrderNumber: KnockoutObservableString;
        public ResourceType: KnockoutObservableString;
        public RecruitmentStatus: KnockoutObservableString;
        public VacancyType: KnockoutObservableString;
        public SAPPositionNumber: KnockoutObservableString;
        public PlannedStartDate: KnockoutObservableDate;
        public PlannedExitDate: KnockoutObservableDate;
        public OrganisationalUnit: KnockoutObservableString;
        public LineManagerFirstName: KnockoutObservableString;
        public LineManagerLastName: KnockoutObservableString;
        public RoleTitle: KnockoutObservableString;
        public FunctionalTitle: KnockoutObservableString;
        public TechnologyRoleFamily: KnockoutObservableString;
        public ApplicationFocus: KnockoutObservableString;
        public ReasonForStarter: KnockoutObservableString;
        public TransferReason: KnockoutObservableString;
        public ReasonForLeaver: KnockoutObservableString;
        public ServiceType: KnockoutObservableString;
        public Status: KnockoutObservableString;
        public ReasonForGrowth: KnockoutObservableString;
        public CompanyStartDate: KnockoutObservableDate;
        public HasSearched: KnockoutObservableBool; 

        constructor(searchResourcesUri: string, saveUri: any, searchFormElement: any, searchFilterModel: any) {
            super(searchResourcesUri);

            this.SearchFiltersViewModel = new SearchFiltersViewModel(searchFilterModel.DomicileCountry, searchFilterModel.DomicileSite);

            this.SaveUri = saveUri;
            this.SearchFormElement = searchFormElement;
            this.Editing = new ko.observableArray();

            this.InOutStatus = ko.observable();
            this.WorkLocationCountry = ko.observable();
            this.WorkLocationSite = ko.observable();
            this.ActualStartDate = ko.observable();
            this.ActualExitDate = ko.observable();
            this.ContractedHoursPerWeek = ko.observable();
            this.UsualFTE = ko.observable();
            this.Grade = ko.observable();
            this.CostCentre = ko.observable();
            this.MaxContractedHoursPerWeek = ko.observable();
            this.Supplier = ko.observable();
            this.Seconded = ko.observable();
            this.RecoveryMethod = ko.observable();
            this.PercentageChargeability = ko.observable();
            this.UnitCostValue = ko.observable();
            this.ContractEndDate = ko.observable();
            this.PurchaseOrderNumber = ko.observable();
            this.ResourceType = ko.observable();
            this.RecruitmentStatus = ko.observable();
            this.VacancyType = ko.observable();
            this.PlannedStartDate = ko.observable();
            this.PlannedExitDate = ko.observable();
            this.SAPPositionNumber = ko.observable();
            this.OrganisationalUnit = ko.observable();
            this.LineManagerFirstName = ko.observable();
            this.LineManagerLastName = ko.observable();
            this.RoleTitle = ko.observable();
            this.FunctionalTitle = ko.observable();
            this.TechnologyRoleFamily = ko.observable();
            this.ApplicationFocus = ko.observable();
            this.ReasonForStarter = ko.observable();
            this.TransferReason = ko.observable();
            this.ReasonForLeaver = ko.observable();
            this.ServiceType = ko.observable();
            this.Status = ko.observable();
            this.ReasonForGrowth = ko.observable();
            this.CompanyStartDate = ko.observable();

            this.InOutStatus.subscribe((x) => { this.UpdateChildren('InOutStatus', x) });
            this.WorkLocationCountry.subscribe((x) => { this.UpdateChildren('WorkLocationCountry', x) });
            this.WorkLocationSite.subscribe((x) => { this.UpdateChildren('WorkLocationSite', x) });
            this.ActualStartDate.subscribe((x) => { this.UpdateChildren('ActualStartDate', x) });
            this.ActualExitDate.subscribe((x) => { this.UpdateChildren('ActualExitDate', x) });
            this.ContractedHoursPerWeek.subscribe((x) => { this.UpdateChildren('ContractedHoursPerWeek', x) });
            this.UsualFTE.subscribe((x) => { this.UpdateChildren('UsualFTE', x) });
            this.Grade.subscribe((x) => { this.UpdateChildren('Grade', x) });
            this.CostCentre.subscribe((x) => { this.UpdateChildren('CostCentre', x) });
            this.MaxContractedHoursPerWeek.subscribe((x) => { this.UpdateChildren('MaxContractedHoursPerWeek', x) });
            this.Supplier.subscribe((x) => { this.UpdateChildren('Supplier', x) });
            this.Seconded.subscribe((x) => { this.UpdateChildren('Seconded', x) });
            this.RecoveryMethod.subscribe((x) => { this.UpdateChildren('RecoveryMethod', x) });
            this.PercentageChargeability.subscribe((x) => { this.UpdateChildren('PercentageChargeability', x) });
            this.UnitCostValue.subscribe((x) => { this.UpdateChildren('UnitCostValue', x) });
            this.ContractEndDate.subscribe((x) => { this.UpdateChildren('ContractEndDate', x) });
            this.PurchaseOrderNumber.subscribe((x) => { this.UpdateChildren('PurchaseOrderNumber', x) });
            this.ResourceType.subscribe((x) => { this.UpdateChildren('ResourceType', x) });
            this.RecruitmentStatus.subscribe((x) => { this.UpdateChildren('RecruitmentStatus', x) });
            this.VacancyType.subscribe((x) => { this.UpdateChildren('VacancyType', x) });
            this.PlannedStartDate.subscribe((x) => { this.UpdateChildren('PlannedStartDate', x) });
            this.PlannedExitDate.subscribe((x) => { this.UpdateChildren('PlannedExitDate', x) });
            this.SAPPositionNumber.subscribe((x) => { this.UpdateChildren('SAPPositionNumber', x) });
            this.OrganisationalUnit.subscribe((x) => { this.UpdateChildren('OrganisationalUnit', x) });
            this.LineManagerFirstName.subscribe((x) => { this.UpdateChildren('LineManagerFirstName', x) });
            this.LineManagerLastName.subscribe((x) => { this.UpdateChildren('LineManagerLastName', x) });
            this.RoleTitle.subscribe((x) => { this.UpdateChildren('RoleTitle', x) });
            this.FunctionalTitle.subscribe((x) => { this.UpdateChildren('FunctionalTitle', x) });
            this.TechnologyRoleFamily.subscribe((x) => { this.UpdateChildren('TechnologyRoleFamily', x) });
            this.ApplicationFocus.subscribe((x) => { this.UpdateChildren('ApplicationFocus', x) });
            this.ReasonForStarter.subscribe((x) => { this.UpdateChildren('ReasonForStarter', x) });
            this.TransferReason.subscribe((x) => { this.UpdateChildren('TransferReason', x) });
            this.ReasonForLeaver.subscribe((x) => { this.UpdateChildren('ReasonForLeaver', x) });
            this.ServiceType.subscribe((x) => { this.UpdateChildren('ServiceType', x) });
            this.Status.subscribe((x) => { this.UpdateChildren('Status', x) });
            this.ReasonForGrowth.subscribe((x) => { this.UpdateChildren('ReasonForGrowth', x) });
            this.CompanyStartDate.subscribe((x) => { this.UpdateChildren('CompanyStartDate', x) });

            this.HasSearched = ko.observable(false); 
        }

        UpdateChildren(propertyName: string, value: any) {
            this.Results().forEach((x) => {
                x[propertyName](value);
            });
        }

        Search(searchRequest: any) {
            this.HasSearched(true);

            $(".collapsibleContainerTitle", $("#searchFiltersCollapsibleContainer")).trigger("click");

            if (searchRequest == null)
                searchRequest = {};

            $.each($(this.SearchFormElement).serializeArray(), function (_, kv) {
                if (searchRequest[kv.name] == null) {
                    searchRequest[kv.name] = kv.value;
                }
            });

            super.Search(searchRequest);
        }

        Revert() {
            this.Search({});
        }
        cb_Revert() { this.Revert(); }


        OnResponse(response: ISearchResponse) {
            // Translate the response items to individual view models.
            var mappedResults = new Array();
            for (var i = 0; i < response.Results.length; i++) {
                var mappedResult = new BulkUpdateRecordViewModel(response.Results[i])
                mappedResults.push(mappedResult);
            }
            response.Results = mappedResults;

            super.OnResponse(response);
        }

        Save() {
            var updatingItems = new Array();

            $.each(this.Results(), (i, x: BulkUpdateRecordViewModel) => {
                if (x.IsDirty) {
                    updatingItems.push(x.GetSaveRecord());
                    x.Saving(true);
                }
            });

            var data = {
                Records: updatingItems
            };

            var enumerableResults = Enumerable.From(this.Results());

            this.IsLoading(true);
            $.ajax({
                type: 'POST',
                url: this.SaveUri,
                data: 'value=' + encodeURIComponent(JSON.stringify(data)),
                traditional: true,
                dataType: 'JSON',
                success: (result) => {

                    var results = <any[]>result.Results;

                    $.each(results, (i, r) => {
                        var vm = enumerableResults.FirstOrDefault(null, (x: BulkUpdateRecordViewModel) => {

                            if (r.ResourceId != null) {
                                return x.ResourceId == r.ResourceId
                                    } else if (r.VacancyId != null) {

                                return x.VacancyId == r.VacancyId;
                            } else {
                                return x.ResourceId == r.ResourceId || x.VacancyId == r.VacancyId;
                            }
                        });

                        if (r.Success) {
                            // Clear the vm from edit fields.
                            vm.Editing([]);
                            vm.IsDirty = false;
                            vm.IsError(false);
                        }
                        else {
                            vm.Errors = r.Errors;
                            vm.IsError(true);
                        }
                    });

                    this.IsLoading(false);
                }
            });
        }
        cb_Save() { this.Save(); }

        IsEditing(fieldName: string): boolean {
            return this.Editing.indexOf(fieldName) != -1;
        }
        cb_IsEditing(fieldName: string): boolean { return this.IsEditing(fieldName); }

        Edit(fieldName: string) {
            if (this.Editing.indexOf(fieldName) == -1) {
                this.Editing.push(fieldName);

                this.Results().forEach((x) => {
                    x.cb_Edit(fieldName);
                });
            }
        }
        cb_Edit(fieldName: string) { this.Edit(fieldName); }
    }

    export class BulkUpdateRecordViewModel extends HasCallbacks {

        private Item: any;

        public RoleId: number;
        public VacancyId: number;
        public ResourceId: number;

        public RoleStatus: string;
        public BRID: KnockoutObservableString;
        public ResourceType: KnockoutObservableString;
        public VacancyType: KnockoutObservableString;
        public IsSAP: boolean;
        public FirstName: KnockoutObservableString;
        public LastName: KnockoutObservableString;
        public DomicileCountry: KnockoutObservableString;
        public DomicileSite: KnockoutObservableString;
        public OnshoreOffshore: KnockoutObservableString;
        public SupplierCategory: KnockoutObservableString;
        public Supplier: KnockoutObservableString;
        public OrganisationalUnit: KnockoutObservableString;
        public OrganisationalUnitId: KnockoutObservableNumber;
        public RoleTitle: KnockoutObservableString;
        public FunctionalTitle: KnockoutObservableString;
        public TechnologyRoleFamily: KnockoutObservableString;
        public LineManagerFirstName: KnockoutObservableString;
        public LineManagerLastName: KnockoutObservableString;
        public InOutStatus: KnockoutObservableString;
        public RecruitmentStatus: KnockoutObservableString;
        public SanctionedReferenceNumber: KnockoutObservableString;
        public SanctionedDate: KnockoutObservableDate;
        public WorkLocationCountry: KnockoutObservableString;
        public WorkLocationSite: KnockoutObservableString;
        public StaffId: KnockoutObservableString;
        public NavigatorId: KnockoutObservableString;
        public Grade: KnockoutObservableString;
        public SAPPositionNumber: KnockoutObservableString;
        public ServiceType: KnockoutObservableString;
        public RecoveryMethod: KnockoutObservableString;
        public UnitCostValue: KnockoutObservableString;
        public PercentageChargeability: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;
        public ContractedHoursPerWeek: KnockoutObservableNumber;
        public MaxContractedHoursPerWeek: KnockoutObservableNumber;
        public PlannedStartDate: KnockoutObservableDate;
        public PlannedExitDate: KnockoutObservableDate;
        public ActualStartDate: KnockoutObservableDate;
        public ActualExitDate: KnockoutObservableDate;
        public ReasonForStarter: KnockoutObservableString;
        public ReasonForLeaver: KnockoutObservableString;
        public WFPStatus: KnockoutObservableString;
        public UsualFTE: KnockoutObservableNumber;
        public Seconded: KnockoutObservableString;
        public ContractEndDate: KnockoutObservableDate;
        public PurchaseOrderNumber: KnockoutObservableString;
        public ApplicationFocus: KnockoutObservableString;
        public TransferReason: KnockoutObservableString;
        public Status: KnockoutObservableString;
        public ReasonForGrowth: KnockoutObservableString;
        public CompanyStartDate: KnockoutObservableDate;

        public IsDirty: boolean;
        public Editing: KnockoutObservableArray;
        public Saving: KnockoutObservableBool;
        public IsError: KnockoutObservableBool;
        public Errors: any[];

        constructor(item: any) {
            super();

            this.IsDirty = false;
            this.Item = item;

            this.RoleId = item.RoleId;
            this.VacancyId = item.VacancyId;
            this.ResourceId = item.ResourceId;

            this.RoleStatus = item.RoleStatus;
            this.BRID = ko.observable(item.BRID);
            this.ResourceType = ko.observable(item.ResourceType);
            this.VacancyType = ko.observable(item.VacancyType);
            this.IsSAP = item.IsSAP;
            this.FirstName = ko.observable(item.FirstName);
            this.LastName = ko.observable(item.LastName);
            this.DomicileCountry = ko.observable(item.DomicileCountry);
            this.DomicileSite = ko.observable(item.DomicileSite);
            this.OnshoreOffshore = ko.observable(item.OnshoreOffshore);
            this.SupplierCategory = ko.observable(item.SupplierCategory);
            this.Supplier = ko.observable(item.Supplier);
            this.OrganisationalUnit = ko.observable(item.OrganisationalUnit);
            this.OrganisationalUnitId = ko.observable(item.OrganisationalUnitId);
            this.RoleTitle = ko.observable(item.RoleTitle);
            this.FunctionalTitle = ko.observable(item.FunctionalTitle);
            this.TechnologyRoleFamily = ko.observable(item.TechnologyRoleFamily);
            this.LineManagerFirstName = ko.observable(item.LineManagerFirstName);
            this.LineManagerLastName = ko.observable(item.LineManagerLastName);
            this.InOutStatus = ko.observable(item.InOutStatus);
            this.RecruitmentStatus = ko.observable(item.RecruitmentStatus);
            this.SanctionedReferenceNumber = ko.observable(item.SanctionedReferenceNumber);
            this.SanctionedDate = ko.observable(item.SanctionedDate);
            this.WorkLocationCountry = ko.observable(item.WorkLocationCountry);
            this.WorkLocationSite = ko.observable(item.WorkLocationSite);
            this.StaffId = ko.observable(item.StaffId);
            this.NavigatorId = ko.observable(item.NavigatorId);
            this.Grade = ko.observable(item.Grade);
            this.SAPPositionNumber = ko.observable(item.SAPPositionNumber);
            this.ServiceType = ko.observable(item.ServiceType);
            this.RecoveryMethod = ko.observable(item.RecoveryMethod);
            this.UnitCostValue = ko.observable(item.UnitCostValue);
            this.PercentageChargeability = ko.observable(item.PercentageChargeability);
            this.CostCentre = ko.observable(item.CostCentre);
            this.ContractedHoursPerWeek = ko.observable(item.ContractedHoursPerWeek);
            this.MaxContractedHoursPerWeek = ko.observable(item.MaxContractedHoursPerWeek);
            this.UsualFTE = ko.observable(item.UsualFTE);
            this.ReasonForStarter = ko.observable(item.ReasonForStarter);
            this.ReasonForLeaver = ko.observable(item.ReasonForLeaver);
            this.WFPStatus = ko.observable(item.WFPStatus);
            this.Seconded = ko.observable(item.Seconded);
            this.PurchaseOrderNumber = ko.observable(item.PurchaseOrderNumber);
            this.ApplicationFocus = ko.observable(item.ApplicationFocus);
            this.TransferReason = ko.observable(item.TransferReason);
            this.Status = ko.observable(item.Status);
            this.ReasonForGrowth = ko.observable(item.ReasonForGrowth);

            this.PlannedStartDate = ko.observable();
            this.PlannedExitDate = ko.observable();
            this.ActualStartDate = ko.observable();
            this.ActualExitDate = ko.observable();
            this.ContractEndDate = ko.observable();
            this.CompanyStartDate = ko.observable();

            if (item.PlannedStartDate)
                this.PlannedStartDate = ko.observable(this.DateFromISO(item.PlannedStartDate));
            if (item.PlannedExitDate)
                this.PlannedExitDate = ko.observable(this.DateFromISO(item.PlannedExitDate));
            if (item.ActualStartDate)
                this.ActualStartDate = ko.observable(this.DateFromISO(item.ActualStartDate));
            if (item.ActualExitDate)
                this.ActualExitDate = ko.observable(this.DateFromISO(item.ActualExitDate));
            if (item.ContractEndDate)
                this.ContractEndDate = ko.observable(this.DateFromISO(item.ContractEndDate));
            if (item.CompanyStartDate)
                this.CompanyStartDate = ko.observable(this.DateFromISO(item.CompanyStartDate));

            this.Editing = new ko.observableArray();
            this.Saving = new ko.observable(false);
            this.IsError = new ko.observable(false);
        }

        /// For IE8 (as usual).
        DateFromISO(s): Date {
            return (<any>Date).fromISO(s);
        }

        GetSaveRecord(): any {
            return {
                VacancyId: this.VacancyId,
                ResourceId: this.ResourceId,
                BRID: this.BRID(),
                ResourceType: this.ResourceType(),
                VacancyType: this.VacancyType(),
                IsSAP: this.IsSAP,
                FirstName: this.FirstName(),
                LastName: this.LastName(),
                DomicileCountry: this.DomicileCountry(),
                DomicileSite: this.DomicileSite(),
                OnshoreOffshore: this.OnshoreOffshore(),
                SupplierCategory: this.SupplierCategory(),
                Supplier: this.Supplier(),
                OrganisationalUnit: this.OrganisationalUnit(),
                OrganisationalUnitId: this.OrganisationalUnitId(),
                RoleTitle: this.RoleTitle(),
                FunctionalTitle: this.FunctionalTitle(),
                TechnologyRoleFamily: this.TechnologyRoleFamily(),
                LineManagerFirstName: this.LineManagerFirstName(),
                LineManagerLastName: this.LineManagerLastName(),
                InOutStatus: this.InOutStatus(),
                RecruitmentStatus: this.RecruitmentStatus(),
                SanctionedReferenceNumber: this.SanctionedReferenceNumber(),
                SanctionedDate: this.SanctionedDate(),
                WorkLocationCountry: this.WorkLocationCountry(),
                WorkLocationSite: this.WorkLocationSite(),
                StaffId: this.StaffId(),
                NavigatorId: this.NavigatorId(),
                Grade: this.Grade(),
                SAPPositionNumber: this.SAPPositionNumber(),
                ServiceType: this.ServiceType(),
                RecoveryMethod: this.RecoveryMethod(),
                UnitCostValue: this.UnitCostValue(),
                PercentageChargeability: this.PercentageChargeability(),
                CostCentre: this.CostCentre(),
                ContractedHoursPerWeek: this.ContractedHoursPerWeek(),
                MaxContractedHoursPerWeek: this.MaxContractedHoursPerWeek(),
                PlannedStartDate: this.PlannedStartDate(),
                PlannedExitDate: this.PlannedExitDate(),
                ActualStartDate: this.ActualStartDate(),
                ActualExitDate: this.ActualExitDate(),
                UsualFTE: this.UsualFTE(),
                ReasonForStarter: this.ReasonForStarter(),
                ReasonForLeaver: this.ReasonForLeaver(),
                WFPStatus: this.WFPStatus(),
                Seconded: this.Seconded(),
                ContractEndDate: this.ContractEndDate(),
                PurchaseOrderNumber: this.PurchaseOrderNumber(),
                ApplicationFocus: this.ApplicationFocus(),
                TransferReason: this.TransferReason(),
                Status: this.Status(),
                ReasonForGrowth: this.ReasonForGrowth(),
                CompanyStartDate: this.CompanyStartDate(),
            };
        }

        IsEditing(fieldName: string): boolean {
            return this.Editing.indexOf(fieldName) != -1;
        }
        cb_IsEditing(fieldName: string): boolean { return this.IsEditing(fieldName); }

        Edit(fieldName: string) {
            if (this.Editing.indexOf(fieldName) == -1) {
                this.IsDirty = true;
                this.Editing.push(fieldName);
            }
        }
        cb_Edit(fieldName: string) { this.Edit(fieldName); }

        ShowErrors() {
            $.each(this.Errors, (i, x) => {
                alert(x.ErrorMessage);
            });
        }
        cb_ShowErrors() { this.ShowErrors(); }
    }
}