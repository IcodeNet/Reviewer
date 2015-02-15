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
    var LeaverViewModel = (function (_super) {
        __extends(LeaverViewModel, _super);
        function LeaverViewModel(originalBrid, enteredBrid, action, exception, actualExitDate) {
            var _this = this;
            _super.call(this);

            // Initialize the variables
            this.Exception = exception;
            this.OriginalBRID = originalBrid;
            this.ActualExitDate = actualExitDate;
            this.EnteredBRID = ko.observable(enteredBrid);
            this.Action = ko.observable(action);
            this.EnteredBRID.subscribe(function (x) {
                if (x != _this.OriginalBRID) {
                    _this.Action(0);
                }
            });
            this.CanViewButtons = ko.computed(this.cb_ComputeCanViewRadioButtons);
            this.CanViewExcpetion = ko.computed(this.cb_ComputeCanViewExceptions);
            this.ActualDateHasBorder = ko.computed(this.cb_ComputeHasActualExitDate);
        }
        LeaverViewModel.prototype.ComputeCanViewRadioButtons = function () {
            if (this.OriginalBRID != this.EnteredBRID()) {
                return false;
            } else {
                return true;
            }
        };

        LeaverViewModel.prototype.cb_ComputeCanViewRadioButtons = function () {
            return this.ComputeCanViewRadioButtons();
        };

        LeaverViewModel.prototype.ComputeCanViewException = function () {
            if (this.Exception == "") {
                //do nothing
            } else {
                alert(this.Exception);
            }
        };

        LeaverViewModel.prototype.cb_ComputeCanViewExceptions = function () {
            return this.ComputeCanViewException();
        };

        LeaverViewModel.prototype.ComputeHasActualExitDate = function () {
            if (this.ActualExitDate == "") {
                document.getElementById("ActualExitDate").style.borderColor = "#FF0000";
            } else {
                document.getElementById("ActualExitDate").style.borderColor = "#CCCCCC";
            }
        };

        LeaverViewModel.prototype.cb_ComputeHasActualExitDate = function () {
            return this.ComputeHasActualExitDate();
        };
        return LeaverViewModel;
    })(HasCallbacks);
    ViewModels.LeaverViewModel = LeaverViewModel;
})(ViewModels || (ViewModels = {}));
