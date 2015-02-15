/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var TransferRequestViewModel = (function (_super) {
        __extends(TransferRequestViewModel, _super);
        function TransferRequestViewModel(searchResourceUri, createTransferUri) {
            var _this = this;
            _super.call(this, searchResourceUri);
            this.CreateTransferUri = createTransferUri;

            this.IsCreatingTransfer = ko.observable(false);

            this.ReceiverOrgUnit = ko.observable('');
            this.ReasonForTransfer = ko.observable('');
            this.EffectiveFromDate = ko.observable(new Date());
            this.CanCreateTransfer = ko.computed(function () {
                if (_this.ReceiverOrgUnit() == '')
                    return false;
                if (_this.ReasonForTransfer() == '')
                    return false;
                if (_this.EffectiveFromDate() == null)
                    return false;

                return true;
            });

            this.ResourceCount = ko.computed(function () {
                var count = Enumerable.From(_this.Results()).Count(function (x) {
                    return x.IsSelected();
                });
                return count;
            });
            this.HasResources = ko.computed(function () {
                var count = Enumerable.From(_this.Results()).Count(function (x) {
                    return x.IsSelected();
                });
                return count != 0;
            });

            this.ResourceFirstName = ko.observable('');
            this.ResourceLastName = ko.observable('');
            this.StaffID = ko.observable('');
            this.OrgUnit = ko.observable('');
            this.CostCentre = ko.observable('');
        }
        TransferRequestViewModel.prototype.CreateTransfer = function () {
            var _this = this;
            this.IsCreatingTransfer(true);

            var resourceIds = Enumerable.From(this.Results()).Where(function (x) {
                return x.IsSelected();
            }).Select(function (x) {
                return x.ResourceId;
            }).ToArray();

            var data = {
                ResourceIds: resourceIds,
                ReasonForTransfer: this.ReasonForTransfer(),
                ReceiverOrganizationalUnit: this.ReceiverOrgUnit(),
                EffectiveFromDate: this.EffectiveFromDate().getFullYear() + '-' + (this.EffectiveFromDate().getMonth() + 1) + '-' + this.EffectiveFromDate().getDate()
            };

            $.ajax({
                type: "POST",
                url: this.CreateTransferUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    if (result.Success) {
                        _this.Clear();
                    }
                    alert(result.Message);
                    _this.IsCreatingTransfer(false);
                }
            });
        };
        TransferRequestViewModel.prototype.cb_CreateTransfer = function () {
            this.CreateTransfer();
        };

        TransferRequestViewModel.prototype.Clear = function () {
            this.ResourceFirstName('');
            this.ResourceLastName('');
            this.StaffID('');
            this.OrgUnit('');
            this.CostCentre('');
            this.Results().forEach(function (x) {
                x.IsSelected(false);
            });
        };

        TransferRequestViewModel.prototype.Search = function (searchRequest) {
            searchRequest.FirstName = this.ResourceFirstName();
            searchRequest.LastName = this.ResourceLastName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();

            _super.prototype.Search.call(this, searchRequest);
        };

        TransferRequestViewModel.prototype.OnResponse = function (response) {
            response.Results.forEach(function (x) {
                x.IsSelected = ko.observable(false);
            });

            _super.prototype.OnResponse.call(this, response);
        };

        TransferRequestViewModel.prototype.OnOrgUnitSelected = function (node) {
            this.ReceiverOrgUnit(node.Name);
        };
        TransferRequestViewModel.prototype.cb_OnOrgUnitSelected = function (node) {
            this.OnOrgUnitSelected(node);
        };
        return TransferRequestViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.TransferRequestViewModel = TransferRequestViewModel;
})(ViewModels || (ViewModels = {}));
