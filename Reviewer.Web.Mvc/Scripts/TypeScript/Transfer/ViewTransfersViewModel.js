/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../Models.ts" />
/// <reference path="ProcessTransferViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var ViewTransfersViewModel = (function (_super) {
        __extends(ViewTransfersViewModel, _super);
        function ViewTransfersViewModel(searchUri, incoming, outgoing, processTransferUri, onlyRejected) {
            var _this = this;
            _super.call(this, searchUri);

            this.Incoming = incoming;
            this.Outgoing = outgoing;
            this.OnlyRejected = onlyRejected;

            this.ProcessTransferElement = $('#ProcessTransferViewModel')[0];
            this.ProcessTransferViewModel = ko.observable(new ViewModels.ProcessTransferViewModel(processTransferUri, this.ProcessTransferElement));
            this.ProcessTransferViewModel().OnProcess = function () {
                _this.cb_Search();
                if (_this.OnTransferApproved != null) {
                    _this.OnTransferApproved();
                }
            };
        }
        ViewTransfersViewModel.prototype.ProcessTransfer = function (transfer) {
            this.ProcessTransferViewModel().Setup(transfer);
            $(this.ProcessTransferElement).modal();
        };
        ViewTransfersViewModel.prototype.cb_ProcessTransfer = function (transfer) {
            this.ProcessTransfer(transfer);
        };

        ViewTransfersViewModel.prototype.Search = function (searchRequest) {
            searchRequest.Incoming = this.Incoming;
            searchRequest.Outgoing = this.Outgoing;
            searchRequest.OnlyRejected = this.OnlyRejected;

            _super.prototype.Search.call(this, searchRequest);
        };

        ViewTransfersViewModel.prototype.ComputeCanDoApprove = function () {
            return false;
        };
        ViewTransfersViewModel.prototype.cb_ComputeCanDoApprove = function () {
            return this.ComputeCanDoApprove();
        };

        ViewTransfersViewModel.prototype.OnResponse = function (response) {
            _super.prototype.OnResponse.call(this, response);
        };

        ViewTransfersViewModel.prototype.ParseRejectionReason = function (notes) {
            if (notes == null) {
                return '';
            } else {
                var parts = notes.split('\r', 1);
                return parts[0];
            }
        };
        return ViewTransfersViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.ViewTransfersViewModel = ViewTransfersViewModel;
})(ViewModels || (ViewModels = {}));
