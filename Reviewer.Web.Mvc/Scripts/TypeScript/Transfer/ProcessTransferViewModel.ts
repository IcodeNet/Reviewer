/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />

module ViewModels {

    export class ProcessTransferViewModel extends HasCallbacks {
        ProcessTransferUri: string;
        Element: any;
        Transfer: any;

        public ApproveReject: KnockoutObservableString;
        public ApproveRejectList: KnockoutObservableArray;
        public RejectionReason: KnockoutObservableString;
        public SelectedOrgUnit: KnockoutObservableString;
        public CanAddOrgUnit: KnockoutComputedFunctions;

        public EffectiveFromDate: KnockoutObservableString;
        public CostCentre: KnockoutObservableString;
        public RecoveryCostCentre: KnockoutObservableString;
        public OrganisationalUnit: KnockoutObservableString;
        public BusinessArea: KnockoutObservableString;
        public Level2: KnockoutObservableString;
        public TransferReason: KnockoutObservableString;
        public ResourceId: number;
        public LineManagerFirstName: KnockoutObservableString;
        public LineManagerLastName: KnockoutObservableString;
        public LineManagerNavigatorId: KnockoutObservableString;

        IsCostCentre: KnockoutObservableBool;

        private ActiveRequests: KnockoutObservableNumber;

        IsLoading: KnockoutComputedFunctions;
        OnProcess: Function;
        SelectOrgUnit: Function;

        CanProcess: KnockoutComputedFunctions;

        constructor(processTransfer: string, element: any) {
            super();

            this.ProcessTransferUri = processTransfer;
            this.Element = element;

            this.ActiveRequests = ko.observable(0);
            this.IsLoading = ko.computed(() => { return this.ActiveRequests() != 0 });

            this.IsCostCentre = ko.observable(true);

            this.ApproveReject = ko.observable('');
            this.ApproveRejectList = ko.observableArray(["Approve", "Reject"]);
            this.RejectionReason = ko.observable('');

            this.EffectiveFromDate = ko.observable('')
            this.CostCentre = ko.observable('');
            this.RecoveryCostCentre = ko.observable('');
            this.BusinessArea = ko.observable('');
            this.OrganisationalUnit = ko.observable('');
            this.Level2 = ko.observable('');
            this.TransferReason = ko.observable('');
            this.ResourceId = 0;

            this.LineManagerFirstName = ko.observable('');
            this.LineManagerLastName = ko.observable('');
            this.LineManagerNavigatorId = ko.observable('');

            this.CanProcess = ko.computed(this.cb_ComputeCanProcess);

            this.SelectedOrgUnit = ko.observable('');
            this.CanAddOrgUnit = ko.computed(() => {
                return this.SelectedOrgUnit() != '';
            });

            this.CostCentre.subscribe(this.cb_ValidateCostCentre);
        }

        Setup(transfer) {

            this.Transfer = transfer;

            this.EffectiveFromDate(moment(transfer.EffectiveFromDate).format('DD/MM/YYYY hh:mm:ss'));
            this.OrganisationalUnit(transfer.SenderOU);
            this.TransferReason(transfer.ReasonForTransfer);
            this.ResourceId = transfer.ResourceId;

            this.GetRecord(transfer.ResourceId);

            this.ApproveReject('');
            this.SelectedOrgUnit(transfer.ReceiverOU);
            (<any>window).OrgUnitDrillDownViewModel.SelectOrgUnit(transfer.ReceiverOU);
            this.RejectionReason('');
        }

        GetRecord(resourceId: number) {
            var data = {
                resourceId: resourceId,
                vacancyId: null
            };

            this.StartRequest();

            $.ajax({
                type: "POST",
                url: "/wfpmvc/Record/GetRecord",
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {

                    this.BusinessArea(result.BusinessArea);
                    this.Level2(result.Level2);
                    this.CostCentre(result.CostCentre);
                    this.LineManagerFirstName(result.LineManagerFirstName);
                    this.LineManagerLastName(result.LineManagerLastName);
                    this.LineManagerNavigatorId(result.LineManagerNavigatorId);

                    this.GetRecoveryCostCentre(); 

                    this.EndRequest();
                }
            });
        }

        ValidateCostCentre() {
            if (this.CostCentre() != null) {
                if (this.CostCentre().match(/^[0-9-]+$/) != null) {
                    if (this.CostCentre().length < 4) {
                        this.IsCostCentre(false);
                    } else {
                        this.IsCostCentre(true);
                    }
                } else {
                    this.IsCostCentre(false);
                }
            }
        }
        cb_ValidateCostCentre() { this.ValidateCostCentre(); }

        GetRecoveryCostCentre() {
            this.IsCostCentre(true);
            this.RecoveryCostCentre('');

            if (this.IsCostCentre() != false) {
                var data = {
                    costCentre: this.CostCentre()
                }

            this.StartRequest();
            $.ajax({
                    type: "POST",
                    url: "/wfpmvc/CostCentreMappings/GetRecoveryCostCentre",
                    data: data,
                    dataType: "json",
                    traditional: true,
                    success: (result) => {
                        this.RecoveryCostCentre(result.RecoveryCostCentre);
                        this.EndRequest();
                    }
                });
            }

            this.ValidateCostCentre();
        }

        ComputeCanProcess(): boolean {

            if (this.IsLoading.peek() == true)
                return false;

            //if (this.IsCostCentre() == false)
            //    return false;
            if (this.ApproveReject() == '')
                return false;
            if (this.SelectedOrgUnit() == '')
                return false;
            if (this.RejectionReason() == '' && this.ApproveReject() == 'Reject')
                return false;
            return true;
        }
        cb_ComputeCanProcess() { return this.ComputeCanProcess(); }

        Process() {
            var data = {
                IsApproved: this.ApproveReject() == 'Approve',
                RejectionReason: this.RejectionReason(),
                TargetOrganizationalUnit: this.SelectedOrgUnit(),
                TransferId: this.Transfer.TransferId,
                EffectiveFromDate: this.EffectiveFromDate(),
                ReasonForTransfer: this.TransferReason()
            }

            this.StartRequest();

            $.ajax({
                type: "POST",
                url: this.ProcessTransferUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {
                    this.EndRequest();
                    this.Close();

                    if (this.OnProcess != null)
                        this.OnProcess();

                    alert('Transfer has been processed.');
                }
            });
        }

        UpdateResource() {
            var data = {
                resourceId: this.ResourceId,
                value: this.CostCentre
            };

            $.ajax({
                type: "POST",
                url: "/wfpmvc/Resource/UpdateResource",
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {
                    if (result.Success == true) {
                        this.Process();
                    } else {
                        alert('Transfer not completed!')
                    }
                }
            });
        }
        cb_UpdateResource() { this.UpdateResource(); }

        OnOrgUnitSelected(node) {
            this.SelectedOrgUnit(node.Name);
        }
        cb_OnOrgUnitSelected(node) { this.OnOrgUnitSelected(node); }

        cb_Process() { this.Process() }

        Close() {
            $(this.Element).modal('hide');
        }
        cb_Close() { this.Close(); }

        StartRequest() {
            this.ActiveRequests(this.ActiveRequests() + 1);
        }

        EndRequest() {
            this.ActiveRequests(this.ActiveRequests() - 1);
        }

    }


}