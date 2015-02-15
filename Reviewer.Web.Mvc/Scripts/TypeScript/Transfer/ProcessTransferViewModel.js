/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var ProcessTransferViewModel = (function (_super) {
        __extends(ProcessTransferViewModel, _super);
        function ProcessTransferViewModel(processTransfer, element) {
            var _this = this;
            _super.call(this);

            this.ProcessTransferUri = processTransfer;
            this.Element = element;

            this.ActiveRequests = ko.observable(0);
            this.IsLoading = ko.computed(function () {
                return _this.ActiveRequests() != 0;
            });

            this.IsCostCentre = ko.observable(true);

            this.ApproveReject = ko.observable('');
            this.ApproveRejectList = ko.observableArray(["Approve", "Reject"]);
            this.RejectionReason = ko.observable('');

            this.EffectiveFromDate = ko.observable('');
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
            this.CanAddOrgUnit = ko.computed(function () {
                return _this.SelectedOrgUnit() != '';
            });

            this.CostCentre.subscribe(this.cb_ValidateCostCentre);
        }
        ProcessTransferViewModel.prototype.Setup = function (transfer) {
            this.Transfer = transfer;

            this.EffectiveFromDate(moment(transfer.EffectiveFromDate).format('DD/MM/YYYY hh:mm:ss'));
            this.OrganisationalUnit(transfer.SenderOU);
            this.TransferReason(transfer.ReasonForTransfer);
            this.ResourceId = transfer.ResourceId;

            this.GetRecord(transfer.ResourceId);

            this.ApproveReject('');
            this.SelectedOrgUnit(transfer.ReceiverOU);
            (window).OrgUnitDrillDownViewModel.SelectOrgUnit(transfer.ReceiverOU);
            this.RejectionReason('');
        };

        ProcessTransferViewModel.prototype.GetRecord = function (resourceId) {
            var _this = this;
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
                success: function (result) {
                    _this.BusinessArea(result.BusinessArea);
                    _this.Level2(result.Level2);
                    _this.CostCentre(result.CostCentre);
                    _this.LineManagerFirstName(result.LineManagerFirstName);
                    _this.LineManagerLastName(result.LineManagerLastName);
                    _this.LineManagerNavigatorId(result.LineManagerNavigatorId);

                    _this.GetRecoveryCostCentre();

                    _this.EndRequest();
                }
            });
        };

        ProcessTransferViewModel.prototype.ValidateCostCentre = function () {
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
        };
        ProcessTransferViewModel.prototype.cb_ValidateCostCentre = function () {
            this.ValidateCostCentre();
        };

        ProcessTransferViewModel.prototype.GetRecoveryCostCentre = function () {
            var _this = this;
            this.IsCostCentre(true);
            this.RecoveryCostCentre('');

            if (this.IsCostCentre() != false) {
                var data = {
                    costCentre: this.CostCentre()
                };

                this.StartRequest();
                $.ajax({
                    type: "POST",
                    url: "/wfpmvc/CostCentreMappings/GetRecoveryCostCentre",
                    data: data,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        _this.RecoveryCostCentre(result.RecoveryCostCentre);
                        _this.EndRequest();
                    }
                });
            }

            this.ValidateCostCentre();
        };

        ProcessTransferViewModel.prototype.ComputeCanProcess = function () {
            if (this.IsLoading.peek() == true)
                return false;

            if (this.ApproveReject() == '')
                return false;
            if (this.SelectedOrgUnit() == '')
                return false;
            if (this.RejectionReason() == '' && this.ApproveReject() == 'Reject')
                return false;
            return true;
        };
        ProcessTransferViewModel.prototype.cb_ComputeCanProcess = function () {
            return this.ComputeCanProcess();
        };

        ProcessTransferViewModel.prototype.Process = function () {
            var _this = this;
            var data = {
                IsApproved: this.ApproveReject() == 'Approve',
                RejectionReason: this.RejectionReason(),
                TargetOrganizationalUnit: this.SelectedOrgUnit(),
                TransferId: this.Transfer.TransferId,
                EffectiveFromDate: this.EffectiveFromDate(),
                ReasonForTransfer: this.TransferReason()
            };

            this.StartRequest();

            $.ajax({
                type: "POST",
                url: this.ProcessTransferUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    _this.EndRequest();
                    _this.Close();

                    if (_this.OnProcess != null)
                        _this.OnProcess();

                    alert('Transfer has been processed.');
                }
            });
        };

        ProcessTransferViewModel.prototype.UpdateResource = function () {
            var _this = this;
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
                success: function (result) {
                    if (result.Success == true) {
                        _this.Process();
                    } else {
                        alert('Transfer not completed!');
                    }
                }
            });
        };
        ProcessTransferViewModel.prototype.cb_UpdateResource = function () {
            this.UpdateResource();
        };

        ProcessTransferViewModel.prototype.OnOrgUnitSelected = function (node) {
            this.SelectedOrgUnit(node.Name);
        };
        ProcessTransferViewModel.prototype.cb_OnOrgUnitSelected = function (node) {
            this.OnOrgUnitSelected(node);
        };

        ProcessTransferViewModel.prototype.cb_Process = function () {
            this.Process();
        };

        ProcessTransferViewModel.prototype.Close = function () {
            $(this.Element).modal('hide');
        };
        ProcessTransferViewModel.prototype.cb_Close = function () {
            this.Close();
        };

        ProcessTransferViewModel.prototype.StartRequest = function () {
            this.ActiveRequests(this.ActiveRequests() + 1);
        };

        ProcessTransferViewModel.prototype.EndRequest = function () {
            this.ActiveRequests(this.ActiveRequests() - 1);
        };
        return ProcessTransferViewModel;
    })(HasCallbacks);
    ViewModels.ProcessTransferViewModel = ProcessTransferViewModel;
})(ViewModels || (ViewModels = {}));
